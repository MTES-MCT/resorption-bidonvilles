const {
    TableRow, TableCell, Paragraph, ShadingType, TextRun,
} = require('docx');

module.exports = (label, value) => new TableRow({
    children: [
        new TableCell({
            children: [
                new Paragraph({
                    spacing: {
                        before: 100,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: label,
                            size: 22,
                            font: 'Arial',
                        }),
                    ],
                }),
            ],
        }),
        new TableCell({
            shading: {
                type: ShadingType.SOLID,
                color: 'EDEDED',
            },
            children: [
                new Paragraph({
                    spacing: {
                        before: 100,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: value,
                            size: 22,
                            font: 'Arial',
                        }),
                    ],
                }),
            ],
        }),
    ],
});
