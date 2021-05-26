const semver = require('semver');

module.exports = (models) => {
    const appVersionMiddleware = {};

    appVersionMiddleware.sync = async (req, res, next, respond = true) => {
        const version = req.headers && req.headers['x-app-version'];
        const lastUsedVersion = req.user.last_version;

        let updateUser = false;
        if (lastUsedVersion !== null) {
            try {
                updateUser = semver.lt(req.user.last_version, version);
            } catch (error) {
                if (respond === true) {
                    res.status(400).send({
                        user_message: 'Votre version actuelle de la plateforme n\'est pas reconnue',
                    });
                    return;
                }
                throw error;
            }
        } else {
            updateUser = true;
        }

        if (updateUser === true) {
            try {
                await models.user.update(req.user.id, {
                    last_version: version,
                    last_changelog: !req.user.last_changelog ? version : undefined,
                });
                req.user.last_version = version;
            } catch (error) {
                // ignore
            }
        }

        if (respond === true) {
            next();
        }
    };

    return appVersionMiddleware;
};
