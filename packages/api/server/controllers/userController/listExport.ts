const JSONToCSV = require('json2csv');
const userModel = require('#server/models/userModel');

module.exports = async (req, res) => {
    try {
        const users = await userModel.listExport();
        const csv = JSONToCSV.parse(users);

        // The frontend expect a JSON for every API calls, so we wrap the CSV in a json entry
        res.status(200).send({
            csv,
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données en base',
            },
        });
    }
};
