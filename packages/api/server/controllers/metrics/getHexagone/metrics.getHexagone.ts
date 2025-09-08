import metricsService from '#server/services/metrics';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    let metrics;
    try {
        metrics = await metricsService.getHexagoneMetrics(
            req.user,
            req.query.from,
            req.query.to,
        );
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }
    return res.status(200).send(metrics);
};
