import actionService from '#server/services/action/actionService';
import { Request, NextFunction, Response } from 'express';

interface FindActionFinancesReadersRequest extends Request {
    body: {
        managers: Array<number>,
    }
}

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req: FindActionFinancesReadersRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(200).send(
            await actionService.findActionFinancesReadersByManagers(req.body.managers),
        );
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError || error);
    }
};