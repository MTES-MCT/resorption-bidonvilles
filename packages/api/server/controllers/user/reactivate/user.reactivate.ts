import userService from '#server/services/user/index';
import { Request, NextFunction, Response } from 'express';
import { User } from '#root/types/resources/User.d';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface UserReactivateRequest extends Request {
    user: User,
    body: {
        user: User;
    };
}

export default async (req: UserReactivateRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user.is_admin) {
        res.status(400).send({
            user_message: 'Vous n\'avez pas les permissions pour accéder à cette route',
        });
        return;
    }

    try {
        const updatedUser = await userService.reactivate(req.user, req.body.user.id);
        res.status(200).send(updatedUser);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        next(error?.nativeError ?? error);
    }
};
