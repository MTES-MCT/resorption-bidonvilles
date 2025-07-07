import { register } from 'prom-client';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'La lecture des métriques a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    let metrics;
    try {
        res.set('Content-Type', register.contentType);
        metrics = await register.metrics();
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error?.code] ?? ERROR_RESPONSES.undefined;
        res.status(code).send({
            user_message: message,
        });
        return next(error.nativeError ?? error);
    }
    return res.status(200).send(metrics);
};
