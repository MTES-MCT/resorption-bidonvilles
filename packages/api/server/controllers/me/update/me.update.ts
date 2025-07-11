import userModel from '#server/models/userModel';
import authUtils from '#server/utils/auth';

const { hashPassword } = authUtils;

export default async (req, res, next) => {
    const { id: paramId } = req.params;
    const { id: connectedUserId } = req.user;

    const userId = paramId ?? connectedUserId;

    const {
        first_name: firstName, last_name: lastName, email, phone, position,
        email_subscriptions: emailSubscriptions, email_unsubscriptions: emailUnsubscriptions,
        password,
    } = req.body;
    const user = await userModel.findOne(userId, { auth: true });

    if (user === null) {
        res.status(500).send({
            user_message: 'Impossible de trouver vos informations en bases de données.',
        });
        return next(new Error(`User #${userId} does not exist`));
    }

    // actually update the user
    const data: any = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        position,
        email_unsubscriptions: emailUnsubscriptions,
        password: password ? hashPassword(password, user.salt) : undefined,
        password_conformity: !!user.is_admin,
    };

    const filteredData: any = Object.keys(data).reduce((acc, key) => {
        if (data[key] === undefined) {
            return acc;
        }

        acc[key] = data[key];
        return acc;
    }, {});
    if (Object.keys(filteredData).length === 0) {
        return res.status(200).send({});
    }

    try {
        await userModel.update(userId, filteredData);
        delete filteredData.password;
        if (filteredData.email_unsubscriptions) {
            filteredData.email_subscriptions = emailSubscriptions;
            delete filteredData.email_unsubscriptions;
        }
        return res.status(200).send(filteredData);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue dans l\'écriture de vos informations en base de données.',
        });
        return next(error);
    }
};
