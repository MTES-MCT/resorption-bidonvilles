import { Paragraph, TextRun } from 'docx';

export default fieldType => new Paragraph({
    children: [
        new TextRun({
            text: '    -    Type de site : ',
            bold: true,
            size: 22,
            font: 'Arial',
        }),
        new TextRun({
            text: fieldType,
            size: 22,
            font: 'Arial',
        }),
    ],
});
