import organizationTypeModelFactory from '#server/models/organizationTypeModel';

const organizationTypeModel = organizationTypeModelFactory();

export default async (req, res) => res.status(200).send({
    success: true,
    response: {
        types: await organizationTypeModel.findByCategory(req.params.categoryId, true),
    },
});
