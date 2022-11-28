import userNavigationLogs from '#server/services/userNavigationLogs/index';
import JSONToCSV from 'json2csv';

export default async (req, res, next) => {

    let logs;
    try {
        logs = await userNavigationLogs.exportSessions('mobile');
    } catch (error) {
        let message;
        switch (error && error.code) {
            case 'fetch_failed':
                message = 'Les logs n\'ont pas pu être récupérés';
                break;

            default:
                message = 'Une erreur inconnue est survenue.';
        }

        res.status(500).send({
            user_message: message,
        });
        return next((error && error.nativeError) || error);
    }

    return res.status(201).send({
        csv: JSONToCSV.parse(logs)
    });
};
