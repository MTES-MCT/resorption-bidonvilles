import configService from '#server/services/config/index';
import { NextFunction, Request, Response } from 'express';
import { User } from '#root/types/resources/User.d';
import { ControllerErrors } from '#server/errors/ControllerErrors';

interface ConfigListRequest extends Request {
    user: User
}

const ERRORS: ControllerErrors = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    fetch_failed: { code: 500, message: 'Une erreur est survenue lors de la lecture en base de données' },
};

export default async (req: ConfigListRequest, res: Response, next: NextFunction) => {
    try {
        const config = await configService.fetch(req.user);
        res.status(200).send(config);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error?.nativeError ?? error);
    }
};
