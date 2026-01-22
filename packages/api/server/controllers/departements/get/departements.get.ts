import { NextFunction, Request, Response } from 'express';
import departementsService from '#server/services/departements/index';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    fetch_failed: { code: 500, message: 'Une erreur est survenue lors de la récupération des départements' },
};

const getDepartements = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const departements = await departementsService.listAll();
        res.status(200).send(departements);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error?.nativeError ?? error);
    }
};

export default getDepartements;
