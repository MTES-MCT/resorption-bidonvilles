const { Paragraph, TextRun } = require('docx');

module.exports = (ownerType, owner) => new Paragraph({
    spacing: {
        before: 150,
    },
    children: [
        new TextRun({
            text: 'Propriétaire :',
            bold: true,
            size: 22,
            font: 'Arial',
        }),
        new TextRun({
            text: `    -    ${ownerType}`,
            size: 22,
            break: 1,
            font: 'Arial',
        }),
        new TextRun({
            text: `    -    ${owner || 'non renseigné'}`,
            size: 22,
            break: 1,
            font: 'Arial',
        }),
    ],
});
