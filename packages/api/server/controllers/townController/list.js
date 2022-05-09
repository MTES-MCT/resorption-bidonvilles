const shantytownService = require('#server/services/shantytown');

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    [undefined]: { code: 500, message: 'Une erreur inconnue est survenue' },
};
module.exports = async (req, res, next) => {
    try {
        const shantytowns = await shantytownService.list(req.user);
        return res.status(200).send(
            shantytowns,
        );
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code];
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        return next(error.nativeError || error);
    }
};
