import Excel, { Worksheet } from 'exceljs';
import {
    fill, writeTo, align, column as columnLetter,
} from '#server/utils/excel';
import moment from 'moment';
import { TownReport } from './types/TownReport.d';
import getTownsReport from './getTownsReport';
import { TownReportFigures } from './types/TownReportFigures';

const COLORS = {
    BLANC: { argb: 'FFFFFFFF' },
    HEADER: { argb: 'FF0D00FF' },
    CHIFFRES_GLOBAUX: { argb: 'FFEAD1DC' },
    CHIFFRES_EUROPEENS: { argb: 'FFD9D2E9' },
    CHIFFRES_EXTRA_UE: { argb: 'FFCFE2F3' },
    CHIFFRES_FR: { argb: 'FFD9EAD3' },
    CHIFFRES_MELANGES: { argb: 'FFFEF2CC' },
    CHIFFRES_INCONNUS: { argb: 'FFFCE5CD' },
    CHIFFRES_MINEURS: { argb: 'FFD0E0E3' },
    SEPARATEUR: { argb: 'FF999999' },
};

type WriteCellFn = (sheet: Worksheet, ref: string, content: string) => void;
const writeHeaderCell: WriteCellFn = (sheet, ref, content) => {
    fill(sheet, ref, COLORS.HEADER);
    align(sheet, ref, {
        horizontal: 'center',
        vertical: 'middle',
    });
    writeTo(sheet, ref, {
        color: COLORS.BLANC,
        text: content,
    });
};

type PropertyDefinition = {
    label: string,
    bgColor: Partial<Excel.Color>,
    value: (report: TownReport, size?: keyof TownReport, territory?: keyof TownReportFigures) => number | string
};
const propertiesList: PropertyDefinition[] = [
    {
        label: 'Nombre de sites',
        bgColor: COLORS.CHIFFRES_GLOBAUX,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_towns.total,
    },
    {
        label: 'Nombre de personnes',
        bgColor: COLORS.CHIFFRES_GLOBAUX,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.total,
    },
    {
        label: 'Nombre de mineurs',
        bgColor: COLORS.CHIFFRES_GLOBAUX,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.minors,
    },
    {
        label: 'Nombre de sites avec exclusivement des intra UE',
        bgColor: COLORS.CHIFFRES_EUROPEENS,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_towns.eu_only,
    },
    {
        label: 'Nombre de personnes intra UE (sites exclusivement intra UE)',
        bgColor: COLORS.CHIFFRES_EUROPEENS,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_european,
    },
    {
        label: 'Nombre de mineurs intra UE (sites exclusivement intra UE)',
        bgColor: COLORS.CHIFFRES_EUROPEENS,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_european_minors,
    },
    {
        label: 'Nombre de sites exclusivement extra UE',
        bgColor: COLORS.CHIFFRES_EXTRA_UE,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_towns.extra_eu_only,
    },
    {
        label: 'Nombre de personnes extra UE (sites exclusivement extra UE)',
        bgColor: COLORS.CHIFFRES_EXTRA_UE,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_other,
    },
    {
        label: 'Nombre de mineurs extra UE (sites exclusivement extra UE)',
        bgColor: COLORS.CHIFFRES_EXTRA_UE,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_other_minors,
    },
    {
        label: 'Nombre de sites exclusivement français',
        bgColor: COLORS.CHIFFRES_FR,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_towns.french_only,
    },
    {
        label: 'Nombre de personnes Françaises (sites exclusivement français)',
        bgColor: COLORS.CHIFFRES_FR,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_french,
    },
    {
        label: 'Nombre de mineurs Français (sites exclusivement français)',
        bgColor: COLORS.CHIFFRES_FR,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_french_minors,
    },
    {
        label: 'Nombre de sites mixtes (plus d\'une origine)',
        bgColor: COLORS.CHIFFRES_MELANGES,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_towns.mixed_origins,
    },
    {
        label: 'Nombre de personnes sur sites mixtes (plus d\'une origine)',
        bgColor: COLORS.CHIFFRES_MELANGES,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_mixed,
    },
    {
        label: 'Nombre de mineurs sur sites mixtes (plus d\'une origine)',
        bgColor: COLORS.CHIFFRES_MELANGES,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_mixed_minors,
    },
    {
        label: 'Nombre de sites où l\'origine des personnes est non renseignée',
        bgColor: COLORS.CHIFFRES_INCONNUS,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_towns.unknown_origins,
    },
    {
        label: 'Nombre de personnes dont l\'origine est non renseignée',
        bgColor: COLORS.CHIFFRES_INCONNUS,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_null,
    },
    {
        label: 'Nombre de mineurs dont l\'origine est non renseignée',
        bgColor: COLORS.CHIFFRES_INCONNUS,
        value: (report, size, territory) => (<TownReportFigures>report[size])[territory].number_of_people.origins_null_minors,
    },
];

type SectionDefinition = { label: string, key: keyof TownReport };
const sectionsList: SectionDefinition[] = [
    { key: 'all_sizes', label: 'Sites de toutes tailles (dont NC)' },
    { key: 'big_towns_only', label: 'Sites de 10 personnes ou plus (NC non compris)' },
];

const sidePropertiesList: PropertyDefinition[] = [
    {
        label: 'Nombre de sites exclusivement intra UE de 10 à 50 personnes',
        value: report => report.population_10_50.european,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites exclusivement intra UE de 51 à 100 personnes',
        value: report => report.population_51_100.european,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites exclusivement intra UE de 101 à 150 personnes',
        value: report => report.population_101_150.european,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites exclusivement intra UE de 151 à 200 personnes',
        value: report => report.population_151_200.european,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites exclusivement intra UE de 201 à 250 personnes',
        value: report => report.population_201_250.european,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites exclusivement intra UE de plus de 250 personnes',
        value: report => report.population_251_or_more.european,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites tous publics de 10 à 50 personnes',
        value: report => report.population_10_50.all,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites tous publics de 51 à 100 personnes',
        value: report => report.population_51_100.all,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites tous publics de 101 à 150 personnes',
        value: report => report.population_101_150.all,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites tous publics de 151 à 200 personnes',
        value: report => report.population_151_200.all,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites tous publics de 201 à 250 personnes',
        value: report => report.population_201_250.all,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Nombre de sites tous publics de plus de 250 personnes',
        value: report => report.population_251_or_more.all,
        bgColor: COLORS.BLANC,
    },
    {
        label: 'Liste des sites tous publics de plus de 200 personnes',
        value: report => [...report.population_201_250.all_ids, ...report.population_251_or_more.all_ids].join(', '),
        bgColor: COLORS.BLANC,
    },
];

type TerritoryDefinition = { label: string, key: keyof TownReportFigures };
const territories: TerritoryDefinition[] = [
    { key: 'metropolitan', label: 'France métropolitaine' },
    { key: 'overseas', label: 'Outre-mer' },
];

function getFirstRowIndexOfASection(sectionIndex: number): number {
    // +1 car les index des lignes sur Excel commencent à 1 et non pas 0
    // +1 car la première ligne est le header
    // = +2
    return (sectionIndex * propertiesList.length * territories.length) + 2;
}

function createColumnTailleDuSite(sheet: Worksheet): void {
    // on définit la largeur de la colonne
    const col = sheet.getColumn(1);
    col.width = 40;

    // on crée le header
    writeHeaderCell(sheet, 'A1', 'Taille du site');

    // on crée les entêtes pour les deux catégories "toutes tailles" et "sites de 10 personnes et plus"
    sectionsList.forEach(({ label }, index) => {
        const rowIndex = getFirstRowIndexOfASection(index);
        writeTo(sheet, `A${rowIndex}`, { text: label, bold: true });
    });
}

function createColumnTerritoire(sheet: Worksheet): void {
    // on définit la largeur de la colonne
    const col = sheet.getColumn(2);
    col.width = 30;

    // on crée le header
    writeHeaderCell(sheet, 'B1', 'Territoire');

    // on crée les entêtes pour chaque territoire
    sectionsList.forEach((section, sectionIndex) => {
        const firstRowIndex = getFirstRowIndexOfASection(sectionIndex);
        territories.forEach(({ label }, index) => {
            const rowIndex = firstRowIndex + (index * propertiesList.length);
            writeTo(sheet, `B${rowIndex}`, { text: label, bold: true });
        });
    });
}

function createColumnOrigines(sheet: Worksheet): void {
    // on définit la largeur de la colonne
    const col = sheet.getColumn(3);
    col.width = 55;

    // on crée le header
    writeHeaderCell(sheet, 'C1', 'Origines');

    // on crée les entêtes pour chaque propriété
    sectionsList.forEach((section, sectionIndex) => {
        territories.forEach((territory, territoryIndex) => {
            const firstRowIndex = getFirstRowIndexOfASection(sectionIndex) + (territoryIndex * propertiesList.length);
            propertiesList.forEach((property, index) => {
                fill(sheet, `C${firstRowIndex + index}`, property.bgColor);
                writeTo(sheet, `C${firstRowIndex + index}`, { text: property.label });
            });
        });
    });

    // on crée les entêtes pour chaque "propriétés bonus"
    const firstRowIndex = getFirstRowIndexOfASection(sectionsList.length) + 1;
    sidePropertiesList.forEach((property, index) => {
        writeTo(sheet, `C${firstRowIndex + index}`, { text: property.label });
    });
}

function createColumnData(sheet: Worksheet, report: TownReport, index: number): void {
    const colIndex = index + 4;
    const colAlpha = columnLetter(colIndex);
    // +1 car les colonnes sur Excel commencent à 1 et non pas 0
    // et +3 car les 3 premières colonnes sont réservées aux entêtes
    // = +4

    // on définit la largeur de la colonne
    const col = sheet.getColumn(colIndex);
    col.width = 16;

    // on crée le header
    writeHeaderCell(sheet, `${colAlpha}1`, moment(report.date).format('DD/MM/YYYY'));

    // on injecte les valeurs pour chaque propriété
    sectionsList.forEach((section, sectionIndex) => {
        territories.forEach((territory, territoryIndex) => {
            const firstRowIndex = getFirstRowIndexOfASection(sectionIndex) + (territoryIndex * propertiesList.length);
            propertiesList.forEach((property, propertyIndex) => {
                const ref = `${colAlpha}${firstRowIndex + propertyIndex}`;
                fill(sheet, ref, property.bgColor);
                writeTo(sheet, ref, { text: property.value(report, section.key, territory.key) });
                align(sheet, ref, {
                    horizontal: 'right',
                    vertical: 'middle',
                });
            });
        });
    });

    // on injecte les valeurs pour chaque "propriétés bonus"
    const firstRowIndex = getFirstRowIndexOfASection(sectionsList.length) + 1;
    sidePropertiesList.forEach((property, propertyIndex) => {
        writeTo(sheet, `${colAlpha}${firstRowIndex + propertyIndex}`, { text: property.value(report) });
    });
}

function createSeparator(sheet: Worksheet, reportLength: number): void {
    const rowIndex = getFirstRowIndexOfASection(sectionsList.length);
    const colCount = 3 + reportLength;

    for (let i = 0; i < colCount; i += 1) {
        fill(sheet, `${columnLetter(i + 1)}${rowIndex}`, COLORS.SEPARATEUR);
    }
}

export default async (from: Date, to: Date): Promise<Excel.Buffer> => {
    const workbook = new Excel.Workbook();

    const data = await getTownsReport(from, to);
    const sheet: Worksheet = workbook.addWorksheet(
        'Sites ouverts',
        {
            views: [{
                state: 'frozen',
                xSplit: 3,
                ySplit: 1,
            }],
        },
    );

    createColumnTailleDuSite(sheet);
    createColumnTerritoire(sheet);
    createColumnOrigines(sheet);
    data.forEach((report, index) => createColumnData(sheet, report, index));
    createSeparator(sheet, data.length);

    return workbook.xlsx.writeBuffer();
};
