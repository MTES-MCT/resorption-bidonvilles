import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel';
import organizationTypeModel from '#server/models/organizationTypeModel';
import authUtils from '#server/utils/auth';
import mattermostUtils from '#server/utils/mattermost';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

const { generateSalt } = authUtils;

export default async (data, createdBy: number = null): Promise<User> => {
    try {
        const userId = await sequelize.transaction(async (t) => {
            const fk_role_regular = await organizationTypeModel.findRoleByOrganizationId(parseInt(data.organization, 10), t);
            Object.assign(data, { fk_role_regular });

            return userModel.create(Object.assign(data, {
                created_by: createdBy,
                salt: generateSalt(),
            }), t);
        });

        const user = await userModel.findOne(userId);
        if (user.organization.type.uid === 'rectorat') {
            try {
                await mattermostUtils.triggerNotifyNewUserFromRectorat(user);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
        }

        return user;
    } catch (error) {
        throw new ServiceError('db_write', error);
    }
};
