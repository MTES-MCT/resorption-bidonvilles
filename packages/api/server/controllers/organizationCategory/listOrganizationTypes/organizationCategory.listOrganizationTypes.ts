import organizationTypeModel from '#server/models/organizationTypeModel';

export default async (req, res) => res.status(200).send({
    types: await organizationTypeModel.findByCategory(req.params.categoryId, true),
});
