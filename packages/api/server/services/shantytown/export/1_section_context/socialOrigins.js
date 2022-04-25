const { Paragraph, TextRun } = require('docx');

module.exports = origins => new Paragraph({
    children: [
        new TextRun({
            text: 'Origine(s) des habitant(e)s : ',
            bold: true,
            size: 22,
            font: 'Arial',
        }),
        new TextRun({
            text: origins.length > 0 ? origins.map(({ label }) => label).join(', ') : 'non renseignée(s)',
            size: 22,
            font: 'Arial',
        }),
    ],
});
