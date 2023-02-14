import actionService from '#server/services/action/actionService';

export default async (req, res, next) => {
    try {
        // The frontend expects a JSON for every API calls, so we wrap the CSV in a json entry
        res.status(200).send({
            csv: await actionService.getActionReport(),
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données',
            },
        });
        next(error);
    }
};
