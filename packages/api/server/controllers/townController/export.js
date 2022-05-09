

const { toFormat: dateToString } = require('#server/utils/date');
const { exportTown } = require('#server/services/shantytown');

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    access_denied: { code: 403, message: 'Accès refusé' },
    write_failed: { code: 500, message: 'Une écriture en base de données a échoué' },
    [undefined]: { code: 500, message: 'Une erreur inconnue est survenue' },
};

module.exports = async (req, res, next) => {
    const closedTowns = parseInt(req.query.closedTowns, 10) === 1;
    let buffer;
    try {
        buffer = await exportTown(req.user, req.query);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code];
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        return next(error.nativeError || error);
    }
    res.attachment(`${dateToString(new Date(), 'Y-m-d')}-sites-${closedTowns ? 'fermés' : 'existants'}-resorption-bidonvilles.xlsx`);
    return res.end(buffer);
};
