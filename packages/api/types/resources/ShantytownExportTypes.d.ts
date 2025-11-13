import { ShantytownWithFinancedAction, ShantytownWithOwner } from '#root/types/resources/Shantytown.d';

export type ShantytownExportListOption = 'address_details' | 'owner' | 'living_conditions' | 'demographics' | 'justice' | 'actors' | 'comments';

export type ShantytownExportListProperty = {
    title: string,
    data: (shantytown: ShantytownWithFinancedAction | ShantytownWithOwner) => string | number | Date | null,
    width: number,
    align?: 'left' | 'center' | 'right',
    bold?: boolean,
    sum?: boolean,
    link?: (shantytown: ShantytownWithFinancedAction) => string,
};

export type ShantytownExportSection = {
    title: string,
    properties?: ShantytownExportListProperty[],
    lastFrozen?: boolean,
    subsections?: ShantytownExportSection[],
};
