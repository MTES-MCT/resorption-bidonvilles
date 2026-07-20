import { type Response, type Request, NextFunction } from 'express';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ControllerErrors } from '#server/errors/ControllerErrors';

const ERROR_RESPONSES: ControllerErrors = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    data_incomplete: { code: 400, message: 'Données manquantes' },
    permission_denied: { code: 403, message: 'Permission refusée' },
    delete_failed: { code: 500, message: 'La suppression du commentaire en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface DeleteCommentRequest extends Request {
    user: AuthUser;
    params: {
        id: string;
        commentId: string;
    };
    body: {
        message: string;
    };
}

type DeleteCommentServiceFn<TComments = any> = (user: AuthUser, entityId: number, commentId: number, message: string) => Promise<TComments>;

export default function makeDeleteCommentController<TComments = any>(deleteCommentService: DeleteCommentServiceFn<TComments>) {
    return async (req: DeleteCommentRequest, res: Response, next: NextFunction) => {
        let comments: TComments;
        try {
            comments = await deleteCommentService(req.user, Number.parseInt(req.params.id, 10), Number.parseInt(req.params.commentId, 10), req.body.message);
        } catch (error) {
            const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
            res.status(code).send({
                user_message: message,
            });
            return next(error.nativeError ?? error);
        }

        return res.status(200).send(comments);
    };
}
