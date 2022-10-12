const organizationTypeModel = require('#server/models/organizationTypeModel');

module.exports = async (req, res) => res.status(200).send({
    success: true,
    response: {
        types: await organizationTypeModel.findByCategory(req.params.categoryId, true),
    },
});
