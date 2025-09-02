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

    const towns = await shantytownModel.findAll(user, filters, 'export');
    if (towns.length === 0) {
        return [];
    }

    const clauseGroup = where().can(user).do('read', 'action');
    const currentYear = moment(new Date()).format('YYYY');
    const townsWithFinancedActions = await actionModel.fetchFinancedActionsByYear(null, parseInt(currentYear, 10), clauseGroup);
    const transformedShantytowns = enrichShantytown(townsWithFinancedActions);

    return Promise.all(towns.map(async (town: ShantytownWithFinancedAction) => {
        const townWithFinancedActions: FinancedShantytownAction = transformedShantytowns.find((t:FinancedShantytownAction) => t.shantytown_id === town.id);

        return {
            ...town,
            hasAtLeastOneActionFinanced: townWithFinancedActions ? townWithFinancedActions.hasAtLeastOneActionFinanced : undefined,
        };
    }));
};
