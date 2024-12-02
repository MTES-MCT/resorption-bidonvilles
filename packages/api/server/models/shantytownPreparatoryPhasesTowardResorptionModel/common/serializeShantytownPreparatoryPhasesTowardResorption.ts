import {
    ShantytownPreparatoryPhasesTowardResorptionRow,
    ShantytownPreparatoryPhaseTowardResorption,
} from '#root/types/resources/ShantytownPreparatoryPhasesTowardResorption.d';

function serialize(data: ShantytownPreparatoryPhasesTowardResorptionRow[]): { townId: number; preparatoryPhases: ShantytownPreparatoryPhaseTowardResorption[] }[] {
    const returnValue = data.reduce((acc, row) => {
        const townId = row.town_id;
        const preparatoryPhase: ShantytownPreparatoryPhaseTowardResorption = {
            preparatoryPhaseId: row.preparatory_phase_id,
            preparatoryPhaseName: row.preparatory_phase_name,
            preparatoryPhaseDateLabel: row.preparatory_phase_date_label,
            completedAt: row.completed_at !== null ? row.completed_at.getTime() / 1000 : null,
            createdAt: row.created_at !== null ? row.created_at.getTime() / 1000 : null,
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
    }, [] as { townId: number; preparatoryPhases: ShantytownPreparatoryPhaseTowardResorption[] }[]);
    return returnValue;
}

export default serialize;
