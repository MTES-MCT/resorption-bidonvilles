const {
    Paragraph, TextRun, SectionType,
} = require('docx');
const formatDate = require('../_common/formatDate');

const heading = require('./heading');

const boolToStr = (bool) => {
    if (bool === null) {
        return 'NC';
    }
    return bool ? 'oui' : 'non';
};
const justiceRendered = (town) => {
    if (town.justiceRendered === null) {
        return 'NC';
    }
    return town.justiceRendered
        ? `rendue le ${formatDate(
            town.justiceRenderedAt,
            'DD MMMM YYYY',
        )}`
        : 'non';
};

const policeStatusLabel = (town) => {
    if (town.policeStatus === 'none') {
        return 'Non demandé';
    }

    if (town.policeStatus === 'requested') {
        return `Demandé le ${formatDate(
            town.policeRequestedAt,
            'd/m/y',
        )}`;
    }

    if (town.policeStatus === 'granted') {
        return `Accordé le ${formatDate(
            town.policeGrantedAt,
            'd/m/y',
        )}`;
    }
    return 'NC';
};

module.exports = town => ({
    properties: {
        type: SectionType.CONTINUOUS,
    },
    children: [
        heading('Procédure judiciaire'),
        new Paragraph({
            spacing: {
                before: 300,
                after: 100,
            },
            children: [
                new TextRun({
                    text: 'Dépôt de plainte : ',
                    bold: true,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${boolToStr(town.ownerComplaint)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Existence d\'une procédure judiciaire : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${boolToStr(town.justiceProcedure)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Décision de justice : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${justiceRendered(town)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Contentieux : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${boolToStr(town.justiceChallenged)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Concours de la force publique : ',
                    bold: true,
                    break: 1,
                    size: 22,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `${policeStatusLabel(town)}`,
                    bold: false,
                    size: 22,
                    font: 'Arial',
                }),


            ],
        }),
    ],
});
