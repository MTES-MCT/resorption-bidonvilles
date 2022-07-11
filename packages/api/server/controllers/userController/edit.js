const userModel = require('#server/models/userModel');
const { hashPassword } = require('#server/utils/auth');

module.exports = async (req, res, next) => {
    const { id: paramId } = req.params;
    const { id: connectedUserId } = req.user;

    const userId = paramId || connectedUserId;

    const {
        first_name: firstName, last_name: lastName, email, phone, position,
        email_subscriptions: emailSubscriptions,
    } = req.body;
    const user = await userModel.findOne(userId, { auth: true });

    if (user === null) {
        res.status(500).send({
            error: {
                user_message: 'Impossible de trouver vos informations en bases de données.',
            },
        });
        return next(new Error(`User #${userId} does not exist`));
    }

    // actually update the user
    const data = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        position,
        email_subscriptions: emailSubscriptions,
    };

    if (req.body.password) {
        data.password = hashPassword(req.body.password, user.salt);
    }

    try {
        await userModel.update(userId, data);
        return res.status(200).send({
            id: user.userId,
            email: user.email,
            position,
            first_name: firstName,
            last_name: lastName,
            departement: user.departement,
            email_subscriptions: emailSubscriptions,
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue dans l\'écriture de vos informations en base de données.',
            },
        });
        return next(error);
    }
};
