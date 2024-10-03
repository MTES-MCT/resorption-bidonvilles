import { type Request, Response, NextFunction } from 'express';
import actionService from '#server/services/action/actionService';
import { AuthUser } from '#server/middlewares/authMiddleware';

const { exportActions } = actionService;

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    permission_denied: { code: 403, message: 'Accès refusé' },
    write_failed: { code: 500, message: 'Une écriture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};
interface ExportActionsRequest extends Request {
    user: AuthUser,
}

export default async (req: ExportActionsRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const buffer = await exportActions(
            req.user,
        );
        // Terminer la réponse
        res.end(buffer);
    } catch (error) {
        console.log('error', error);
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError || error);
    }
};
