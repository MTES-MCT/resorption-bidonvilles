import {
    AlignmentType, Paragraph, ShadingType, TextRun,
} from 'docx';

export default text => new Paragraph({
    alignment: AlignmentType.CENTER,
    shading: {
        type: ShadingType.SOLID,
        color: 'f0f0f0',
    },
    spacing: {
        before: 500,
        after: 100,
    },
    children: [
        new TextRun({
            text,
            bold: true,
            allCaps: true,
            size: 26,
            font: 'Arial',
        }),
    ],
});
