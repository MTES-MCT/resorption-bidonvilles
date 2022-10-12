const {
    TableRow, TableCell, Paragraph, TextRun,
} = require('docx');

module.exports = (date, author, field, oldValue, newValue) => new TableRow({
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
                            text: date,
                            size: 22,
                            font: 'Arial',
                        }),
                    ],
                }),
            ],
        }),
        new TableCell({
            children: [
                new Paragraph({
                    spacing: {
                        before: 100,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: `${author.first_name} ${author.last_name}`,
                            size: 22,
                            font: 'Arial',
                        }),
                    ],
                }),
            ],
        }),
        new TableCell({
            children: [
                new Paragraph({
                    spacing: {
                        before: 100,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: field,
                            size: 22,
                            font: 'Arial',
                        }),
                    ],
                }),
            ],
        }),
        new TableCell({
            children: [
                new Paragraph({
                    spacing: {
                        before: 100,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: oldValue,
                            size: 22,
                            font: 'Arial',
                        }),
                    ],
                }),
            ],
        }),
        new TableCell({
            children: [
                new Paragraph({
                    spacing: {
                        before: 100,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: newValue,
                            size: 22,
                            font: 'Arial',
                        }),
                    ],
                }),
            ],
        }),
    ],
});
