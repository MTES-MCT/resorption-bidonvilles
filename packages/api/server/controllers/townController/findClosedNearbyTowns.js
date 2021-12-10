
module.exports = models => async (req, res, next) => {
    try {
        const { latitude, longitude } = req.query;
        const distance = 0.5;
        const closedTowns = await models.shantytown.findClosedNearby(req.user, latitude, longitude, distance);
        return res.status(200).send({ closedTowns });
    } catch (error) {
        res.status(500).send({
            error,
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }
};
