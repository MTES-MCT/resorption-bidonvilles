export type ShantytownExportSortBy = 'cityName' | 'builtAt' | 'lastUpdatedAt' | 'declaredAt' | 'closedAt';

export type ShantytownExportSort = {
    sortBy: ShantytownExportSortBy;
    sortOrder: 'ASC' | 'DESC';
};
