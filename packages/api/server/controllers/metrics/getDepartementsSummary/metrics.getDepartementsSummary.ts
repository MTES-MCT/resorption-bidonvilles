import { type Request, Response, NextFunction } from 'express';
import { AuthUser } from '#server/middlewares/authMiddleware';
import metricsService from '#server/services/metrics';

interface ExportTownsRequest extends Request {
    user: AuthUser;
    query: {
        departements: string[];
    };
}

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async function getDepartementsSummary(req: ExportTownsRequest, res: Response, next: NextFunction) {
    try {
        const metrics = await metricsService.getDepartementsSummaryMetrics(req.user, req.query.departements);
        return res.status(200).send(metrics);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }
}
