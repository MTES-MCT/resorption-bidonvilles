import mails from '#server/mails/mails';
import userModel from '#server/models/userModel';
import config from '#server/config';

const { testEmail } = config;

export default async (req, res, next) => {
    try {
        const users = await userModel.findAll(undefined, [
            { fk_status: 'active' },
        ]);
        await Promise.all(
            (testEmail ? users.slice(0, 1) : users).map(user => mails.sendCommunityAd(user)),
        );
    } catch (error) {
        res.status(500).send({
            user_message: 'Tous les mails n\'ont pas pu être envoyés',
        });
        return next(error);
    }

    return res.status(200).send({
        success: true,
    });
};
