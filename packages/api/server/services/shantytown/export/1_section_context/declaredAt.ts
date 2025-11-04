import { Paragraph, TextRun } from 'docx';
import formatDate from '#server/utils/formatDate';
import formatDateSince from '../../_common/formatDateSince';


export default (declaredAt) => {
    const declaredDate = declaredAt ? formatDate(declaredAt, 'd/m/y') : 'non renseignée';

    return new Paragraph({
        children: [
            new TextRun({
                text: `    -    Signalé depuis ${formatDateSince(declaredAt)}, `,
                bold: true,
                size: 22,
                font: 'Arial',
            }),
            new TextRun({
                text: declaredDate,
                size: 22,
                font: 'Arial',
            }),
        ],
    });
};
