const moment = require('moment');
const { Paragraph, TextRun, AlignmentType } = require('docx');
const getAddressSimpleOf = require('#server/models/shantytownModel/_common/getAddressSimpleOf');

module.exports = (shantytown) => {
    const currentDate = moment().utcOffset(2).locale('fr');

    return [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: 'Note de situation',
                    allCaps: true,
                    bold: true,
                    size: 38,
                    font: 'Arial',
                }),
            ],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: currentDate.format('MMMM YYYY'),
                    allCaps: true,
                    size: 30,
                    color: '#6E9EEB',
                    font: 'Arial',
                }),
            ],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: shantytown.name || getAddressSimpleOf(shantytown),
                    bold: true,
                    size: 30,
                    font: 'Arial',
                }),
                new TextRun({
                    text: ` — ${shantytown.city.name}`,
                    allCaps: true,
                    bold: true,
                    size: 30,
                    font: 'Arial',
                }),
            ],
        }),
        new Paragraph({
            spacing: {
                before: 200,
                after: 400,
            },
            children: [
                new TextRun({
                    text: `Date : ${currentDate.format('DD/MM/YYYY')}`,
                    bold: true,
                    size: 20,
                    font: 'Arial',
                }),
            ],
        }),
    ];
};
