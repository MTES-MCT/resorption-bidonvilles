import moment from 'moment';
import { Paragraph, TextRun, AlignmentType } from 'docx';
import dateUtils from '#server/utils/date';

const getUpdateTag = (monthsSinceUpdate: number | null): 'red' | 'orange' | 'green' => {
    if (monthsSinceUpdate === null || monthsSinceUpdate >= 6) {
        return 'red';
    }

    if (monthsSinceUpdate >= 3) {
        return 'orange';
    }

    return 'green';
};

export default (shantytown) => {
    const now = new Date();
    const updatedAtDate = shantytown.updatedAt ? new Date(shantytown.updatedAt * 1000) : now;
    const populationUpdatedAtDate = shantytown.populationUpdatedAt
        ? new Date(shantytown.populationUpdatedAt * 1000)
        : null;

    const currentDate = moment().utc().locale('fr');
    const lastUpdate = moment(updatedAtDate).format('DD/MM/YYYY');
    const populationLastUpdate = populationUpdatedAtDate
        ? `mis à jour le ${moment(populationUpdatedAtDate).format('DD/MM/YYYY')}`
        : 'non renseigné';
    const monthsSincePopulationUpdate = populationUpdatedAtDate
        ? dateUtils.getMonthDiffBetween(populationUpdatedAtDate, now)
        : null;
    const monthsSinceLastUpdate = dateUtils.getMonthDiffBetween(updatedAtDate, now);

    const colors = {
        red: 'AB0000',
        orange: 'ffb347',
        green: '008800',
    };

    const populationUpdateTag = getUpdateTag(monthsSincePopulationUpdate);
    const lastUpdateTag = getUpdateTag(monthsSinceLastUpdate);

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
                    color: colors.red,
                }),
                new TextRun({
                    text: `Nombre d'habitants ${populationLastUpdate}`,
                    bold: false,
                    break: 1,
                    size: 20,
                    font: 'Arial',
                    color: colors[populationUpdateTag],
                }),
                new TextRun({
                    text: `Dernière mise à jour des données le ${lastUpdate}`,
                    bold: false,
                    break: 1,
                    size: 20,
                    font: 'Arial',
                    color: colors[lastUpdateTag],
                }),
            ],
        }),
    ];
};
