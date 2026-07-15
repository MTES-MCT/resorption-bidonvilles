import userFavoriteShantytown from '#server/services/userFavoriteShantytown';
import { type Request, type Response, type NextFunction } from 'express';
import { ControllerErrors } from '#server/errors/ControllerErrors';
import { AuthUser } from '#server/middlewares/authMiddleware';

interface ListFavoritesRequest extends Request {
    user: AuthUser;
}

const ERRORS: ControllerErrors = {
    permission_denied: { code: 403, message: 'Vous n\'avez pas les droits pour effectuer cette action' },
    fetch_failed: { code: 500, message: 'Une erreur est survenue lors de la récupération des sites épinglés' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async function listUserFavoritesController(req: ListFavoritesRequest, res: Response, next: NextFunction) {
    try {
        const towns = await userFavoriteShantytown.fetch(req.user);
        return res.status(200).json(towns);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({ user_message: message });
        return next(error.nativeError ?? error);
    }
}
