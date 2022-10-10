const auth = require('#server/utils/auth');

module.exports = async (req, res) => res
    .status(200)
    .send({
        link: auth.getAccountActivationLink(
            req.body.userAccess.user_access_id,
            req.body.userAccess.expires_at,
        ),
    });
