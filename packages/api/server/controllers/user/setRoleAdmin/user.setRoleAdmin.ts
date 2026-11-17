import userService from '#server/services/user';

export default async (req, res, next) => {
    if (!req.user.is_superuser) {
        return res.status(400).send({
            user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
        });
    }

    const { admin } = req.body;
    try {
        const user = await userService.setRoleAdmin(req.params.id, admin);
        return res.status(200).send(user);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la mise à jour du compte',
        });
        return next(error);
    }
};
