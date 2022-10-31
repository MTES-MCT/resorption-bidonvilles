import userModelFactory from '#server/models/userModel';

const userModel = userModelFactory();

export default async (req, res) => {
    try {
        const user = await userModel.findOne(req.params.id, { extended: true }, req.user);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors de la récupération des données en base',
            },
        });
    }
};
