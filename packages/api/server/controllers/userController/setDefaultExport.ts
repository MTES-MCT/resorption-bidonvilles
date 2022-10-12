const userModel = require('#server/models/userModel');

module.exports = async (req, res, next) => {
    const { export: exportValue } = req.body;

    if (exportValue === undefined) {
        return res.status(400).send({
            error: {
                user_message: 'Les nouvelles préférences d\'export sont manquantes',
            },
        });
    }

    try {
        await userModel.update(req.user.id, {
            defaultExport: exportValue,
        });
    } catch (error) {
        res.status(500).send({
            error: {
                user_message: 'La sauvegarde de vos préférences a échoué',
            },
        });
        return next(error);
    }

    return res.status(200).send({
        success: true,
    });
};
