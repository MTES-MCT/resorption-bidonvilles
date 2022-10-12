const organizationModel = require('#server/models/organizationModel');

module.exports = async (req, res) => res.status(200).send({
    success: true,
    response: {
        organizations: await organizationModel.findByCategory(req.params.categoryId, req.query.search || null),
    },
});
