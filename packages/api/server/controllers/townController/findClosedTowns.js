const { findClosedTowns } = require('#server/services/shantytown');

module.exports = () => async (req, res, next) => {
    try {
        const { citycode, closed_since } = req.query;
        const closedTowns = await findClosedTowns(req.user, citycode, closed_since);
        return res.status(200).send({ closedTowns });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }
};
