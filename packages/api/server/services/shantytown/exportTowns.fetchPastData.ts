import moment from 'moment';
import shantytownModel from '#server/models/shantytownModel';
import where from '#server/utils/permission/where';
import { Location } from '#server/models/geoModel/Location.d';
import enrichShantytown from '#server/services/shantytown/_common/enrichShantytownWithALeastOneActionFinanced';
import actionModel from '#server/models/actionModel';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownWithFinancedAction, Shantytown } from '#root/types/resources/Shantytown.d';
import { FinancedShantytownAction } from '#root/types/resources/Action.d';
import { ShantytownFilters } from '#root/types/resources/shantytownFilters.d';
import { ShantytownExportListOption } from '#root/types/resources/ShantytownExportTypes.d';

export default async (user: AuthUser, options: ShantytownExportListOption[], locations: Location[], filters: ShantytownFilters, date: Date): Promise<Shantytown[]> => {
    const lastDate = moment(date).format('YYYY-MM-DD HH:mm:ss ZZ');

    const towns = await shantytownModel.getHistoryAtGivenDate(
        user,
        options,
        locations,
        lastDate,
        filters,
    );

    // Récupérer les financements d'actions (comme avant)
    const clauseGroup = where().can(user).do('read', 'action');
    const passedYear = moment(date).format('YYYY');
    const townsWithFinancedActions = await actionModel.fetchFinancedActionsByYear(null, parseInt(passedYear, 10), clauseGroup);
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
