import organizationModelFactory from '#server/models/organizationModel';
const organizationModel = organizationModelFactory();

export default async (req, res) => res.status(200).send({
    success: true,
    response: {
        organizations: await organizationModel.findByType(req.params.typeId),
    },
});
