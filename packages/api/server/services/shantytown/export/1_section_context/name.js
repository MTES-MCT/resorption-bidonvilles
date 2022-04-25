const { Paragraph, TextRun } = require('docx');

module.exports = usename => new Paragraph({
    spacing: {
        before: 300,
    },
    children: [
        new TextRun({
            text: 'Nom du bidonville : ',
            bold: true,
            size: 22,
            font: 'Arial',
        }),
        new TextRun({
            text: usename,
            size: 22,
            font: 'Arial',
        }),
    ],
});
