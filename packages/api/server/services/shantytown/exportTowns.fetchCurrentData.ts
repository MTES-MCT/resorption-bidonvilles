import geoUtils from '#server/utils/geo';
import shantytownModel from '#server/models/shantytownModel';

import { WhereClauseGroup } from '#server/models/_common/types/WhereClauseGroup';
import { Where } from '#server/models/_common/types/Where';
import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';

export default async (user: AuthUser, locations: Location[], closedTowns: boolean): Promise<Shantytown[]> => {
    const isNationalExport = locations.some(l => l.type === 'nation');
    const filters: Where = [
        {
            status: {
                not: closedTowns === true,
                value: 'open',
            },
        },
    ];

    if (!isNationalExport) {
        filters.push(
            locations.reduce((acc, l, index) => {
                acc[`location_${index}`] = {
                    query: `${geoUtils.fromGeoLevelToTableName(l.type)}.code`,
                    value: l[l.type].code,
                };

                if (l.type === 'city') {
                    acc[`location_main_${index}`] = {
                        query: 'cities.fk_main',
                        value: l[l.type].code,
                    };
                }

                return acc;
            }, {} as WhereClauseGroup),
        );
    }

    return shantytownModel.findAll(user, filters, 'export');
};
