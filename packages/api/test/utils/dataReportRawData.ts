import { DataReportRawData } from '#server/models/dataReportModel/getRawData';

export function row(override: Partial<DataReportRawData> = {}): DataReportRawData {
    const defaultObj: DataReportRawData = {
        shantytown_id: 1,
        input_date: new Date(2023, 0, 1),
        known_since: new Date(2023, 0, 1),
        closed_at: null,
        population_total: null,
        population_minors: null,
        origins: null,
        is_oversea: false,
    };

    return Object.assign(defaultObj, override);
}

export default row;
