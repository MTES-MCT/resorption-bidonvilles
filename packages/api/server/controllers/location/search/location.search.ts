import validator from 'validator';
import geoModel from '#server/models/geoModel';

const { trim } = validator;

export default async (req, res, next) => {
    const query = trim(req.query.q ?? '');

    if (query === null || query === '') {
        return res.status(400).send({
            user_message: 'La recherche ne peut pas être vide',
        });
    }

    try {
        const results = await geoModel.search(query);
        return res.status(200).send(results);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue dans la lecture en base de données',
        });
        return next(error);
    }
};
