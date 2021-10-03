const { sequelize } = require('#db/models');

module.exports = async () => {
    const users = await sequelize.query(
        `
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
            roles_regular.name AS role,
            users.user_id AS "user_id",
            users.fk_role AS "user_role",
            users.first_name AS "user_firstName",
            users.last_name AS "user_lastName",
            users.email AS "user_email",
            users.phone AS "user_phone",
            users.position AS "user_position",
            organizations.fk_type AS "type_id",
            organization_types.fk_category AS "type_category",
            organization_types.name_singular AS "type_name",
            organization_types.abbreviation AS "type_abbreviation"
        FROM localized_organizations AS organizations
        LEFT JOIN users ON users.fk_organization = organizations.organization_id
        LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
        LEFT JOIN roles_regular ON organization_types.fk_role = roles_regular.role_id
        WHERE
            organizations.active = TRUE
            AND
            users.fk_status = 'active'
        ORDER BY organizations.name, users.last_name, users.first_name
        `,
        {
            type: sequelize.QueryTypes.SELECT,
        },
    );

    const hash = {};
    const organizations = [];
    users.forEach((user) => {
        if (!Object.prototype.hasOwnProperty.call(hash, user.organization_id)) {
            hash[user.organization_id] = {
                id: user.organization_id,
                name: user.name,
                abbreviation: user.abbreviation,
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
                role: user.role,
            };
            organizations.push(hash[user.organization_id]);
        }

        if (user.user_id !== null) {
            hash[user.organization_id].users.push({
                id: user.user_id,
                role: user.user_role,
                first_name: user.user_firstName,
                last_name: user.user_lastName,
                email: user.user_email,
                phone: user.user_phone,
                position: user.user_position,
            });
        }
    });

    return organizations;
};
