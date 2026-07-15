import userFavoriteShantytown from '#server/services/userFavoriteShantytown';
import { type Response, type NextFunction } from 'express';
import { ControllerErrors } from '#server/errors/ControllerErrors';
import { ManageFavoriteRequest } from '#root/types/resources/ManageFavoriteRequestInterface.d';

const ERRORS: ControllerErrors = {
    permission_denied: { code: 403, message: 'Vous n\'avez pas les droits pour effectuer cette action' },
    delete_failed: { code: 500, message: 'Une erreur est survenue lors de la suppression du site épinglé' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async function removeFavoriteController(req: ManageFavoriteRequest, res: Response, next: NextFunction) {
    try {
        await userFavoriteShantytown.remove(req.user, Number.parseInt(req.params.id, 10));
        return res.status(200).json({});
    } catch (error) {
        const { code, message } = ERRORS[error?.code] ?? ERRORS.undefined;
        res.status(code).send({ user_message: message });
        return next(error.nativeError ?? error);
    }
}
