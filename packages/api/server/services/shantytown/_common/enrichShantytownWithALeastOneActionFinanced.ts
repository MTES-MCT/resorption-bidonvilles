import { ActionSelectRow } from '#server/models/actionModel/fetchByShantytown/fetchFinancedActionsByYear';

type FinancedShantytownAction = {
    shantytown_id: number,
    hasAtLeastOneActionFinanced: boolean,
};

export default (actions: ActionSelectRow[]): FinancedShantytownAction[] => {
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
};
