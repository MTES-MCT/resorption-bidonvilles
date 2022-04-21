const exportShantytown = require('#server/services/shantytown/export');

module.exports = async (req, res, next) => {
    let buffer;
    try {
        buffer = await exportShantytown();
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur inconnue est survenue',
        });
        next(error.nativeError || error);
        return;
    }

    res.attachment('fiche-de-site.docx');
    res.end(buffer);
};
