import userModelFactory from '#server/models/userModel';

const userModel = userModelFactory();

export default async (req, res) => res.status(200).send({
    success: true,
    response: {
        users: await userModel.findByOrganization(req.params.organizationId),
    },
});
