import userService from '#server/services/user/index';
import { Request, NextFunction, Response } from 'express';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface UserReactivateRequest extends Request {
    user: SerializedUser,
    body: {
        user: SerializedUser;
    };
}

export default async (req: UserReactivateRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedUser = await userService.reactivate(req.body.user.id);
        res.status(200).send(updatedUser);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        next(error?.nativeError || error);
    }
};
