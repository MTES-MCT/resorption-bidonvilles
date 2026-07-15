import userFavoriteShantytown from '#server/services/userFavoriteShantytown';
import { type Response, type NextFunction } from 'express';
import { ManageFavoriteRequest } from '#root/types/resources/ManageFavoriteRequestInterface.d';

const ERRORS = {
    permission_denied: { status: 403, message: 'Vous n\'avez pas les droits pour effectuer cette action' },
    write_failed: { status: 500, message: 'Une erreur est survenue lors de l\'ajout du site épinglé' },
    undefined: { status: 500, message: 'Une erreur inconnue est survenue' },
};

export default async function addFavoriteController(req: ManageFavoriteRequest, res: Response, next: NextFunction) {
    try {
        await userFavoriteShantytown.add(req.user, Number.parseInt(req.params.id, 10));
        return res.status(200).json({});
    } catch (error) {
        const { status, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(status).send({ user_message: message });
        return next(error.nativeError ?? error);
    }
}
