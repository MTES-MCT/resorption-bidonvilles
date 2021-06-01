const { sequelize } = require('#db/models/index');
const userModel = require('#server/models/userModel')(sequelize);
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

        // create the user himself
        return userModel.create(Object.assign(data, {
            salt: generateSalt(),
        }), t);
    });

    return userModel.findOne(userId);
}

module.exports = createUser;
