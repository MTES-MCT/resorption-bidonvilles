import userService from '#server/services/user/index';
import { Request, NextFunction, Response } from 'express';
import { User } from '#root/types/resources/User.d';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    anonymization_failure: { code: 500, message: 'Une erreur est survenue lors de l\'anonymisation de l\'utilisateur.' },
    refresh_failure: { code: 500, message: 'Une erreur est survenue lors de la lecture des données en base' },
    transaction_failure: { code: 500, message: 'Une erreur est survenue lors de la validation de l\'anonymisation' },
};

interface UserAnonymizeRequest extends Request {
    user: User,
    body: {
        ids: number[];
    };
}

export default async (req: UserAnonymizeRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user.is_admin) {
            res.status(400).send({
                user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
            });
        }

        const updatedUser = await userService.anonymizationRequest(req.body.ids);

        res.status(200).send(updatedUser);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        next(error?.nativeError ?? error);
    }
};
