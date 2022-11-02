import planModel from '#server/models/planModel';

export default async (req, res) => {
    try {
        await planModel.delete(req.params.id);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de l\'écriture des données en base',
            },
        });
    }

    return res.status(200).send({});
};
