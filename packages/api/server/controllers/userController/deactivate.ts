import userService from '#server/services/user/index';
import { Request, NextFunction, Response } from 'express';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    deactivation_failure: { code: 500, message: 'Une erreur est survenue lors de la désactivation du compte' },
    refresh_failure: { code: 500, message: 'Une erreur est survenue lors de la lecture des données en base de données' },
    transaction_failure: { code: 500, message: 'Une erreur est survenue lors de la validation de la désactivation' },
};

interface UserDeactivateRequest extends Request {
    user: SerializedUser,
    body: {
        user: SerializedUser;
    };
}

export default async (req: UserDeactivateRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(200).send(req.body.user);
        return;
        const updatedUser = await userService.deactivate(req.body.user.id, req.user.id === req.body.user.id);
        res.status(200).send(updatedUser);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        next(error?.nativeError || error);
    }
};
