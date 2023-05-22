import attachmentService from '#server/services/attachment';

const ERROR_RESPONSES = {
    delete_failed: { code: 500, message: 'Une erreur est survenue lors de l\'écriture en base de données' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        await attachmentService.deleteAttachment(req.body.keys);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        next(error.nativeError || error);
    }
};
