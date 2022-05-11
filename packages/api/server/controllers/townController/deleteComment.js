
const { deleteComment } = require('#server/services/shantytown');

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    data_incomplete: { code: 400, message: 'Données manquantes' },
    permission_denied: { code: 403, message: 'Permission refusée' },
    delete_failed: { code: 500, message: 'Une suppression en base de données a échoué' },
    [undefined]: { code: 500, message: 'Une erreur inconnue est survenue' },
};


module.exports = async (req, res, next) => {
    let comments;
    try {
        comments = await deleteComment(req.user, req.params.id, req.params.commentId, req.body.message);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code];
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        return next(error.nativeError || error);
    }

    return res.status(200).send(comments);
};
