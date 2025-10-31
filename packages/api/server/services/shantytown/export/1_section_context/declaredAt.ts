import { Paragraph, TextRun } from 'docx';
import formatDate from '#server/utils/formatDate';
import formatDateSince from '../../_common/formatDateSince';


export default (declaredAt) => {
    const builtDate = declaredAt ? formatDate(declaredAt, 'd/m/y') : null;

    return new Paragraph({
        children: [
            new TextRun({
                text: `    -    Signalé depuis ${formatDateSince(declaredAt)}, `,
                bold: true,
                size: 22,
                font: 'Arial',
            }),
            new TextRun({
                text: builtDate || 'non renseignée',
                size: 22,
                font: 'Arial',
            }),
        ],
    });
};
