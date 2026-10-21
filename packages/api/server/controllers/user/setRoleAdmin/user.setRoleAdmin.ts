import userService from '#server/services/user';
// import userModel from '#server/models/userModel';
// import mailsUtils from '#server/mails/mails';

// const { sendAdminWelcome } = mailsUtils;

export default async (req, res, next) => {
    if (!req.user.is_superuser) {
        return res.status(400).send({
            user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
        });
    }

    const { admin } = req.body;
    console.log('Admin?', admin, 'User ID?', req.params.id);
    try {
        // const user = await userModel.findOne(req.params.id);

        // if (user && admin) {
        //     await userModel.upgradeLocalAdmin(req.params.id);
        //     if (['active', 'new'].includes(user.status)) {
        //         await sendAdminWelcome(user);
        //     }
        // } else if (user) {
        //     await userModel.downgradeLocalAdmin(req.params.id);
        // }
        const user = await userService.setRoleAdmin(req.params.id, admin);
        return res.status(200).send(user);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la mise à jour du compte',
        });
        return next(error);
    }
};
