import moment from 'moment';
import geoUtils from '#server/utils/geo';
import shantytownModel from '#server/models/shantytownModel';
import where from '#server/utils/permission/where';

import { WhereClauseGroup } from '#server/models/_common/types/WhereClauseGroup';
import { Where } from '#server/models/_common/types/Where';
import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import actionModel from '#server/models/actionModel';
import enrichShantytown from '#server/services/shantytown/_common/enrichShantytownWithALeastOneActionFinanced';
import { ShantytownWithFinancedAction } from '#root/types/resources/Shantytown.d';
import { FinancedShantytownAction } from '#root/types/resources/Action.d';


export default async (user: AuthUser, locations: Location[], closedTowns: boolean): Promise<ShantytownWithFinancedAction[]> => {
    const isNationalExport = locations.some(l => ['nation', 'metropole', 'outremer'].includes(l.type));
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
    } else {
        const outremer = ['971', '972', '973', '974', '975', '976', '977', '978', '984', '986', '987', '988', '989'];
        locations.forEach((l) => {
            if (l.type === 'metropole') {
                filters.push({
                    status: {
                        query: 'departements.code',
                        not: true,
                        value: outremer,
                    },
                });
            } else if (l.type === 'outremer') {
                filters.push({
                    status: {
                        query: 'departements.code',
                        value: outremer,
                    },
                });
            }
        });
    }

    const towns = await shantytownModel.findAll(user, filters, 'export');

    const clauseGroup = where().can(user).do('read', 'action');
    const currentYear = moment(new Date()).format('YYYY');
    const townsWithFinancedActions = await actionModel.fetchFinancedActionsByYear(null, parseInt(currentYear, 10), clauseGroup);
    const transformedShantytowns = enrichShantytown(townsWithFinancedActions);
    return towns.map((town: ShantytownWithFinancedAction) => {
        const townWithFinancedActions: FinancedShantytownAction = transformedShantytowns.find((t:FinancedShantytownAction) => t.shantytown_id === town.id);
        if (townWithFinancedActions) {
            return {
                ...town,
                hasAtLeastOneActionFinanced: townWithFinancedActions.hasAtLeastOneActionFinanced,
            };
        }
        return town;
    });
};
