import {
    TableRow, TableCell, Paragraph, TextRun, VerticalAlign, convertInchesToTwip,
} from 'docx';

export default (cells) => new TableRow({
    children:
        cells.map((cell) => new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            margins: {
                left: convertInchesToTwip(0.10),
            },
            children: [
                new Paragraph({
                    spacing: {
                        before: 100,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: cell || '-',
                            size: 22,
                            font: 'Arial',
                        }),
                    ],
                }),
            ],
        })),

});
