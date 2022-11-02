import organizationCategoryModel from '#server/models/organizationCategoryModel';

export default async (req, res) => res.status(200).send({
    success: true,
    response: {
        categories: await organizationCategoryModel.findAll(),
    },
});
