import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { PreparatoryPhaseTowardResorption } from '#root/types/resources/PreparatoryPhaseTowardResorption.d';

export default async (): Promise<PreparatoryPhaseTowardResorption[]> => {
    const rows: PreparatoryPhaseTowardResorption[] = await sequelize.query(
        `SELECT
            uid,
            name,
            is_a_starting_phase
        FROM 
            preparatory_phases_toward_resorption pptr
        WHERE 
            pptr.is_a_starting_phase IS TRUE ;`,
        {
            type: QueryTypes.SELECT,
        },
    );
    return rows;
};
