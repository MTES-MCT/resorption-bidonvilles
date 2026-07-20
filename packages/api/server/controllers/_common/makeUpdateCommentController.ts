import { type Response, type Request, NextFunction } from 'express';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ControllerErrors } from '#server/errors/ControllerErrors';

const ERROR_RESPONSES: ControllerErrors = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    data_incomplete: { code: 400, message: 'Données manquantes ou invalides' },
    permission_denied: { code: 403, message: 'Seul l\'auteur peut modifier son commentaire' },
    update_failed: { code: 500, message: 'La modification du commentaire en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface UpdateCommentRequest extends Request {
    user: AuthUser;
    params: {
        id: string;
        commentId: string;
    };
    body: {
        description: string;
    };
}

type UpdateCommentServiceFn<TResult> = (user: AuthUser, entityId: number, commentId: number, description: string) => Promise<TResult>;

export default function makeUpdateCommentController<TResult>(updateCommentService: UpdateCommentServiceFn<TResult>) {
    return async (req: UpdateCommentRequest, res: Response, next: NextFunction) => {
        let result: TResult;
        try {
            result = await updateCommentService(
                req.user,
                Number.parseInt(req.params.id, 10),
                Number.parseInt(req.params.commentId, 10),
                req.body.description,
            );
        } catch (error) {
            const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
            res.status(code).send({
                user_message: message,
            });
            return next(error.nativeError ?? error);
        }

        return res.status(200).send(result);
    };
}
