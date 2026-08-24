import { sequelize } from '#db/sequelize';

import shantytownActorModel from '#server/models/shantytownActorModel';
import tchapUtils from '#server/utils/tchap';

const { triggerRemoveDeclaredActor } = tchapUtils;

export default async (req, res, next) => {
    let actors;
    try {
        actors = await sequelize.transaction(async (transaction) => {
            await shantytownActorModel.removeActor(
                req.shantytown.id,
                req.body.user.id,
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

    try {
        await triggerRemoveDeclaredActor(req.shantytown, req.user);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    return res.status(200).send({
        actors,
    });
};
