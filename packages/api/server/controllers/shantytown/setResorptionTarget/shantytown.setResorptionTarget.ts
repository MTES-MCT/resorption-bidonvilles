import { type Request, Response, NextFunction } from 'express';
import shantytownService from '#server/services/shantytown';
import { AuthUser } from '#server/middlewares/authMiddleware';

interface SetResorptionTargetRequest extends Request {
    user: AuthUser;
    body: {
        shantytown: {
            id: number;
        };
    };
}

const ERROR_RESPONSES = {
    permission_denied: { code: 403, message: 'Vous n\'avez pas la permission de marquer ce site comme "Objectif résorption"' },
    write_failed: { code: 500, message: 'Une erreur est survenue lors de l\'enregistrement en base de données' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

async function setResorptionTargetController(req: SetResorptionTargetRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const updatedTown = await shantytownService.setResorptionTarget(req.user, req.body);
        res.status(200).send(updatedTown);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError ?? error);
    }
}

export default setResorptionTargetController;
