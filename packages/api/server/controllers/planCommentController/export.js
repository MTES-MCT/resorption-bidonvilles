const JSONToCSV = require('json2csv');
const planCommentService = require('#server/services/planComment');

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    permission_denied: { code: 403, message: 'Permission refusée' },
    no_data: { code: 400, message: 'Aucune donnée à exporter' },
    [undefined]: { code: 500, message: 'Une erreur inconnue est survenue' },
};


module.exports = async (req, res, next) => {
    let comments;
    try {
        comments = await planCommentService.exportAll(req.user);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code];
        res.status(code).send({
            error: {
                user_message: message,
            },
        });

        return next(error.nativeError || error);
    }

    return res.status(200).send({
        csv: JSONToCSV.parse(comments),
    });
};
