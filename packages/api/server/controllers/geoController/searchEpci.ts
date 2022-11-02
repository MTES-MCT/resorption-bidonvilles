import url from 'url';
import validator from 'validator';
import epciModel from '#server/models/epciModel/index';

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
        return res.status(200).send(await epciModel.search(query));
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue dans la lecture en base de données',
            },
        });
        return next(error);
    }
};
