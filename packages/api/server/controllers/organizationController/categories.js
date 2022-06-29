const organizationCategoryModel = require('#server/models/organizationCategoryModel')();

module.exports = async (req, res) => res.status(200).send({
    success: true,
    response: {
        categories: await organizationCategoryModel.findAll(),
    },
});
