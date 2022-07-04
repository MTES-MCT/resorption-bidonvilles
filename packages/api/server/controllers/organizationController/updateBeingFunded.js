const organizationModel = require('#server/models/organizationModel');

module.exports = async (req, res, next) => {
    try {
        const data = {
            being_funded: req.body.being_funded,
            being_funded_at: new Date(),
        };
        await organizationModel.updateBeingFunded(req.body.organization.id, data);

        return res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue dans l\'écriture de vos informations en base de données.',
            },
        });
        return next(error);
    }
};
