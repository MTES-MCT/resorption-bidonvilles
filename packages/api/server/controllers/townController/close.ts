import shantytownService from '#server/services/shantytown';

const { close } = shantytownService;

export default async (req, res, next) => {
    // close the town
    try {
        const updatedTown = await close(req.user, req.body);
        return res.status(200).send(updatedTown);
    } catch (e) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue dans l\'enregistrement du site en base de données',
            },
        });
        return next(e);
    }
};
