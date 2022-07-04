const geoModel = require('#server/models/geoModel');

module.exports = async (req, res, next) => {
    try {
        const location = await geoModel.getLocation(req.params.type, req.params.code);
        if (location === null) {
            return res.status(404).send({
                user_message: 'Localisation géographique inconnue',
            });
        }

        return res.status(200).send(location);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }
};
