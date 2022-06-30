const statsModel = require('#server/models/statsModel/index');

module.exports = async (req, res, next) => {
    const { location } = req.body;
    try {
        const townStats = await statsModel.getStats(req.user, location);
        return res.status(200).send(townStats);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }
};
