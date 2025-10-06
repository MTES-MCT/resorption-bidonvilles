import { WhereClauseGroup } from '#server/models/_common/types/Where';
import getPermission from './getPermission';
import { User } from '#root/types/resources/User.d';

export default () => ({
    can(user: User) {
        return {
            do(feature: string, entity: string): WhereClauseGroup {
                const permission = getPermission(user, feature, entity);
                if (permission === null) {
                    return null;
                }

                if (permission.allowed_on_national === true) {
                    return {};
                }

                const clauseGroup = Object.keys(permission.allowed_on).reduce((acc, tableName) => {
                    if (permission.allowed_on[tableName]?.length > 0) {
                        const where = {
                            [tableName]: {
                                query: `${tableName}.${tableName === 'actions' ? 'action_id' : 'code'}`,
                                value: tableName !== 'actions'
                                    ? permission.allowed_on[tableName].map(location => location[location.type].code)
                                    : permission.allowed_on[tableName],
                            },
                        };

                        if (tableName === 'cities') {
                            where[`${tableName}_arrondissement`] = {
                                query: `${tableName}.fk_main`,
                                value: permission.allowed_on[tableName].map(location => location[location.type].code),
                            };
                        }

                        return {
                            ...acc,
                            ...where,
                        };
                    }

                    return acc;
                }, {});

                if (Object.keys(clauseGroup).length === 0) {
                    return null;
                }

                return clauseGroup;
            },
        };
    },
});
