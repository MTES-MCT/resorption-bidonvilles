import ServiceError from '#server/errors/ServiceError';
import statsExportsModel from '#server/models/statsExportsModel';
import { Location } from '#server/models/geoModel/Location.d';
import { User } from '#root/types/resources/User.d';

type StatRow = {
    fk_region: string | null,
    fk_departement: string | null,
    fk_epci: string | null,
    fk_city: string | null,
    closed_shantytowns: boolean,
    exported_by: number,
};

export default async (user: User, locations: Location[], closedTowns: boolean): Promise<void> => {
    const stats: StatRow[] = [];
    const isNationalExport = locations.some(l => ['nation', 'metropole', 'outremer'].includes(l.type));

    if (isNationalExport) {
        stats.push({
            fk_region: null,
            fk_departement: null,
            fk_epci: null,
            fk_city: null,
            closed_shantytowns: closedTowns,
            exported_by: user.id,
        });
    } else {
        locations.forEach((l) => {
            const stat = {
                fk_region: null,
                fk_departement: null,
                fk_epci: null,
                fk_city: null,
                closed_shantytowns: closedTowns,
                exported_by: user.id,
            };
            stat[`fk_${l.type}`] = l[l.type].code;

            stats.push(stat);
        });
    }

    try {
        await Promise.all(stats.map(statsExportsModel.create));
    } catch (error) {
        throw new ServiceError('write_failed', error);
    }
};
