
const { deleteComment } = require('#server/services/shantytown');


module.exports = async (req, res) => {
    let comments;
    try {
        comments = await deleteComment(req.user, req.params.id, req.params.commentId, req.body.message);
    } catch (error) {
        if (error && error.code === 'fetch_failed') {
            return res.status(404).send({
                error: error.nativeError,
            });
        } if (error && error.code === 'data_incomplete') {
            return res.status(400).send({
                error: error.nativeError,
            });
        } if (error && error.code === 'permission_denied') {
            return res.status(403).send({
                error: error.nativeError,
            });
        } if (error && error.code === 'delete_failed') {
            return res.status(500).send({
                error: error.nativeError,
            });
        }
        return res.status(500).send({
            error: {
                developer_message: error.message,
                user_message: 'Une erreur est survenue pendant la suppression du site de la base de données',
            },
        });
    }

    return res.status(200).send(comments);
};
