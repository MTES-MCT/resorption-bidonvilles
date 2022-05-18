const { fixClosedStatus } = require('#server/services/shantytown');

const ERROR_RESPONSES = {
    permission_denied: { code: 403, message: 'Permission refusée' },
    [undefined]: { code: 500, message: 'Une erreur inconnue est survenue' },
};

module.exports = async (req, res, next) => {
    try {
        const updatedTown = await fixClosedStatus(req.user, req.body);
        return res.status(200).send(updatedTown);
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
