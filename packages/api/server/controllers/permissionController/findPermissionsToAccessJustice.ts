import permissionService from '#server/services/permission';

const ERROR_RESPONSES = {
    fetch_failed: { code: 400, message: 'Une lecture en base de données a échoué' },
    undefined: { code: 500, message: 'Une erreur inconnue est survenue' },
};

export default async (req, res, next) => {
    const location = {
        type: req.query.type,
        city: req.query.city,
        epci: req.query.epci,
        departement: req.query.departement,
        region: req.query.region,
    };

    let usersWhoCanAccessJustice;
    try {
        usersWhoCanAccessJustice = await permissionService.findPermissionsToAccessJustice(location);
    } catch (error) {
        const { code, message } = ERROR_RESPONSES[error && error.code] || ERROR_RESPONSES.undefined;
        res.status(code).send({
            error: {
                user_message: message,
            },
        });
        return next(error.nativeError || error);
    }
    return res.status(200).send(usersWhoCanAccessJustice);
};
