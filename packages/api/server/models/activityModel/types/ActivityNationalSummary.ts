import { ActivityDepartementalSummary } from './ActivityDepartementalSummary';

type RegionCode = string;
type DepartementCode = string;

export type ActivityNationalSummary = {
    [regionCode: RegionCode]: {
        [departementCode: DepartementCode]: ActivityDepartementalSummary
    }
};
