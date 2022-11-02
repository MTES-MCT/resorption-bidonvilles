import userModel from '#server/models/userModel';

export default async (req, res) => {
    const user = await userModel.findOne(req.user.id, {
        extended: true,
    });
    return res.status(200).send(user);
};
