const { Paragraph, TextRun } = require('docx');

module.exports = owner => new Paragraph({
    children: [
        new TextRun({
            text: 'Propriétaire : ',
            bold: true,
            size: 22,
            font: 'Arial',
        }),
        new TextRun({
            text: owner,
            size: 22,
            font: 'Arial',
        }),
    ],
});
