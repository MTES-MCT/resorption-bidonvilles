import { type Request, Response, NextFunction } from 'express';
import dataReportService from '#server/services/dataReport';
import { User } from '#root/types/resources/User.d';

const ERROR_RESPONSES = {
    model_failed: { code: 500, message: 'La lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface ExportTownsReportRequest extends Request {
    from: Date,
    to: Date,
    user: User,
}

export default async (req: ExportTownsReportRequest, res: Response, next: NextFunction): Promise<void> => {
    if (req.user.is_superuser !== true) {
        res.status(403).send({
            user_message: 'Vous n\'êtes pas autorisé à accéder à cette ressource',
        });
        return;
    }

    try {
        res.end(await dataReportService.exportTownsReport(req.from, req.to));
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError ?? error);
    }
};
