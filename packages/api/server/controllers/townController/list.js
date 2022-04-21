const shantytownService = require('#server/services/shantytown');

module.exports = async (req, res, next) => {
    try {
        const shantytowns = await shantytownService.list(req.user);
        return res.status(200).send(
            shantytowns,
        );
    } catch (error) {
        if (error && error.code === 'fetch_failed') {
            return res.status(404).send({
                error: error.nativeError,
            });
        }
        res.status(500).send(error.message);
        return next(error);
    }
};
