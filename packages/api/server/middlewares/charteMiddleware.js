module.exports = () => {
    const charteMiddleware = {};

    charteMiddleware.check = async (req, res, next, respond = true) => {
        if (req.user.charte_engagement_a_jour === false) {
            if (respond === true) {
                res.status(400).send({
                    user_message: 'La charte d\'engagement doit être signée',
                });
            } else {
                throw new Error('La charte d\'engagement doit être signée');
            }

            return;
        }

        if (respond === true) {
            next();
        }
    };

    return charteMiddleware;
};
