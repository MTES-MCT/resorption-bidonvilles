const { generateAccessTokenFor } = require('#server/utils/auth');

module.exports = (req, res) => {
    const { id: userId, email } = req.user;

    return res.status(200).send({
        token: generateAccessTokenFor({ id: userId, email }),
    });
};
