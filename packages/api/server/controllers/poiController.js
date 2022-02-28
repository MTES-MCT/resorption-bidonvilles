const nodeFetch = require('node-fetch');

module.exports = () => ({
    async findAll(req, res, next) {
        const authKey = process.env.RB_API_SOLIGUIDE_KEY;
        try {
            if (!authKey) {
                return res.status(200).send([]);
            }

            // docs: https://solinum.gitbook.io/soliguide-api/detail-de-lapi/lieu-et-services
            const response = await nodeFetch('https://api.soliguide.fr/new-search', {
                method: 'POST',
                body: JSON.stringify({
                    location: { geoType: 'pays', geoValue: 'France' },
                    categorie: 601,
                    options: { limit: 1000 },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authKey,
                },
                json: true,
            });

            if (!response.ok) {
                res.status(500).send({ user_message: 'Une erreur inconnue est survenue' });
                return next(new Error(`Call soliguide échoué : ${response.status} ${response.statusText}`));
            }

            const { places } = await response.json();
            return res.status(200).send(places || []);
        } catch (error) {
            res.status(500).send({ user_message: 'Une erreur est survenue lors de la récupération des points de distribution alimentaire' });
            return next(error);
        }
    },
});
