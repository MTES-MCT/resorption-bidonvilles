import userModelFactory from '#server/models/userModel';
import accessRequestService from '#server/services/accessRequest/accessRequestService';

const userModel = userModelFactory();

export default async (req, res, next) => {
    let user;
    try {
        user = await userModel.findOne(req.params.id, undefined, req.user, 'activate');
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            },
        });
        return next(error);
    }

    if (user === null) {
        return res.status(404).send({
            error: {
                user_message: 'L\'utilisateur auquel refuser l\'accès n\'a pas été trouvé en base de données',
            },
        });
    }

    if (user.status !== 'new') {
        return res.status(400).send({
            error: {
                user_message: 'L\'utilisateur concerné n\'a pas de demande d\'accès en attente',
            },
        });
    }

    try {
        await accessRequestService.handleAccessRequestDenied(user, req.user);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de l\'envoi du mail',
            },
        });
        return next(error);
    }

    try {
        await userModel.delete(req.params.id);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la suppression du compte de la base de données',
            },
        });
        return next(error);
    }

    return res.status(200).send({});
};
