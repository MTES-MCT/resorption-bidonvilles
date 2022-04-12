const { close } = require('#server/services/shantytown');

module.exports = async (req, res, next) => {
    // close the town
    try {
        const updatedTown = close(req.user, req.body);
        return res.status(200).send(updatedTown);
    } catch (e) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue dans l\'enregistrement du site en base de données',
            },
        });
        return next(e);
    }
};
