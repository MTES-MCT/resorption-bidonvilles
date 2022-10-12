const {
    Table, SectionType, Paragraph, TextRun,
} = require('docx');
const heading = require('./heading');
const populationHistory = require('./section_people/populationHistory');
const socialDiagnostic = require('./section_people/socialDiagnostic');
const createRow = require('./create_row');

module.exports = (shantytown) => {
    const population = populationHistory(shantytown);
    const origins = shantytown.socialOrigins;
    return ({
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: [
            heading('Habitants'),
            new Table({
                columnWidths: [880, 880, 880, 880, 880, 880, 880, 880, 880, 880, 880], // total page width is 9638 DXA for A4 portrait
                rows: [
                    createRow(['Date', 'Personnes', 'Ménages', '0-3 ans', '3-6 ans', '6-12 ans', '12-16 ans', '16-18 ans', 'Inscrits dans un établissement scolaire', 'Caravanes', 'Cabanes']),
                    ...population.map(row => createRow([row.date, row.populationTotal, row.populationCouples, row.population0to3, row.population3to6, row.population6to12, row.population12to16, row.population16to18, row.minorsInSchool, row.caravans, row.huts])),
                ],
            }),
            new Paragraph({
                spacing: {
                    before: 200,
                    after: 200,
                },
                children: [
                    new TextRun({
                        text: 'Origine : ',
                        bold: true,
                        size: 22,
                        font: 'Arial',
                    }),
                    new TextRun({
                        text: origins.length > 0 ? origins.map(({ label }) => label).join(', ') : 'non renseignée(s)',
                        size: 22,
                        font: 'Arial',
                    }),
                ],
            }),
            new Paragraph({
                spacing: {
                    before: 200,
                    after: 200,
                },
                children: [
                    new TextRun({
                        text: 'Diagnostic social : ',
                        bold: true,
                        size: 22,
                        font: 'Arial',
                    }),
                    new TextRun({
                        text: socialDiagnostic(shantytown),
                        size: 22,
                        font: 'Arial',
                    }),
                ],
            }),
        ],
    });
};
