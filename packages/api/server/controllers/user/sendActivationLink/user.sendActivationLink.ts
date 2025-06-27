import sendActivationLink from '#server/services/user/sendActivationLink';
import { NextFunction, Request, Response } from 'express';
import { User } from '#root/types/resources/User.d';

interface UserSendActivationLinkRequest extends Request {
    user: User,
    userToBeActivated: User,
    body: {
        options: string[],
    },
}

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req: UserSendActivationLinkRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedUser = await sendActivationLink(req.user, req.userToBeActivated, req.body.options);
        res.status(200).send(updatedUser);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        next(error?.nativeError ?? error);
    }
};
