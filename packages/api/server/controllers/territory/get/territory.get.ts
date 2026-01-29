import { NextFunction, Request, Response } from 'express';
import territoryService from '#server/services/territory/index';

const ERRORS = {
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
    fetch_failed: { code: 500, message: 'Une erreur est survenue lors de la récupération des départements' },
};

const getTerritory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let results;
        const { type } = req.params;
        switch (type) {
            case 'regions': {
                results = await territoryService.listAllRegions();
                break;
            }
            case 'departements': {
                results = await territoryService.listAllDepartements();
                break;
            }
            default:
                throw new Error('fetch_failed');
        }
        res.status(200).send(results);
    } catch (error: any) {
        const { code, message } = ERRORS[error?.message] ?? ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error?.nativeError ?? error);
    }
};

export default getTerritory;
