const sequelize = require('#db/sequelize');
const userModel = require('#server/models/userModel');
const organizationModel = require('#server/models/organizationModel')(sequelize);
const organizationTypeModel = require('#server/models/organizationTypeModel')(sequelize);
const { generateSalt } = require('#server/utils/auth');

async function createUser(data) {
    const userId = await sequelize.transaction(async (t) => {
        // create association if necessary
        if (data.new_association === true) {
            const type = (await organizationTypeModel.findByCategory('association'))[0].id;
            const [[association]] = (await organizationModel.create(
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

    return userModel.findOne(userId);
}

module.exports = createUser;
