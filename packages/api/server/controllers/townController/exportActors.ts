import JSONToCSV from 'json2csv';
import exportActors from '#server/services/shantytownActor/export';

export default async (req, res, next) => {
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
