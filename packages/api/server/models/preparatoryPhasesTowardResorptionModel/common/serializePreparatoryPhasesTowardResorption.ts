import {
    PreparatoryPhasesTowardResorptionRow,
    PreparatoryPhaseTowardResorption,
} from '#root/types/resources/PreparatoryPhasesTowardResorption.d';

function serialize(data: PreparatoryPhasesTowardResorptionRow[]): { townId: number; preparatoryPhases: PreparatoryPhaseTowardResorption[] }[] {
    const returnValue = data.reduce((acc, row) => {
        const townId = row.town_id;
        const preparatoryPhase: PreparatoryPhaseTowardResorption = {
            preparatoryPhaseId: row.preparatory_phase_id,
            preparatoryPhaseName: row.preparatory_phase_name,
            createdAt: row.created_at,
            createdBy: {
                authorId: row.created_by,
                authorFirstName: row.author_first_name,
                authorLastName: row.author_last_name,
                organizationName: row.organization_name,
                organizationId: row.organization_id,
            },
        };

        const existingEntry = acc.find(entry => entry.townId === townId);
        if (existingEntry) {
            existingEntry.preparatoryPhases.push(preparatoryPhase);
        } else {
            acc.push({ townId, preparatoryPhases: [preparatoryPhase] });
        }
        return acc;
    }, [] as { townId: number; preparatoryPhases: PreparatoryPhaseTowardResorption[] }[]);
    return returnValue;
}

export default serialize;
