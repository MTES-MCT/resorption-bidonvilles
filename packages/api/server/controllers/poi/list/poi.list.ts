import regionModel from '#server/models/regionModel';
import axios from 'axios';

export default async (req, res, next) => {
    const authKey = process.env.RB_API_SOLIGUIDE_KEY;
    try {
        if (!authKey) {
            return res.status(200).send([]);
        }

        const regions = await regionModel.findAll();
        // docs: https://apisolidarite.soliguide.fr

        const headers = {
            'Content-Type': 'application/json',
            Authorization: authKey,
        };

        const rawResponses = (await Promise.all(
            regions.map(({ name }: any) => axios.post('https://api.soliguide.fr/new-search', JSON.stringify({
                location: { geoType: 'region', geoValue: name },
                categorie: 601,
                options: { limit: 1000 },
            }),
            { headers })),
        ))
            .filter(response => response.statusText === 'OK');

        // parse the successul responses as json and merge all places into a single array
        const parsedResponses: any[] = await Promise.all(rawResponses.map(response => response.data));
        const mergedPlaces = parsedResponses.reduce((acc, { places }) => [...acc, ...places], []);

        return res.status(200).send(mergedPlaces ?? []);
    } catch (error) {
        res.status(500).send({ user_message: 'Une erreur est survenue lors de la récupération des points de distribution alimentaire' });
        return next(error);
    }
};
