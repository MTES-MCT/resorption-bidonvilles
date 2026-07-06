
import shantytownCommentService from '#server/services/shantytownComment';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';

const { updateComment } = shantytownCommentService;

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
        // console.log('req', req.params, req.body, req.user);
        const { id, commentId } = req.params;
        comments = await updateComment(parseInt(commentId, 10), parseInt(id, 10), req.user, req.body.comment);
        console.log('comments', comments)
    } catch (error) {
        const { code, message }: { code: number; message: string } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }

    return res.status(200).send(comments);
};
