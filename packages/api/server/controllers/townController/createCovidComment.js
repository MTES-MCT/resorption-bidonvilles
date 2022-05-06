const shantytownService = require('#server/services/shantytown');

module.exports = async (req, res, next) => {
    try {
        const comments = await shantytownService.createCovidComment(req.user, req.params.id, req.body);
        return res.status(200).send(comments);
    } catch (error) {
        if (error && error.code === 'fetch_failed') {
            return res.status(404).send({
                error: error.nativeError,
            });
        } if (error && error.code === 'data_incomplete') {
            return res.status(400).send({
                error: error.nativeError,
            });
        } if (error && error.code === 'write_failed') {
            return res.status(500).send({
                error: error.nativeError,
            });
        }
        res.status(500).send({
            success: false,
            response: {
                error: {
                    user_message: 'Une erreur est survenue pendant l\'écriture du commentaire en base de données',
                    developer_message: error.message,
                },
            },
        });
        return next(error);
    }
};
