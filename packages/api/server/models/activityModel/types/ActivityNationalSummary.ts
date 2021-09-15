import { ActivityDepartementalSummary } from './ActivityDepartementalSummary';

type RegionCode = string;
type DepartementCode = string;

export type ActivityNationalSummary = Record<
    RegionCode,
    Record<DepartementCode, ActivityDepartementalSummary>
>;