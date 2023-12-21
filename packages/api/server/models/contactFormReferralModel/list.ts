import { sequelize } from '#db/sequelize';
import { Permission } from '#server/models/permissionModel/types/Permission.d';
import { BindOrReplacements, QueryTypes } from 'sequelize';

type ContactFormReferralRow = {
    first_name: string;
    last_name: string;
    email: string;
    departements: string[];
    organization_name: string;
    reason: string;
    reason_other: string;
    reason_word_of_mouth: string;
};

export default async (permission: Permission): Promise<ContactFormReferralRow[]> => {
    if (permission === null) {
        return [];
    }

    let where: string = null;
    const replacements: BindOrReplacements = {};
    if (permission.allowed_on_national !== true) {
        const clauses = ['regions', 'departements', 'epci', 'cities'].reduce((acc, column) => {
            if (permission.allowed_on[column]?.length <= 0) {
                return acc;
            }

            replacements[column] = permission.allowed_on[column].map(l => l[l.type].code);
            acc.push(`user_intervention_areas.${column}::text[] && ARRAY[:${column}]`);
            return acc;
        }, [] as string[]);

        if (clauses.length === 0) {
            return [];
        }

        where = `(${clauses.join(') OR (')})`;
    }

    return sequelize.query(
        `
        WITH user_intervention_areas AS (
            SELECT
                users.user_id,
                COUNT(CASE WHEN intervention_areas.type = 'nation' THEN 1 ELSE null END) > 0 AS is_national,
                array_remove(array_agg(intervention_areas.fk_region), NULL) AS regions,
                array_remove(array_agg(intervention_areas.fk_departement), NULL) AS departements,
                array_remove(array_agg(intervention_areas.fk_epci), NULL) AS epci,
                array_remove(array_agg(intervention_areas.fk_city), NULL) AS cities
            FROM users
            LEFT JOIN intervention_areas ON (
                users.user_id = intervention_areas.fk_user
                OR (users.use_custom_intervention_area IS FALSE AND users.fk_organization = intervention_areas.fk_organization)
            )
            WHERE intervention_areas.is_main_area IS TRUE
            GROUP BY users.user_id
        )

        SELECT 
            INITCAP(users.first_name) AS first_name,
            UPPER(users.last_name) AS last_name,
            users.email,
            user_intervention_areas.departements,
            organizations.name AS organization_name,
            cfr.reason,
            cfr.reason_other,
            cfr.reason_word_of_mouth
        FROM
            contact_form_referrals AS cfr
        LEFT JOIN users ON fk_user = user_id
        LEFT JOIN user_intervention_areas ON user_intervention_areas.user_id = users.user_id
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
            ${where !== null ? `WHERE ${where}` : ''}`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
