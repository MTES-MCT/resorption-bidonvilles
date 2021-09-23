const { body, param } = require('express-validator');
const { sequelize } = require('#db/models');
const userModel = require('#server/models/userModel')(sequelize);

module.exports = [

    body('comment')
        .trim(),

    param('id')
        .custom(async (value) => {
            let user = null;
            try {
                user = await userModel.findOne(value, { auth: true });
            } catch (error) {
                throw new Error('Erreur lors du contrôle de l\'existence de l\'utlisateur à partir de so identifiant');
            }

            if (user === null) {
                throw new Error('L\'utlisateur n\'existe pas en base de données');
            }
        }),
];
