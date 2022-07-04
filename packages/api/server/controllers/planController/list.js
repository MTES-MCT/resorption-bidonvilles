const planModel = require('#server/models/planModel');

module.exports = async (req, res) => {
    try {
        const plans = await planModel.findAll(req.user);
        res.status(200).send(plans);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données en base',
            },
        });
    }
};
