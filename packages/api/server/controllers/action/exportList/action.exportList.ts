import actionService from '#server/services/action/actionService';

export default async (req, res, next) => {
    if (!req.user.isAllowedTo('export', 'action')) {
        res.status(400).send({
            user_message: 'Vous n\'avez pas les droits suffisants pour exporter les actions',
        });
        return;
    }

    try {
        // The frontend expects a JSON for every API calls, so we wrap the CSV in a json entry
        res.status(200).send({
            csv: await actionService.getActionReport(),
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la récupération des données',
        });
        next(error);
    }
};
