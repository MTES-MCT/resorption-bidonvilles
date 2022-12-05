import userNavigationLogs from '#server/services/userNavigationLogs/index';

export default async (req, res, next) => {
    let userNavigationLogsId = 0;

    try {
        userNavigationLogsId = await userNavigationLogs.insert(
            req.user.id,
            req.body.page,
            req.body.domain,
        );
    } catch (error) {
        let message;
        switch (error && error.code) {
            case 'insert_failed':
                message = 'Le log n\'a pas pu être enregistré.';
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
        userNavigationLogsId,
    });
};
