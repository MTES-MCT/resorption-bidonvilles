import geoModelFactory from '#server/models/geoModel';

const geoModel = geoModelFactory();

export default async (req, res, next) => {
    try {
        const departements = await geoModel.getDepartementsFor('region', req.params.id);
        return res.status(200).send({
            departements,
        });
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }
};
