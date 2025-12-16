import { type Request, Response, NextFunction } from 'express';
import shantytownService from '#server/services/shantytown';

const { getClosureYearRange } = shantytownService;

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une erreur est survenue lors de la récupération des années de fermeture' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

async function shantytownGetClosureYearRange(_req: Request, res: Response, next: NextFunction) {
    try {
        const yearRange = await getClosureYearRange();
        return res.status(200).send(yearRange);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }
}

export default shantytownGetClosureYearRange;
