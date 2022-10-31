import url from 'url';
import validator from 'validator';
import geoModelFactory from '#server/models/geoModel';

const geoModel = geoModelFactory();
const { trim } = validator;

export default async (req, res, next) => {
    const { query: { q } } = url.parse(req.url, true);
    const query = trim(q.toString());

    if (query === null || query === '') {
        return res.status(400).send({
            error: {
                user_message: 'La recherche ne peut pas être vide',
            },
        });
    }

    try {
        const results = await geoModel.search(query);
        return res.status(200).send(results);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue dans la lecture en base de données',
            },
        });
        return next(error);
    }
};
