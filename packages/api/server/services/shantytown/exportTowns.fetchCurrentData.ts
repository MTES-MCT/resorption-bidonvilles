import moment from 'moment';
import geoUtils from '#server/utils/geo';
import shantytownModel from '#server/models/shantytownModel';
import where from '#server/utils/permission/where';

import { Where, WhereClauseGroup } from '#server/models/_common/types/Where';
import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import actionModel from '#server/models/actionModel';
import enrichShantytown from '#server/services/shantytown/_common/enrichShantytownWithALeastOneActionFinanced';
import { ShantytownWithFinancedAction } from '#root/types/resources/Shantytown.d';
import { FinancedShantytownAction } from '#root/types/resources/Action.d';
import { PostSqlFilters, ShantytownFilters } from '#root/types/resources/shantytownFilters.d';
import setQueryFilters from './exportTowns.setQueryFilters';

export default async (user: AuthUser, locations: Location[], filters: ShantytownFilters): Promise<ShantytownWithFinancedAction[]> => {
    const queryFilters: Where = setQueryFilters(filters);

    // Extraire les filtres post-SQL
    const postSqlFilters: PostSqlFilters = {
        exportedSitesStatus: filters.exportedSitesStatus,
        actors: filters.actors,
        conditions: filters.conditions,
    };


    const isNationalExport = locations.some(l => ['nation', 'metropole', 'outremer'].includes(l.type));

    const townsFilters: Where = [...queryFilters]; // Copie des filtres reçus

    if (!isNationalExport) {
        townsFilters.push(
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
                townsFilters.push({
                    status: {
                        query: 'departements.code',
                        not: true,
                        value: outremer,
                    },
                });
            } else if (l.type === 'outremer') {
                townsFilters.push({
                    status: {
                        query: 'departements.code',
                        value: outremer,
                    },
                });
            }
        });
    }

    let towns = await shantytownModel.findAll(user, townsFilters, 'export');

    // Filtre les sites en cours de résorption
    if (postSqlFilters.exportedSitesStatus === 'inProgress') {
        towns = towns.filter(town => town.preparatoryPhasesTowardResorption.length > 0);
    }

    // Filtre sur les intervenants
    if (postSqlFilters.actors === 'yes') {
        towns = towns.filter(town => town.actors.length > 0);
    }
    if (postSqlFilters.actors === 'no') {
        towns = towns.filter(town => town.actors.length < 1 || town.actors === null);
    }

    // Filtres sur les conditions de vie
    if (postSqlFilters.conditions) {
        const filterToCondition = {
            accessToSanitary: ['sanitary'],
            accessToWater: ['water'],
            accessToTrash: ['trash'],
            accessToElectricity: ['electricity'],
            vermin: ['vermin', 'pest_animals'],
            firePreventionMeasures: ['firePrevention', 'fire_prevention'],
        };

        const livingConditionsFilters = decodeURIComponent(postSqlFilters.conditions).split(',');

        towns = towns.filter(town => livingConditionsFilters.some(filter => filterToCondition[filter].some(key => town.livingConditions[key]
                && ['bad', 'unknown'].includes(town.livingConditions[key].status.status))));
    }
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
