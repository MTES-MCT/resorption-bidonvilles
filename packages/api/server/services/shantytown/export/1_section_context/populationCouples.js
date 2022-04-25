const { Paragraph, TextRun } = require('docx');

module.exports = total => new Paragraph({
    children: [
        new TextRun({
            text: 'Nombre de ménages : ',
            bold: true,
            size: 22,
            font: 'Arial',
        }),
        new TextRun({
            text: Number.isFinite(total) ? total : 'non renseigné',
            size: 22,
            font: 'Arial',
        }),
    ],
});
