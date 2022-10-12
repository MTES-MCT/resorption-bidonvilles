const { Paragraph, TextRun } = require('docx');

module.exports = (latitude, longitude) => new Paragraph({
    children: [
        new TextRun({
            text: '    -    Coordonnées GPS : ',
            bold: true,
            size: 22,
            font: 'Arial',
        }),
        new TextRun({
            text: `Lat ${latitude}, Long ${longitude}`,
            size: 22,
            font: 'Arial',
        }),
    ],
});
