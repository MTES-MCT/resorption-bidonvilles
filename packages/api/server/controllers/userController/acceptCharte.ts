const charteEngagementModel = require('#server/models/charteEngagementModel');
const userModel = require('#server/models/userModel');

module.exports = async (req, res, next) => {
    if (parseInt(req.params.id, 10) !== req.user.id) {
        return res.status(400).send({
            user_message: 'Vous ne pouvez pas accepter la charte pour un autre utilisateur que vous-même',
        });
    }

    const charte = await charteEngagementModel.getLatest();
    if (charte === null) {
        return res.status(400).send({
            user_message: 'Il n\'y a aucune charte à accepter pour le moment',
        });
    }

    if (req.body.version_de_charte !== charte.version) {
        return res.status(400).send({
            user_message: 'Une charte plus récente existe, vous devez accepter la charte la plus récente',
        });
    }

    if (req.user.charte_engagement_a_jour !== true) {
        try {
            await userModel.update(req.user.id, {
                charte_engagement_signee: req.body.version_de_charte,
            });
        } catch (error) {
            res.status(500).send({
                user_message: 'Une erreur est survenue lors de la mise à jour de la base de données',
            });
            return next(error);
        }
    }

    if (req.body.charte_agreement !== true) {
        return res.status(400).send({
            user_message: 'Vous devez vous engager à respecter les conditions d\'utilisation de la plateforme',
        });
    }

    if (req.body.confidentiality_agreement !== true) {
        return res.status(400).send({
            user_message: 'Vous devez vous engager à ne pas diffuser les données de la plateforme',
        });
    }

    return res.status(200).send({});
};
