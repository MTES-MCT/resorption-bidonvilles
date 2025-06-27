import userService from '#server/services/user/index';
import { Request, NextFunction, Response } from 'express';
import { User } from '#root/types/resources/User.d';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    deactivation_permission_failure: { code: 500, message: 'Vous n\'avez pas la permission de désactiver ce compte' },
    deactivation_failure: { code: 500, message: 'Une erreur est survenue lors de la désactivation du compte' },
    refresh_failure: { code: 500, message: 'Une erreur est survenue lors de la lecture des données en base' },
    transaction_failure: { code: 500, message: 'Une erreur est survenue lors de la validation de la désactivation' },
    user_already_inactive: { code: 400, message: 'L\'utilisateur est déjà inactif' },
};

interface UserDeactivateRequest extends Request {
    user: User,
    body: {
        user: User;
        reason: string | null;
        anonymizationRequested: boolean | null;
    };
}

export default async (req: UserDeactivateRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = parseInt(req.params.id, 10);
        const updatedUser = await userService.deactivate(userId, userId === req.user.id, req.user, req.body.reason, req.body.anonymizationRequested);
        res.status(200).send(updatedUser);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        next(error?.nativeError ?? error);
    }
};
