const JSONToCSV = require('json2csv');
const exportActors = require('#server/services/shantytownActor/export');

module.exports = async (req, res, next) => {
    let actors;
    try {
        actors = await exportActors(req.user);
    } catch (error) {
        let message;
        if (error && error.code === 'fetch_failed') {
            message = 'Une erreur est survenue lors de la lecture en base de données';
        } else {
            message = 'Une erreur inconnue est survenue';
        }

        res.status(500).send({
            user_message: message,
        });
        return next((error && error.nativeError) || error);
    }

    return res.status(200).send({
        csv: JSONToCSV.parse(actors),
    });
};
