const shantytownService = require('#server/services/shantytown');

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    data_incomplete: { code: 400, message: 'Données manquantes' },
    write_failed: { code: 500, message: 'Une écriture en base de données a échoué' },
    [undefined]: { code: 500, message: 'Une erreur inconnue est survenue' },
};

module.exports = async (req, res, next) => {
    try {
        const comments = await shantytownService.createCovidComment(req.user, req.params.id, req.body);
        return res.status(200).send(comments);
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
