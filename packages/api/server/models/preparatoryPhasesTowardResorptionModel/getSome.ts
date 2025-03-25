import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { PreparatoryPhaseTowardResorption } from '#root/types/resources/PreparatoryPhaseTowardResorption.d';

export default async (ids: string[]): Promise<PreparatoryPhaseTowardResorption[]> => {
    const rows: PreparatoryPhaseTowardResorption[] = await sequelize.query(
        `SELECT
            uid,
            name,
            is_a_starting_phase,
            position
        FROM 
            preparatory_phases_toward_resorption pptr
        WHERE
            pptr.uid
        IN (:ids)`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                ids,
            },
        },
    );
    return rows;
};
