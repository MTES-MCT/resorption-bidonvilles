
import shantytownService from '#server/services/shantytown';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';

const { deleteComment } = shantytownService;

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    data_incomplete: { code: 400, message: 'Données manquantes' },
    permission_denied: { code: 403, message: 'Permission refusée' },
    delete_failed: { code: 500, message: 'Une suppression en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};


export default async (req, res, next) => {
    let comments: { comments: ShantytownEnrichedComment[] };
    try {
        comments = await deleteComment(req.user, parseInt(req.params.id, 10), parseInt(req.params.commentId, 10), req.body.message);
    } catch (error) {
        const { code, message }: { code: number; message: string } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }

    return res.status(200).send(comments);
};
