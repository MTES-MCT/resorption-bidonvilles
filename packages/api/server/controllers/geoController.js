const url = require('url');
const { sequelize } = require('#db/models');

function trim(str) {
    if (typeof str !== 'string') {
        return null;
    }

    return str.replace(/^\s*|\s*$/g, '');
}

module.exports = models => ({
    async getDepartementsForRegion(req, res, next) {
        try {
            const departements = await models.geo.getDepartementsFor('region', req.params.id);
            return res.status(200).send({
                departements,
            });
        } catch (error) {
            res.status(500).send({
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
                developer_message: error.message,
            });
            return next(error);
        }
    },

    async getDepartementsForEpci(req, res, next) {
        try {
            return res.status(200).send({
                departements: await models.geo.getDepartementsFor('epci', req.params.id),
            });
        } catch (error) {
            res.status(500).send({
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
                developer_message: error.message,
            });
            return next(error);
        }
    },

    async searchCities(req, res, next) {
        const { query: { q } } = url.parse(req.url, true);

        const query = trim(q);
        if (query === null || query === '') {
            return res.status(400).send({
                error: {
                    developer_message: 'Empty or missing query',
                    user_message: 'La recherche ne peut pas être vide',
                },
            });
        }

        try {
            const results = await sequelize.query(
                `SELECT
                    cities.code,
                    cities.name,
                    departements.code AS departement
                FROM
                    cities
                LEFT JOIN
                    departements ON cities.fk_departement = departements.code
                WHERE
                    REPLACE(cities.name, '-', ' ') ILIKE REPLACE(?, '-', ' ')
                ORDER BY
                    CASE
                        WHEN REPLACE(cities.name, '-', ' ') ILIKE REPLACE(?, '-', ' ') THEN 1
                        ELSE 2
                    END,
                    cities.name ASC
                LIMIT 20`,
                {
                    replacements: [
                        `%${query}%`,
                        `${query}%`,
                    ],
                    type: sequelize.QueryTypes.SELECT,
                },
            );

            return res.status(200).send(results);
        } catch (error) {
            res.status(500).send({
                error: {
                    developer_message: 'SQL query failed',
                    user_message: 'Une erreur est survenue dans la lecture en base de données',
                },
            });
            return next(error);
        }
    },

    async searchEpci(req, res, next) {
        const { query: { q } } = url.parse(req.url, true);

        const query = trim(q);
        if (query === null || query === '') {
            return res.status(400).send({
                error: {
                    developer_message: 'Empty or missing query',
                    user_message: 'La recherche ne peut pas être vide',
                },
            });
        }

        try {
            const results = await sequelize.query(
                `SELECT
                    epci.code,
                    epci.name
                FROM
                    epci
                WHERE
                    REPLACE(epci.name, '-', ' ') ILIKE REPLACE(?, '-', ' ')
                ORDER BY
                    CASE
                        WHEN REPLACE(epci.name, '-', ' ') ILIKE REPLACE(?, '-', ' ') THEN 1
                        ELSE 2
                    END,
                    epci.name ASC
                LIMIT 20`,
                {
                    replacements: [
                        `%${query}%`,
                        `${query}%`,
                    ],
                    type: sequelize.QueryTypes.SELECT,
                },
            );

            return res.status(200).send(results);
        } catch (error) {
            res.status(500).send({
                error: {
                    developer_message: 'SQL query failed',
                    user_message: 'Une erreur est survenue dans la lecture en base de données',
                },
            });
            return next(error);
        }
    },

    async search(req, res, next) {
        const { query: { q } } = url.parse(req.url, true);

        const query = trim(q);
        if (query === null || query === '') {
            return res.status(400).send({
                error: {
                    developer_message: 'Empty or missing query',
                    user_message: 'La recherche ne peut pas être vide',
                },
            });
        }

        try {
            const results = await models.geo.search(query);
            return res.status(200).send(results);
        } catch (error) {
            res.status(500).send({
                error: {
                    developer_message: 'SQL query failed',
                    user_message: 'Une erreur est survenue dans la lecture en base de données',
                },
            });
            return next(error);
        }
    },

    async listDepartements(req, res) {
        return res.status(200).send({
            success: true,
            response: {
                departements: await sequelize.query(
                    'SELECT code, name FROM departements ORDER BY code ASC',
                    {
                        type: sequelize.QueryTypes.SELECT,
                    },
                ),
            },
        });
    },
});
