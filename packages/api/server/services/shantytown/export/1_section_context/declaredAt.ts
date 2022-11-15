import moment from 'moment';
import { Paragraph, TextRun } from 'docx';
import formatDateSince from '../../_common/formatDateSince';


export default (declaredAt) => {
    const builtDate = declaredAt ? moment(declaredAt * 1000).utcOffset(2).locale('fr') : null;
    return new Paragraph({
        children: [
            new TextRun({
                text: `    -    Signalé depuis ${formatDateSince(declaredAt)}, `,
                bold: true,
                size: 22,
                font: 'Arial',
            }),
            new TextRun({
                text: builtDate ? builtDate.format('DD/MM/YYYY') : 'non renseignée',
                size: 22,
                font: 'Arial',
            }),
        ],
    });
};
