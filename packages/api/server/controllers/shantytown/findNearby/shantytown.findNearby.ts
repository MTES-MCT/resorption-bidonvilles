import shantytownService from '#server/services/shantytown';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    try {
        const { latitude, longitude } = req.query;
        const distance = 0.5;
        const towns = await shantytownService.findNearby(req.user, latitude, longitude, distance);
        return res.status(200).send({ towns });
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }
};
