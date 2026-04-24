import userFavoriteShantytown from '#server/services/userFavoriteShantytown';
import { type Request, type Response, type NextFunction } from 'express';
import { AuthUser } from '#server/middlewares/authMiddleware';

interface RemoveFavoriteRequest extends Request {
    user: AuthUser;
    params: {
        id: string;
    };
}

const ERRORS = {
    permission_denied: { status: 403, message: 'Vous n\'avez pas les droits pour effectuer cette action' },
    delete_failed: { status: 500, message: 'Une erreur est survenue lors de la suppression du favori' },
    undefined: { status: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req: RemoveFavoriteRequest, res: Response, next: NextFunction) => {
    try {
        await userFavoriteShantytown.remove(req.user, Number.parseInt(req.params.id, 10));
        return res.status(200).json({});
    } catch (error) {
        const { status, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(status).send({ user_message: message });
        return next(error.nativeError ?? error);
    }
};
