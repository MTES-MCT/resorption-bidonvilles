import userNavigationLogs from '#server/services/userNavigationLogs/index';
import JSONToCSV from 'json2csv';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Les logs n\'ont pas pu être récupérés' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    let logs;
    try {
        logs = await userNavigationLogs.exportSessions('mobile');
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next((error && error.nativeError) || error);
    }

    return res.status(200).send({
        csv: JSONToCSV.parse(logs),
    });
};
