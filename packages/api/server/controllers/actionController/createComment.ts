import actionService from '#server/services/action/actionService';

const ERRORS = {
    write_fail: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
    upload_failed: { code: 500, message: 'L\'enregistrement des pièces jointes a échoué.' },
    commit_failed: { code: 500, message: 'L\'enregistrement du commentaire et/ou des pièces jointes a échoué.' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        const response = await actionService.createComment(req.user.id, req.body.action, {
            description: req.body.description,
            files: req.files,
        });
        return res.status(201).send(response);
    } catch (error) {
        const { code, message } = ERRORS[error?.code] || ERRORS.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next(error?.nativeError || error);
    }
};
