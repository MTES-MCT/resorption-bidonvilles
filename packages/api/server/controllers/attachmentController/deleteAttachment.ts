import attachmentService from '#server/services/attachment';

const ERROR_RESPONSES = {
    delete_failed: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
    bucket_delete_failed: { code: 500, message: 'Une erreur est survenue lors de la suppression de la pièce-jointe' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        await attachmentService.deleteAttachment(req.body.keys);
        res.status(200).send({});
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError || error);
    }
};
