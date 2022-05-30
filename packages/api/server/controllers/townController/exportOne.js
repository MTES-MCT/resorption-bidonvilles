const exportShantytown = require('#server/services/shantytown/export');
const { normalizeTownName } = require('#server/utils/string');
const { toFormat: dateToString } = require('#server/utils/date');

module.exports = async (req, res, next) => {
    let buffer;
    try {
        buffer = await exportShantytown(req.user, req.shantytown, req.query.options);
    } catch (error) {
        res.status(500).send({
            user_message: 'Une erreur inconnue est survenue',
        });
        next(error.nativeError || error);
        return;
    }

    res.attachment(`${dateToString(new Date(), 'Y-m-d')}-fiche-site-${normalizeTownName(req.shantytown.usename)}.docx`);
    res.end(buffer);
};
