const nodeFetch = require('node-fetch');

module.exports = () => ({
    async findAll(req, res, next) {
        class HTTPResponseError extends Error {
            constructor(response, ...args) {
                super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
                this.response = response;
            }
        }

        const checkStatus = (response) => {
            if (response.ok) {
                // response.status >= 200 && response.status < 300
                return response;
            }
            throw new HTTPResponseError(response);
        };

        const authKey = process.env.RB_API_SOLIGUIDE_KEY;
        try {
            if (!authKey) {
                return res.status(200).send([]);
            }
            const url = 'https://api.soliguide.fr/new-search';
            const body = { location: { geoType: 'pays', geoValue: 'France' }, categorie: 601, options: { limit: 1000 } };
            const response = await nodeFetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authKey,
                },
                json: true,
            });

            try {
                checkStatus(response);
                const { places } = await response.json();
                return res.status(200).send(places);
            } catch (error) {
                const errorBody = await error.response.text();
                res.status(500).send({ error_message: errorBody });
            }
            return next({ user_message: 'Erreur inconue !!!' });
        } catch (error) {
            res.status(500).send({ user_message: 'Une erreur est survenue lors de la récupération des points de distribution alimentaire' });
            return next(error);
        }
    },
});
