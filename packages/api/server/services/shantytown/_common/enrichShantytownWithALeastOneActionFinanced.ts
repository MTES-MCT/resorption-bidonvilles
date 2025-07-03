import { ActionSelectRow } from '#server/models/actionModel/fetchByShantytown/fetchFinancedActionsByYear';
import { FinancedShantytownAction } from '#root/types/resources/Action.d';


export default (actions: ActionSelectRow[]): FinancedShantytownAction[] => {
    const shantytownMap = actions.reduce((acc, action) => {
        acc[action.shantytown_id] ??= {
            shantytown_id: action.shantytown_id,
            hasAtLeastOneActionFinanced: action.financed,
        };
        return acc;
    }, {});

    return Object.values(shantytownMap);
};
