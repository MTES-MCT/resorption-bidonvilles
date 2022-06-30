const JSONToCSV = require('json2csv');
const { listExport } = require('#server/models/planModel')();

module.exports = async (req, res) => {
    try {
        const actions = await listExport();
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
