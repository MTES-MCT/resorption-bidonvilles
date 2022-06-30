const userService = require('#server/services/userService');

module.exports = async (req, res) => {
    // create the user
    const result = await userService.create(
        {
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            email: req.body.email,
            phone: req.body.phone || null,
            organization: req.body.organization_full ? req.body.organization_full.id : null,
            new_association: req.body.new_association === true,
            new_association_name: req.body.new_association_name || null,
            new_association_abbreviation: req.body.new_association_abbreviation || null,
            departement: req.body.departement || null,
            position: req.body.position,
            access_request_message: null,
        },
        req.user.id,
    );

    if (result.error) {
        return res.status(result.error.code).send(result.error.response);
    }

    return res.status(200).send(result);
};
