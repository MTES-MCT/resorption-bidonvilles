import actionService from '#server/services/action/actionService';
import userService from '#server/services/user/index';

export default async (req, res, next) => {
    try {
        const action = await actionService.create(req.user, req.body);
        const permissions = await userService.getPermissions(req.user.id);

        return res.status(201).send({
            action,
            permissions,
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la création de l\'action',
        });
        return next(error);
    }
};
