import {
    TableRow, TableCell, Paragraph, TextRun, VerticalAlign, convertInchesToTwip, AlignmentType,
} from 'docx';

export default (cells, fontSize = 22, isHeader = false, centeredColumns = []) => new TableRow({
    tableHeader: isHeader,
    cantSplit: true,
    children:
        cells.map((cell, index) => new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            margins: {
                left: convertInchesToTwip(0.10),
            },
            children: [
                new Paragraph({
                    alignment: centeredColumns.includes(index) ? AlignmentType.CENTER : undefined,
                    spacing: {
                        before: 100,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: cell ? cell.toString() : '-',
                            size: fontSize,
                            font: 'Arial',
                            bold: isHeader,
                        }),
                    ],
                }),
            ],
        })),

});
