import organizationCategoryModelFactory from '#server/models/organizationCategoryModel';
const organizationCategoryModel = organizationCategoryModelFactory();

export default async (req, res) => res.status(200).send({
    success: true,
    response: {
        categories: await organizationCategoryModel.findAll(),
    },
});
