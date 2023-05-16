import shantytownCommentService from '#server/services/shantytownComment';

const ERROR_RESPONSES = {
    insert_failed: { code: 500, message: 'Votre commentaire n\'a pas pu être enregistré.' },
    upload_failed: { code: 500, message: 'L\'enregistrement des pièces jointes a échoué.' },
    commit_failed: { code: 500, message: 'L\'enregistrement du commentaire et/ou des pièces jointes a échoué.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};
export default async (req, res, next) => {
    let comments;
    try {
        comments = await shantytownCommentService.createComment(
            {
                description: req.body.comment,
                targets: req.body.targets,
                tags: req.tags,
                files: req.files,
            },
            req.body.shantytown,
            req.user,
        );
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        return next(error.nativeError || error);
    }

    return res.status(200).send({
        comments,
    });
};
