import userModel from '#server/models/userModel/index';

export default async (req, res, next) => {
    let organizations;
    try {
        organizations = await userModel.getDirectory();
    } catch (error) {
        res.status(500).send({
            success: false,
            error: {
                user_message: 'Une erreur est survenue lors de la lecture en base de données',
            },
        });
        return next(error);
    }

    return res.status(200).send({
        success: true,
        response: {
            organizations,
        },
    });
};
