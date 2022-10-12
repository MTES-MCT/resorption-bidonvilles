const planModel = require('#server/models/planModel');

module.exports = async (req, res) => {
    try {
        const plans = await planModel.findOne(req.user, req.params.id);
        res.status(200).send(plans);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données en base',
            },
        });
    }
};
