import geoModel from '#server/models/geoModel';

export default async (req, res, next) => {
    try {
        return res.status(200).send({
            departements: await geoModel.getDepartementsFor('epci', req.params.id),
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }
};
