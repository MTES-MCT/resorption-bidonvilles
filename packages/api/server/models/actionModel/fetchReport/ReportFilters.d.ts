export type ReportLocationFilter = {
    type?: string,
    typeUid: string,
    code?: string,
    organizationId?: number,
};

/**
 * Filtres de la liste des actions, reproduits côté SQL pour l'export Excel.
 * Une clé absente (ou une liste vide) désigne un filtre inactif.
 */
export type ReportFilters = {
    status?: 'open' | 'closed',
    search?: string,
    organizationId?: number,
    location?: ReportLocationFilter | null,
    topic?: string[],
    interventionLocation?: string[],
    dihalFinancing?: string[],
};
