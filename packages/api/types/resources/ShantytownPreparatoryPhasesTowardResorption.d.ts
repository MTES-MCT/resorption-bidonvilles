export type ShantytownPreparatoryPhasesTowardResorptionRow = {
    town_id: number,
    preparatory_phase_id: string,
    created_at: Date,
    created_by: number,
    preparatory_phase_name: string,
    preparatory_phase_date_label: string,
    completed_at: Date,
    author_first_name: string,
    author_last_name: string,
    organization_id: number,
    organization_name: string,
};

export type ShantytownPreparatoryPhaseTowardResorption = {
    preparatoryPhaseId: string,
    preparatoryPhaseName: string,
    preparatoryPhaseDateLabel: string,
    completedAt: number | null,
    createdAt: number,
    isAStartingPhase?: boolean,
    createdBy: {
        authorId: number,
        authorFirstName: string,
        authorLastName: string,
        organizationName: string,
        organizationId: number,
    },
};

export type ShantytownPreparatoryPhasesTowardResorption = {
    townId: number,
    preparatoryPhases: ShantytownPreparatoryPhaseTowardResorption[],
};

export type SimplifiedPhase = {
    preparatoryPhaseId: string
    completedAt: number | null,
};

export type RawPhase = {
    uid: string,
    name: string,
    createdAt: Date,
    dateLabel: string,
    completedAt: Date | null,
    isAStartingPhase?: boolean,
};

export type Differences = {
    addedPhases: SimplifiedPhase[],
    removedPhases: SimplifiedPhase[],
    modifiedPhases: {
        preparatoryPhaseId: string,
        oldCompletedAt: string,
        newCompletedAt: string,
    }[],
};
