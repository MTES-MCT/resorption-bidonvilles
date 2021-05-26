const request = require('request-promise');

module.exports = () => ({
    async findAll(req, res, next) {
        const authKey = process.env.RB_API_SOLIGUIDE_KEY;

        try {
            if (!authKey) {
                return res.status(200).send([]);
            }

            // docs: https://solinum.gitbook.io/soliguide-api/detail-de-lapi/lieu-et-services
            const { places } = await request('https://api.soliguide.fr/new-search', {
                method: 'POST',
                body: { location: { geoType: 'pays', geoValue: 'France' }, categorie: 601, options: { limit: 1000 } },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authKey,
                },
                json: true,
            });
            return res.status(200).send(places);
        } catch (error) {
            res.status(500).send({ user_message: 'Une erreur est survenue lors de la lecture en base de données' });
            return next(error);
        }
    },
});
