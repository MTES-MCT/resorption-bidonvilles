import { sequelize } from '#db/sequelize';
import { Permission } from '#server/models/permissionModel/types/Permission.d';
import { BindOrReplacements, QueryTypes } from 'sequelize';

type ContactFormReferralRow = {
    first_name: string;
    last_name: string;
    email: string;
    departements: string[] | null;
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
            acc.push(`v_user_areas.${column}::text[] && ARRAY[:${column}]`);
            return acc;
        }, [] as string[]);

        if (clauses.length === 0) {
            return [];
        }

        where = `(${clauses.join(') OR (')})`;
    }

    return sequelize.query(
        `
        SELECT 
            INITCAP(users.first_name) AS first_name,
            UPPER(users.last_name) AS last_name,
            users.email,
            v_user_areas.departements,
            organizations.name AS organization_name,
            cfr.reason,
            cfr.reason_other,
            cfr.reason_word_of_mouth
        FROM
            contact_form_referrals AS cfr
        LEFT JOIN users ON fk_user = user_id
        LEFT JOIN v_user_areas ON v_user_areas.user_id = users.user_id AND v_user_areas.is_main_area IS TRUE
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
            ${where !== null ? `WHERE ${where}` : ''}`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
