const userModel = require('#server/models/userModel');

module.exports = async (req, res) => {
    try {
        const search = [];
        if (req.query.q !== undefined) {
            search.push({
                first_name: {
                    query: 'users.first_name',
                    operator: 'ILIKE',
                    value: `${req.query.q}%`,
                },
                last_name: {
                    query: 'users.last_name',
                    operator: 'ILIKE',
                    value: `${req.query.q}%`,
                },
                organization_name: {
                    query: 'organizations.name',
                    operator: 'ILIKE',
                    value: `${req.query.q}%`,
                },
                organization_abbreviation: {
                    query: 'organizations.abbreviation',
                    operator: 'ILIKE',
                    value: `${req.query.q}%`,
                },
            });
        }
        const users = await userModel.findAll(req.user, search);
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données en base',
            },
        });
    }
};
