import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { PreparatoryPhaseTowardResorption } from '#root/types/resources/PreparatoryPhaseTowardResorption.d';

export default async (startingPhasesOnly?: boolean): Promise<PreparatoryPhaseTowardResorption[]> => {
    let SQL = `
        SELECT
            uid,
            name,
            is_a_starting_phase,
            position
        FROM 
            preparatory_phases_toward_resorption pptr`;

    if (startingPhasesOnly) {
        SQL += `
        WHERE
            is_a_starting_phase = true
        `;
    }

    const rows: PreparatoryPhaseTowardResorption[] = await sequelize.query(
        SQL,
        {
            type: QueryTypes.SELECT,
        },
    );
    return rows;
};
