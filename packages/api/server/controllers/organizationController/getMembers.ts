const userModel = require('#server/models/userModel');

module.exports = async (req, res) => res.status(200).send({
    success: true,
    response: {
        users: await userModel.findByOrganization(req.params.organizationId),
    },
});
