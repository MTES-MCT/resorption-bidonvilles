const { deleteTown } = require('#server/services/shantytown');

module.exports = async (req, res, next) => {
    try {
        deleteTown(req.user, req.params.id);
        return res.status(200).send({});
    } catch (error) {
        if (error && error.code === 'fetch_failed') {
            return res.status(400).send({
                error: error.nativeError,
            });
        }

        res.status(500).send({
            error: {
                developer_message: error.message,
                user_message: 'Une erreur est survenue pendant la suppression du site de la base de données',
            },
        });
        return next(error);
    }
};
