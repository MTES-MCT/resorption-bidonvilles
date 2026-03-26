import { Request, Response } from 'express';
import actionService from '#server/services/action/actionService';
import { User } from '#root/types/resources/User.d';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    fetch_failed: { code: 500, message: 'Une erreur est survenue lors de la récupération de l\'historique' },
};

interface ActionHistoryRequest extends Request {
    user: User,
    params: { id: string; },
}

export default async function getHistory(req: ActionHistoryRequest, res: Response, next: (arg0: any) => any) {
    try {
        const history = await actionService.getHistory(req.user, parseInt(req.params.id, 10));
        return res.status(200).send(history);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError ?? error);
    }
}
