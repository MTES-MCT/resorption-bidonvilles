import userNavigationLogs from '#server/services/userNavigationLogs/index';

export default async (req, res, next) => {
    let userNavigationLogsId = 0;

    try {
        userNavigationLogsId = await userNavigationLogs.insert(req.user.id, req.body.page);
    } catch (error) {
        let message;
        switch (error && error.code) {
            case 'insert_failed':
                message = 'Le log n\'a pas pu être enregistré.';
                break;
            case 'fetch_failed':
                message = 'Impossible de trouver l\'utilisateur';
                break;
            case 'commit_failed':
                message = 'Impossible de valider la transaction';
                break;
            default:
                message = 'La transaction d\'enregistrement du log n\'a pas pu être validée.';
        }

        res.status(500).send({
            user_message: message,
        });
        return next((error && error.nativeError) || error);
    }

    return res.status(201).send({
        userNavigationLogsId,
    });
};
