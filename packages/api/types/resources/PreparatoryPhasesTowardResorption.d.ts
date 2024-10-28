export type PreparatoryPhasesTowardResorptionRow = {
    town_id: number,
    preparatory_phase_id: string,
    created_at: Date,
    created_by: number,
    preparatory_phase_name: string,
    author_first_name: string,
    author_last_name: string,
    organization_id: number,
    organization_name: string,
};

export type PreparatoryPhaseTowardResorption = {
    preparatoryPhaseId: string,
    preparatoryPhaseName: string,
    createdAt: Date,
    createdBy: {
        authorId: number,
        authorFirstName: string,
        authorLastName: string,
        organizationName: string,
        organizationId: number,
    },
};

export type PreparatoryPhasesTowardResorption = {
    townId: number,
    preparatoryPhases: PreparatoryPhaseTowardResorption[],
};
