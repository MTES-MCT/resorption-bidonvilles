
module.exports = models => async (req, res, next) => {
    try {
        const { latitude, longitude, distance = 1 } = req.query;
        const towns = await models.shantytown.findNearby(req.user, latitude, longitude, distance);
        return res.status(200).send({ towns });
    } catch (error) {
        res.status(500).send({
            error,
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }
};
