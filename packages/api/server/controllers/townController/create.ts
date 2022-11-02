import shantytownService from '#server/services/shantytown';

const { create } = shantytownService;

export default async (req, res, next) => {
    try {
        return res.status(200).send({
            town: await create(req.body, req.user),
        });
    } catch (e) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue dans l\'enregistrement du site en base de données',
            },
        });
        return next(e);
    }
};
