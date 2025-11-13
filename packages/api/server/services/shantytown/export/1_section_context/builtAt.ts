import { Paragraph, TextRun } from 'docx';
import formatDate from '#server/utils/formatDate';
import formatDateSince from '../../_common/formatDateSince';


export default (builtAt) => {
    const builtDate = builtAt ? formatDate(builtAt, 'd/m/y') : 'non renseignée';
    return new Paragraph({
        children: [
            new TextRun({
                text: `    -    Installé depuis ${formatDateSince(builtAt)}, `,
                bold: true,
                size: 22,
                font: 'Arial',
            }),
            new TextRun({
                text: builtDate,
                size: 22,
                font: 'Arial',
            }),
        ],
    });
};
