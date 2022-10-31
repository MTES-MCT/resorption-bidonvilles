import userModelFactory from '#server/models/userModel';

const userModel = userModelFactory();

export default async (req, res) => {
    const user = await userModel.findOne(req.user.id, {
        extended: true,
    });
    return res.status(200).send(user);
};
