import organizationService from '#server/services/organization/organizationService';
import { Location } from '#server/models/geoModel/Location.d';
import { Request, NextFunction, Response } from 'express';

interface FindJusticeReadersRequest extends Request {
    body: {
        location: Location
    }
}

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req: FindJusticeReadersRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(200).send(
            await organizationService.findJusticeReadersByLocation(req.body.location),
        );
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError ?? error);
    }
};
