

export default async (req, res, next) => {
    try {
        console.log('=============reportController============');
        return res.status(200).send({});
    } catch (e) {
        res.status(500).send({
            error: {
                user_message: 'Une erreur est survenue lors du signalement du site',
            },
        });
        return next(e);
    }
};
