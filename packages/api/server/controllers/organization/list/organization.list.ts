import getDirectory from '#server/models/organizationModel/getDirectory';

export default async (req, res, next) => {
    let organizations;
    try {
        organizations = await getDirectory();
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur est survenue lors de la lecture en base de données',
        });
        return next(error);
    }

    return res.status(200).send({
        organizations,
    });
};
