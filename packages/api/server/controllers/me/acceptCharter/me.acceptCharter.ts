import charteEngagementModel from '#server/models/charteEngagementModel';
import userModel from '#server/models/userModel';

export default async (req, res, next) => {
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
