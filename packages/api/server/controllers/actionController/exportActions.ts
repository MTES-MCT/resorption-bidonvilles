import JSONToCSV from 'json2csv';
import actionModel from '#server/models/actionModel';

export default async (req, res) => {
    try {
        const actions = await actionModel.exportActions();
        const csv = JSONToCSV.parse(actions);

        // The frontend expects a JSON for every API calls, so we wrap the CSV in a json entry
        res.status(200).send({
            csv,
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des actions',
            },
        });
    }
};
