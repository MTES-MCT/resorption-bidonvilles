import authUtils from '#server/utils/auth';

const { generateAccessTokenFor } = authUtils;

export default (req, res) => {
    const { id: userId, email } = req.user;

    return res.status(200).send({
        token: generateAccessTokenFor({ id: userId, email }),
    });
};
