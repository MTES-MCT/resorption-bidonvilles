import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { LocationType } from '#server/models/geoModel/LocationType.d';

type OrganizationRow = {
    organization_id: number,
    name: string,
    abbreviation: string | null,
    location_type: LocationType,
    region_code: string | null,
    region_name: string | null,
    departement_code: string | null,
    departement_name: string | null,
    epci_code: string | null,
    epci_name: string | null,
    city_code: string | null,
    city_name: string | null,
    city_main: string | null,
    being_funded: boolean,
    being_funded_at: Date,
    user_id: number,
    user_role_admin: string | null,
    user_firstName: string,
    user_lastName: string,
    user_email: string,
    user_phone: string | null,
    user_position: string,
    user_expertise_topic_id: string | null,
    user_expertise_topic_type: string | null,
    user_expertise_topic_label: string | null,
    user_role_regular: string,
    type_id: number,
    type_category: string,
    type_name: string,
    type_abbreviation: string | null,
};

type SerializedUserExpertiseTopics = {
    id: string,
    type: string,
    label: string,
};

type SerializedOrganizationUser = {
    id: number,
    is_admin: boolean,
    role: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string | null,
    position: string,
    expertise_topics: SerializedUserExpertiseTopics[],
};

export type SerializedOrganization = {
    id: number,
    name: string,
    abbreviation: string | null,
    being_funded: boolean,
    being_funded_at: Date,
    location: {
        type: LocationType,
        region: {
            code: string,
            name: string,
        } | null,
        departement: {
            code: string,
            name: string,
        } | null,
        epci: {
            code: string,
            name: string,
        } | null,
        city: {
            code: string,
            name: string,
            main: string | null,
        } | null,
    },
    type: {
        id: number,
        category: string,
        name: string,
        abbreviation: string | null,
    },
    users: SerializedOrganizationUser[],
};

export default async (): Promise<SerializedOrganization[]> => {
    const users: OrganizationRow[] = await sequelize.query(
        `
        WITH users_with_expertise_topics AS
        (SELECT
            utet.fk_user,
            utet.fk_expertise_topic,
            utet."type",
            et."label"
        FROM 
            user_to_expertise_topics utet
        LEFT JOIN
            expertise_topics et ON et.uid = utet.fk_expertise_topic)
        SELECT
            organizations.organization_id,
            organizations.name,
            organizations.abbreviation,
            organizations.location_type,
            organizations.region_code,
            organizations.region_name,
            organizations.departement_code,
            organizations.departement_name,
            organizations.epci_code,
            organizations.epci_name,
            organizations.city_code,
            organizations.city_name,
            organizations.city_main,
            organizations.being_funded,
            organizations.being_funded_at,
            users.user_id AS "user_id",
            user_roles_admin.name AS "user_role_admin",
            users.first_name AS "user_firstName",
            users.last_name AS "user_lastName",
            users.email AS "user_email",
            users.phone AS "user_phone",
            users.position AS "user_position",
            user_expertise_topics.fk_expertise_topic AS "user_expertise_topic_id",
            user_expertise_topics."type" AS "user_expertise_topic_type",
            user_expertise_topics."label" AS "user_expertise_topic_label",
            user_roles_regular.name AS user_role_regular,
            organizations.fk_type AS "type_id",
            organization_types.fk_category AS "type_category",
            organization_types.name_singular AS "type_name",
            organization_types.abbreviation AS "type_abbreviation"
        FROM localized_organizations AS organizations
        LEFT JOIN users ON users.fk_organization = organizations.organization_id
        LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
        LEFT JOIN roles_regular AS user_roles_regular ON users.fk_role_regular = user_roles_regular.role_id
        LEFT JOIN roles_admin AS user_roles_admin ON users.fk_role = user_roles_admin.role_id
        LEFT JOIN users_with_expertise_topics AS user_expertise_topics ON users.user_id = user_expertise_topics.fk_user
        WHERE
            organizations.active = TRUE
            AND
            users.fk_status = 'active'
            AND
            users.to_be_tracked = TRUE
        ORDER BY organizations.name, users.last_name, users.first_name
        `,
        {
            type: QueryTypes.SELECT,
        },
    );

    const hash: { [key: number]: SerializedOrganization } = {};
    const organizations: SerializedOrganization[] = [];
    users.forEach((user: OrganizationRow) => {
        if (!Object.prototype.hasOwnProperty.call(hash, user.organization_id)) {
            hash[user.organization_id] = {
                id: user.organization_id,
                name: user.name,
                abbreviation: user.abbreviation,
                being_funded: user.being_funded,
                being_funded_at: user.being_funded_at,
                location: {
                    type: user.location_type,
                    region: user.region_code !== null ? {
                        code: user.region_code,
                        name: user.region_name,
                    } : null,
                    departement: user.departement_code !== null ? {
                        code: user.departement_code,
                        name: user.departement_name,
                    } : null,
                    epci: user.epci_code !== null ? {
                        code: user.epci_code,
                        name: user.epci_name,
                    } : null,
                    city: user.city_code !== null ? {
                        code: user.city_code,
                        name: user.city_name,
                        main: user.city_main,
                    } : null,
                },
                type: {
                    id: user.type_id,
                    category: user.type_category,
                    name: user.type_name,
                    abbreviation: user.type_abbreviation,
                },
                users: [],
            };
            organizations.push(hash[user.organization_id]);
        }

        if (user.user_id !== null) {
            const existingUser = hash[user.organization_id].users.find(u => u.id === user.user_id);

            const serializedUser: SerializedOrganizationUser = {
                id: user.user_id,
                is_admin: user.user_role_admin !== null,
                role: user.user_role_admin || user.user_role_regular,
                first_name: user.user_firstName,
                last_name: user.user_lastName,
                email: user.user_email,
                phone: user.user_phone,
                position: user.user_position,
                expertise_topics: [],
            };

            if (user.user_expertise_topic_id !== null) {
                serializedUser.expertise_topics.push({
                    id: user.user_expertise_topic_id,
                    type: user.user_expertise_topic_type,
                    label: user.user_expertise_topic_label,
                });
            }

            if (!existingUser) {
                hash[user.organization_id].users.push(serializedUser);
            } else if (user.user_expertise_topic_id !== null) {
                // Si le user existe déjà, on merge expertise_topics
                existingUser.expertise_topics.push({
                    id: user.user_expertise_topic_id,
                    type: user.user_expertise_topic_type,
                    label: user.user_expertise_topic_label,
                });
            }
        }
    });
    return organizations;
};
