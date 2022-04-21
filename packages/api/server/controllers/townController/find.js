const shantytownService = require('#server/services/shantytown');


module.exports = async (req, res, next) => {
    let town;
    try {
        town = await shantytownService.find(req.user, req.params.id);
    } catch (error) {
        if (error && error.code === 'fetch_failed') {
            return res.status(404).send({
                error: error.nativeError,
            });
        }
        res.status(500).send(error.message);
        return next(error);
    }
    return res.status(200).send(town);
};
