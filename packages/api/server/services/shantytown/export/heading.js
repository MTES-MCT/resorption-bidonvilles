const {
    AlignmentType, Paragraph, ShadingType, TextRun,
} = require('docx');

module.exports = text => new Paragraph({
    alignment: AlignmentType.CENTER,
    shading: {
        type: ShadingType.SOLID,
        color: 'A7F594',
    },
    spacing: {
        before: 100,
        after: 100,
    },
    children: [
        new TextRun({
            text,
            allCaps: true,
            size: 26,
            font: 'Arial',
        }),
    ],
});
