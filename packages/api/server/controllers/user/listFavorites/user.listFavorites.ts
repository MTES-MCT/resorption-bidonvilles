import userFavoriteShantytown from '#server/services/userFavoriteShantytown';
import { type Request, type Response, type NextFunction } from 'express';
import { AuthUser } from '#server/middlewares/authMiddleware';

interface ListFavoritesRequest extends Request {
    user: AuthUser;
}

const ERRORS = {
    permission_denied: { status: 403, message: 'Vous n\'avez pas les droits pour effectuer cette action' },
    fetch_failed: { status: 500, message: 'Une erreur est survenue lors de la récupération des favoris' },
    undefined: { status: 500, message: 'Une erreur inconnue est survenue' },
};

export default async function listFavoritesController(req: ListFavoritesRequest, res: Response, next: NextFunction) {
    try {
        const towns = await userFavoriteShantytown.fetch(req.user);
        return res.status(200).json(towns);
    } catch (error) {
        const { status, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(status).send({ user_message: message });
        return next(error.nativeError ?? error);
    }
}
