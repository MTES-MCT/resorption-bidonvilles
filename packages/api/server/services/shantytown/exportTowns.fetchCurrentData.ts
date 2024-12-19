import moment from 'moment';
import geoUtils from '#server/utils/geo';
import shantytownModel from '#server/models/shantytownModel';
import where from '#server/utils/permission/where';

import { WhereClauseGroup } from '#server/models/_common/types/WhereClauseGroup';
import { Where } from '#server/models/_common/types/Where';
import { Location } from '#server/models/geoModel/Location.d';
import actionModel from '#server/models/actionModel';
import { ActionSelectRow } from '#server/models/actionModel/fetchByShantytown/fetchFinancedActionsByYear';
import { User } from '#root/types/resources/User.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';

type ShantytownWithFinancedAction = Shantytown & {
    hasAtLeastOneActionFinanced: boolean,
};

type FinancedShantytownAction = {
    shantytown_id: number,
    hasAtLeastOneActionFinanced: boolean,
};

function transformShantytowns(actions: ActionSelectRow[]): FinancedShantytownAction[] {
    const shantytownMap = actions.reduce((acc, action) => {
        if (!acc[action.shantytown_id]) {
            acc[action.shantytown_id] = {
                shantytown_id: action.shantytown_id,
                hasAtLeastOneActionFinanced: action.financed,
            };
        }
        return acc;
    }, {});

    return Object.values(shantytownMap);
}

export default async (user: User, locations: Location[], closedTowns: boolean): Promise<ShantytownWithFinancedAction[]> => {
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

    const clauseGroup = where().can(user).do('export', 'action');
    const currentYear = moment(new Date()).format('YYYY');
    const townsWithFinancedActions = await actionModel.fetchFinancedActionsByYear(null, parseInt(currentYear, 10), clauseGroup);
    const transformedShantytowns = transformShantytowns(townsWithFinancedActions);
    return towns.map((town: ShantytownWithFinancedAction) => {
        const townWithFinancedActions: FinancedShantytownAction = transformedShantytowns.find((t:FinancedShantytownAction) => t.shantytown_id === town.id);
        if (townWithFinancedActions) {
            // eslint-disable-next-line no-param-reassign
            town.hasAtLeastOneActionFinanced = townWithFinancedActions.hasAtLeastOneActionFinanced;
        }
        return town;
    });
};
