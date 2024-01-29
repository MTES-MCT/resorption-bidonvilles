import organizationModel from '#server/models/organizationModel';

export default async (req, res) => res.status(200).send({
    organizations: await organizationModel.findByType(req.params.typeId),
});
