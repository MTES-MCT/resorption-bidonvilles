import { ExportedSitesStatus } from '#root/types/resources/exportedSitesStatus.d';

export type ShantytownFilters = {
    exportedSitesStatus: ExportedSitesStatus;
    population?: string;
    fieldType?: string;
    origin?: string;
    target?: string;
    justice?: string;
    administrativeOrder?: string;
    rhi?: string;
    conditions?: string;
    actors?: string;
    heatwave?: string;
    resorbedOrClosed?: string;
    closingReason?: string;
    closureYear?: string;
};

export type PostSqlFilters = Pick<ShantytownFilters, 'exportedSitesStatus' | 'actors' | 'conditions'>;
