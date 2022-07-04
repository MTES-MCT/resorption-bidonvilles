const userModel = require('#server/models/userModel');

module.exports = async (req, res) => {
    try {
        const user = await userModel.findOne(req.params.id, { extended: true }, req.user);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données en base',
            },
        });
    }
};
