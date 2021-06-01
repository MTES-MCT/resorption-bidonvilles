const shantytownCommentService = require('#server/services/shantytownComment');

module.exports = async (req, res, next) => {
    let comments;

    try {
        comments = await shantytownCommentService.createComment(
            {
                description: req.body.description,
                private: req.body.private,
            },
            req.body.shantytown,
            req.user,
        );
    } catch (error) {
        let message;
        switch (error && error.code) {
            case 'insert_failed':
                message = 'Votre commentaire n\'a pas pu être enregistré.';
                break;

            case 'fetch_failed':
                message = 'Votre commentaire a bien été enregistré mais la liste des commentaires n\'a pas pu être actualisée.';
                break;

            default:
                message = 'Une erreur inconnue est survenue.';
        }

        res.status(500).send({
            user_message: message,
        });
        return next((error && error.nativeError) || error);
    }

    return res.status(200).send({
        comments,
    });
};
