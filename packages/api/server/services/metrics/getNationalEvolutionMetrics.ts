import moment from 'moment';
import { NationalEvolutionMetricsRawData } from '#server/models/metricsModel/getNationalEvolutionData';
import metricsModel from '#server/models/metricsModel';
import ServiceError from '#server/errors/ServiceError';
import { NationalMetricsEvolution } from '#root/types/resources/NationalMetricsEvolution.d';
import { User } from '#root/types/resources/User.d';

moment.locale('fr');
const format = 'MMMM YYYY';

const safeParseInt = (value: string | number): number => {
    if (typeof value === 'string') {
        return parseInt(value, 10);
    }
    return value;
};

export default async (user: User, argFrom: Date, argTo: Date):Promise<NationalMetricsEvolution> => {
    let data:NationalEvolutionMetricsRawData[];
    try {
        data = await metricsModel.getNationalEvolutionData(user, argFrom, argTo);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const metrics = {
        shantytowns: {
            labels: [],
            count: [],
            onlyEUcount: [],
        },
        inhabitants: {
            labels: [],
            total: [],
            european: [],
            foreign: [],
        },
    } as NationalMetricsEvolution;

    data.forEach((row) => {
        const date = moment(row.month).format(format);

        metrics.shantytowns.labels.push(date[0].toUpperCase() + date.slice(1));
        metrics.shantytowns.count.push(safeParseInt(row.toutes_origin_shantytowns_count));
        metrics.shantytowns.onlyEUcount.push(safeParseInt(row.only_intra_eu_shantytowns_count));

        metrics.inhabitants.labels.push(date[0].toUpperCase() + date.slice(1));
        metrics.inhabitants.european.push(safeParseInt(row.intra_eu_count));
        metrics.inhabitants.foreign.push(safeParseInt(row.extra_eu_count));
        metrics.inhabitants.total.push(safeParseInt(row.toutes_origin_count));
    });

    return metrics;
};
