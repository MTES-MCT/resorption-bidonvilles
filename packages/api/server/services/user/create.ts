import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel';
import organizationModel from '#server/models/organizationModel';
import organizationTypeModel from '#server/models/organizationTypeModel';
import authUtils from '#server/utils/auth';
import mattermostUtils from '#server/utils/mattermost';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

const { generateSalt } = authUtils;

export default async (data, createdBy: number = null): Promise<User> => {
    try {
        const userId = await sequelize.transaction(async (t) => {
        // create association if necessary
            if (data.new_association === true) {
                const types: any = (await organizationTypeModel.findByCategory('association'));
                const type = types[0].id;
                const [[association]]: any = (await organizationModel.create(
                    type,
                    data.new_association_name,
                    data.new_association_abbreviation,
                    null,
                    data.departement,
                    null,
                    null,
                    false,
                    t,
                ));

                Object.assign(data, { organization: association.id });
            }

            // get fk_type from organization_types to initialize fk_role_regular field
            const fk_role_regular = await organizationTypeModel.findRoleByOrganizationId(parseInt(data.organization, 10), t);
            Object.assign(data, { fk_role_regular });

            // create the user himself
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
            // ignore this error
            }
        }

        return user;
    } catch (error) {
        throw new ServiceError('db_write', error);
    }
};
