import questionModel from '#server/models/questionModel';

export default async (req, res) => {
    try {
        const questions = await questionModel.findAll();
        res.status(200).send(questions);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données en base',
            },
        });
    }
};
