import shantytownService from '#server/services/shantytown';

export default async (req, res, next) => {
    // close the town
    try {
        const updatedTown = await shantytownService.close(req.user, req.body);
        return res.status(200).send(updatedTown);
    } catch (e) {
        res.status(500).send({
            user_message: 'Une erreur est survenue dans l\'enregistrement du site en base de données',
        });
        return next(e);
    }
};
