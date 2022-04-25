const moment = require('moment');
const { Paragraph, TextRun } = require('docx');

module.exports = (builtAt) => {
    const builtDate = builtAt ? moment(builtAt * 1000).utcOffset(2).locale('fr') : null;

    return new Paragraph({
        children: [
            new TextRun({
                text: 'Date d\'installation : ',
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
