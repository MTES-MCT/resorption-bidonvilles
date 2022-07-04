const userModel = require('#server/models/userModel');
const { sendAdminWelcome } = require('#server/mails/mails');

module.exports = async (req, res, next) => {
    const { admin } = req.body;

    try {
        const user = await userModel.findOne(req.params.id);

        if (user && admin) {
            await userModel.upgradeLocalAdmin(req.params.id);
            await sendAdminWelcome(user);
        } else if (user) {
            await userModel.downgradeLocalAdmin(req.params.id);
        }
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la mise à jour du compte',
            },
        });
        return next(error);
    }

    return res.status(200).send({});
};
