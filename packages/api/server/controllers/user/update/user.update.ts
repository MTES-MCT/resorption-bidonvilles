import userService from '#server/services/user';
import { Request, Response, NextFunction } from 'express';
import { User, UserUpdateInput } from '#root/types/resources/User.d';

interface UserRequest extends Request {
    user: User
}

/**
 * @param req                          - {UserRequest} La requête http entrante
 * @param res                          - {Response} La réponse http sortante
 * @param next                         - {NextFunction} La prochaine fonction de callback
 * @returns {Promise<Response | void>} - La réponse http sortante ou la prochaine fonction de callback
 */
export default async (req: UserRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    if ((req.user.role_id !== 'national_admin' && req.user.id !== req.body?.id)) {
        return res.status(403).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour modifier cet utilisateur',
        });
    }

    const { id: bodyId } = req.body;
    const { id: paramId } = req.params;
    const { id: connectedUserId } = req.user;

    const userId: number = paramId ? Number(paramId) : Number(bodyId ?? connectedUserId);

    const {
        first_name, last_name, email, phone, position,
        email_subscriptions, email_unsubscriptions,
        password,
    }: UserUpdateInput = req.body;
    try {
        const updatedUser = await userService.update(userId, {
            first_name, last_name, email, phone, position, email_subscriptions, email_unsubscriptions, password,
        });
        return res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue dans la mise à jour de vos informations',
        });
        return next(error);
    }
};
