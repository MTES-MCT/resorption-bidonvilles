import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownPreparatoryPhasesTowardResorption, ShantytownPreparatoryPhasesTowardResorptionRow } from '#root/types/resources/ShantytownPreparatoryPhasesTowardResorption.d';
import serializePreparatoryPhasesTowardResorption from './common/serializeShantytownPreparatoryPhasesTowardResorption';

export default async (user: AuthUser, ids: string[]): Promise<ShantytownPreparatoryPhasesTowardResorption[]> => {
    if (!user.isAllowedTo('list', 'shantytown')) {
        return [];
    }

    const rows: ShantytownPreparatoryPhasesTowardResorptionRow[] = await sequelize.query(
        `SELECT
            spptr.fk_shantytown AS town_id,
            pptr.uid AS preparatory_phase_id,
            spptr.created_at AS created_at,
            spptr.created_by AS created_by,
            pptr.name AS preparatory_phase_name,
            us.first_name as author_first_name,
            us.last_name as author_last_name,
            us.fk_organization as organization_id,
            o."name" as organization_name
        FROM 
            shantytown_preparatory_phases_toward_resorption spptr
        LEFT JOIN 
            preparatory_phases_toward_resorption pptr ON spptr.fk_preparatory_phase = pptr.uid
        LEFT JOIN
            users us ON us.user_id = spptr.created_by
        LEFT JOIN
            organizations o ON o.organization_id = us.fk_organization
        WHERE 
            spptr.fk_shantytown IN (:ids)`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                ids,
            },
        },
    );
    return serializePreparatoryPhasesTowardResorption(rows);
};
