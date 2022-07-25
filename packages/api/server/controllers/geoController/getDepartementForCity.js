const geoModel = require('#server/models/geoModel/index');

module.exports = async (req, res, next) => {
    try {
        const departement = await geoModel.getDepartementForCity(req.params.code);
        return res.status(200).send({
            departement,
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
            developer_message: error.message,
        });
        return next(error);
    }
};
