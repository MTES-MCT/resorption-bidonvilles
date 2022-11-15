import { sequelize } from '#db/sequelize';
import userModel from '#server/models/userModel';
import organizationModel from '#server/models/organizationModel';
import organizationTypeModel from '#server/models/organizationTypeModel';
import authUtils from '#server/utils/auth';
import mattermostUtils from '#server/utils/mattermost';

const { generateSalt } = authUtils;

async function createUser(data) {
    const userId = await sequelize.transaction(async (t) => {
        // create association if necessary
        if (data.new_association === true) {
            const types: any = (await organizationTypeModel.findByCategory('association'));
            const type = types[0].id;
            const [[association]]: any = (await organizationModel.create(
                data.new_association_name,
                data.new_association_abbreviation,
                type,
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
}

export default createUser;
