const nodeFetch = require('node-fetch');
const findAllRegions = require('#server/models/regionModel/findAll');

module.exports = async (req, res, next) => {
    const authKey = process.env.RB_API_SOLIGUIDE_KEY;
    try {
        if (!authKey) {
            return res.status(200).send([]);
        }

        const regions = await findAllRegions();

        // docs: https://apisolidarite.soliguide.fr

        // request the data for each region and keep only successful requests
        const rawResponses = (await Promise.all(
            regions.map(({ name }) => nodeFetch('https://api.soliguide.fr/new-search', {
                method: 'POST',
                body: JSON.stringify({
                    location: { geoType: 'region', geoValue: name },
                    categorie: 601,
                    options: { limit: 1000 },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authKey,
                },
                json: true,
            })),
        ))
            .filter(response => !!response.ok);

        // parse the successul responses as json and merge all places into a single array
        const parsedResponses = await Promise.all(rawResponses.map(response => response.json()));
        const mergedPlaces = parsedResponses.reduce((acc, { places }) => [...acc, ...places], []);

        return res.status(200).send(mergedPlaces || []);
    } catch (error) {
        res.status(500).send({ user_message: 'Une erreur est survenue lors de la récupération des points de distribution alimentaire' });
        return next(error);
    }
};
