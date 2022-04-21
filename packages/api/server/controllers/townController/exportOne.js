const exportShantytown = require('#server/services/shantytown/export');

module.exports = async (req, res) => {
    res.attachment('fiche-de-site.docx');
    res.end(await exportShantytown());
};
