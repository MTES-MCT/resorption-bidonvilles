import moment from 'moment';
import { Paragraph, TextRun, AlignmentType } from 'docx';

export default (shantytown) => {
    const currentDate = moment().utcOffset(2).locale('fr');
    const lastUpdate = moment(new Date(shantytown.updatedAt * 1000)).format('DD/MM/YYYY');

    return [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
                before: 500,
                after: 200,
            },
            children: [
                new TextRun({
                    text: shantytown.usename,
                    bold: true,
                    size: 30,
                    font: 'Arial',
                }),
                new TextRun({
                    text: shantytown.city.name,
                    break: 1,
                    bold: true,
                    size: 30,
                    font: 'Arial',
                }),
                new TextRun({
                    text: currentDate.format('MMMM YYYY'),
                    allCaps: true,
                    break: 1,
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
                    text: 'Données extraites de la plateforme ',
                    bold: false,
                    size: 20,
                    font: 'Arial',
                }),
                new TextRun({
                    text: 'Résorption-bidonvilles',
                    bold: false,
                    size: 20,
                    italics: true,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `https://app.resorption-bidonvilles.dihal.gouv.fr/site/${shantytown.id}`,
                    bold: false,
                    break: 1,
                    size: 20,
                    font: 'Arial',
                }),
                new TextRun({
                    text: `Fiche exportée le ${currentDate.format('DD/MM/YYYY')}`,
                    bold: false,
                    break: 1,
                    size: 20,
                    font: 'Arial',
                    color: 'ff6f4c',
                }),
                new TextRun({
                    text: `Dernière mise à jour des données le ${lastUpdate}`,
                    bold: false,
                    break: 1,
                    size: 20,
                    font: 'Arial',
                    color: 'ff6f4c',
                }),
            ],
        }),
    ];
};
