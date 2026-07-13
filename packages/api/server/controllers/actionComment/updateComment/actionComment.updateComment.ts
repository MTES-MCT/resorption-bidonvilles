import actionCommentService from '#server/services/actionComment';
import { type Response, type Request, NextFunction } from 'express';
import { User } from '#root/types/resources/User.d';
import { ActionEnrichedComment } from '#root/types/resources/ActionCommentEnriched.d';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    data_incomplete: { code: 400, message: 'Données manquantes ou invalides' },
    permission_denied: { code: 403, message: 'Seul l\'auteur peut modifier son commentaire' },
    update_failed: { code: 500, message: 'La modification du commentaire en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

interface UserUpdateCommentRequest extends Request {
    user: User;
    params: {
        id: string;
        commentId: string;
    };
    body: {
        description: string;
    };
}

export default async function updateComment(req: UserUpdateCommentRequest, res: Response, next: NextFunction) {
    let result: { comment: ActionEnrichedComment };
    try {
        result = await actionCommentService.updateComment(
            req.user,
            Number.parseInt(req.params.id, 10),
            Number.parseInt(req.params.commentId, 10),
            req.body.description,
        );
    } catch (error) {
        const { code, message }: { code: number; message: string } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }

    return res.status(200).send(result);
}
