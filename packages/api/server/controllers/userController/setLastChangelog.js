const semver = require('semver');
const userModel = require('#server/models/userModel');

module.exports = async (req, res, next) => {
    const changelog = semver.valid(req.body.version);
    if (changelog === null) {
        return res.status(400).send({
            error: {
                user_message: 'Le numéro de version passé en paramètre est invalide',
            },
        });
    }

    if (req.user.last_changelog !== null && semver.gte(req.user.last_changelog, changelog)) {
        return res.status(200).send({});
    }

    try {
        await userModel.update(req.user.id, {
            last_changelog: changelog,
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            },
        });
        return next(error);
    }

    return res.status(200).send({});
};
