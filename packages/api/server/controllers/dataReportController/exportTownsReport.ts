import { Response, NextFunction } from 'express';
import dataReportService from '#server/services/dataReport';

const ERROR_RESPONSES = {
    model_failed: { code: 500, message: 'La lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface ExportTownsReportRequest {
    query: {
        from: Date,
        to: Date,
    },
}

export default async (req: ExportTownsReportRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.end(await dataReportService.exportTownsReport(req.query.from, req.query.to));
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError || error);
    }
};
