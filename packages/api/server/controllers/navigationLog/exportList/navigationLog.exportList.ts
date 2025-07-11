import userNavigationLogs from '#server/services/userNavigationLogs/index';
import JSONToCSV from 'json2csv';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Les logs n\'ont pas pu être récupérés' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    if (!req.user.is_superuser) {
        return res.status(400).send({
            user_message: 'Vous n\'avez pas les permissions pour accéder à ces données',
        });
    }

    let logs;
    try {
        logs = await userNavigationLogs.exportWebappSessions();
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });

        return next((error?.nativeError) ?? error);
    }

    return res.status(200).send({
        csv: JSONToCSV.parse(logs),
    });
};
