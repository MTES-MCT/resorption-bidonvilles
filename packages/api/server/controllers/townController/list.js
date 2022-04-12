const { list } = require('#server/services/shantytown');

module.exports = async (req, res, next) => {
    try {
        const shantytowns = await list(req.user);
        return res.status(200).send(
            shantytowns,
        );
    } catch (error) {
        res.status(500).send(error.message);
        return next(error);
    }
};
