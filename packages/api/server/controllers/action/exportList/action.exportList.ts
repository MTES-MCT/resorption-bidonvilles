import { type Request, Response, NextFunction } from 'express';
import ServiceError from '#server/errors/ServiceError';
import actionService from '#server/services/action';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ControllerErrors } from '#server/errors/ControllerErrors';
import { extractReportFilters } from './action.exportList.validator';

const { exportActions } = actionService;

const ERROR_RESPONSES: ControllerErrors = {
    no_action_to_export: { code: 404, message: 'Aucune action ne correspond aux filtres de la liste : il n\'y a rien à exporter.' },
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    permission_denied: { code: 403, message: 'Accès refusé' },
    write_failed: { code: 500, message: 'Une écriture en base de données a échoué' },
    export_failed: { code: 500, message: 'Une erreur est survenue lors de la génération du fichier d\'export' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};
interface ExportActionsRequest extends Request {
    user: AuthUser,
}

export default async function exportList(req: ExportActionsRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const filters = extractReportFilters(req.query);
        const buffer = await exportActions(req.user, req.params.year, filters);
        // Terminer la réponse
        res.end(buffer);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[(error as ServiceError | undefined)?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next((error as ServiceError | undefined)?.nativeError ?? error);
    }
}
