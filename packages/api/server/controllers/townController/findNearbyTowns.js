const { sequelize } = require('#db/models');
const { findNearby } = require('#server/models/shantytownModel')(sequelize);

module.exports = () => async (req, res, next) => {
    try {
        const { latitude, longitude } = req.query;
        const distance = 0.5;
        const towns = await findNearby(req.user, latitude, longitude, distance);
        return res.status(200).send({ towns });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }
};
