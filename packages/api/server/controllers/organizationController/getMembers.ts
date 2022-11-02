import userModel from '#server/models/userModel';

export default async (req, res) => res.status(200).send({
    success: true,
    response: {
        users: await userModel.findByOrganization(req.params.organizationId),
    },
});
