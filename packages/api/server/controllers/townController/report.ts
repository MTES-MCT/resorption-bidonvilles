import shantytownService from '#server/services/shantytown';


const ERROR_RESPONSES = {
    sent_failed: { code: 502, message: 'L\'envoi du formulaire aux administrateurs nationaux a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

const { report } = shantytownService;

export default async (req, res, next) => {
    try {
        await report(req.body, req.user);
        return res.status(200).send({});
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        return next(error.nativeError || error);
    }
};
