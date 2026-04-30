import { sequelize } from '#db/sequelize';

import shantytownActorModel from '#server/models/shantytownActorModel';

export default async (req, res, next) => {
    let actors;
    try {
        actors = await sequelize.transaction(async (transaction) => {
            await shantytownActorModel.updateThemes(
                req.shantytown.id,
                req.body.user.id,
                req.body.themes,
                req.user.id,
                transaction,
            );

            return shantytownActorModel.findAll(
                req.shantytown.id,
                transaction,
            );
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
        });
        return next(error);
    }

    const actor = actors.find(({ id }) => id === req.body.user.id);

    return res.status(200).send(actor);
};
