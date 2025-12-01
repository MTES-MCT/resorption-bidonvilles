import {
    Table, SectionType, Paragraph, TextRun, PageOrientation,
} from 'docx';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import heading from './heading';
import populationHistory from './section_people/populationHistory';
import socialDiagnostic from './section_people/socialDiagnostic';
import createRow from './create_row';

export default (shantytown: Shantytown) => {
    const population = populationHistory(shantytown);
    const origins = shantytown.socialOrigins;

    return ({
        properties: {
            type: SectionType.NEXT_PAGE,
            page: {
                size: {
                    orientation: PageOrientation.LANDSCAPE,
                },
            },
        },
        children: [
            heading('Habitants'),
            new Table({
                // columnWidths: [880, 880, 880, 880, 880, 880, 880, 880, 880, 880, 880], // total page width is 9638 DXA for A4 portrait
                columnWidths: [1100, 1200, 1100, 1000, 1000, 1000, 1000, 1000, 1100, 1200, 1100, 1000, 1000, 1000],
                rows: [
                    createRow(['Date', 'Personnes', 'Ménages', '0-3 ans', '3-6 ans', '6-12 ans', '12-16 ans', '16-18 ans', 'Inscrits dans un établissement scolaire', 'Caravanes', 'Cabanes', 'Tentes', 'Voitures dortoir', 'Matelas'], 18, true, [0]),
                    ...population.map(row => createRow([row.date, row.populationTotal, row.populationCouples, row.populationMinors0To3, row.populationMinors3To6, row.populationMinors6To12, row.populationMinors12To16, row.populationMinors16To18, row.minorsInSchool, row.caravans, row.huts, row.tents, row.cars, row.mattresses], 16, false, [0])),
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
