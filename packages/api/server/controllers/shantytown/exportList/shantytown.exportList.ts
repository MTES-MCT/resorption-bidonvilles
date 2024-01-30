import { type Request, Response, NextFunction } from 'express';
import shantytownService from '#server/services/shantytown';
import { Location } from '#server/models/geoModel/Location.d';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ShantytownExportListOption } from '#server/services/shantytown/_common/createExportSections';

const { exportTowns } = shantytownService;

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    permission_denied: { code: 403, message: 'Accès refusé' },
    write_failed: { code: 500, message: 'Une écriture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface ExportTownsRequest extends Request {
    user: AuthUser,
    body: {
        date: Date,
        closedTowns: boolean,
        location: Location,
    },
    query: {
        options: ShantytownExportListOption[],
    },
}

export default async (req: ExportTownsRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const buffer = await exportTowns(
            req.user,
            req.body.location,
            req.query.options,
            req.body.closedTowns,
            req.body.date,
        );
        res.end(buffer);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError || error);
    }
};
