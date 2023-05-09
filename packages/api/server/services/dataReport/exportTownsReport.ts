import Excel, { Worksheet } from 'exceljs';
import {
    fill, writeTo, align, column as columnLetter,
} from '#server/utils/excel';
import moment from 'moment';
import { TownReport } from './types/TownReport.d';
import getTownsReport from './getTownsReport';

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

type PropertyDefinition = { label: string, bgColor: Partial<Excel.Color>, value: (report: TownReport, section: 'all' | 'big_towns_only') => number };
const propertiesList: PropertyDefinition[] = [
    {
        label: 'Nombre de sites',
        bgColor: COLORS.CHIFFRES_GLOBAUX,
        value: (report, section) => report[section].number_of_towns.all - report[section].number_of_towns.overseas,
    },
    {
        label: 'Nombre de sites (Outre-Mer compris)',
        bgColor: COLORS.CHIFFRES_GLOBAUX,
        value: (report, section) => report[section].number_of_towns.all,
    },
    {
        label: 'Nombre de personnes',
        bgColor: COLORS.CHIFFRES_GLOBAUX,
        value: (report, section) => report[section].number_of_people.all - report[section].number_of_people.overseas,
    },
    {
        label: 'Nombre de personnes (Outre-Mer compris)',
        bgColor: COLORS.CHIFFRES_GLOBAUX,
        value: (report, section) => report[section].number_of_people.all,
    },
    {
        label: 'Nombre de sites intra UE',
        bgColor: COLORS.CHIFFRES_EUROPEENS,
        value: (report, section) => report[section].number_of_towns.eu_only,
    },
    {
        label: 'Nombre intra UE',
        bgColor: COLORS.CHIFFRES_EUROPEENS,
        value: (report, section) => report[section].number_of_people.origins_european,
    },
    {
        label: 'Nombre de sites extra UE',
        bgColor: COLORS.CHIFFRES_EXTRA_UE,
        value: (report, section) => report[section].number_of_towns.extra_eu_only,
    },
    {
        label: 'Nombre extra UE',
        bgColor: COLORS.CHIFFRES_EXTRA_UE,
        value: (report, section) => report[section].number_of_people.origins_other,
    },
    {
        label: 'Nombre de sites Français',
        bgColor: COLORS.CHIFFRES_FR,
        value: (report, section) => report[section].number_of_towns.french_only,
    },
    {
        label: 'Nombre de Français',
        bgColor: COLORS.CHIFFRES_FR,
        value: (report, section) => report[section].number_of_people.origins_french,
    },
    {
        label: 'Nombre de sites mélangés',
        bgColor: COLORS.CHIFFRES_MELANGES,
        value: (report, section) => report[section].number_of_towns.mixed_origins,
    },
    {
        label: 'Nombre d\'habitants sites mélangés',
        bgColor: COLORS.CHIFFRES_MELANGES,
        value: (report, section) => report[section].number_of_people.origins_mixed,
    },
    {
        label: 'Nombre de sites origines non renseignées',
        bgColor: COLORS.CHIFFRES_INCONNUS,
        value: (report, section) => report[section].number_of_towns.unknown_origins,
    },
    {
        label: 'Nombre d\'habitants origines non renseignées',
        bgColor: COLORS.CHIFFRES_INCONNUS,
        value: (report, section) => report[section].number_of_people.origins_null,
    },
    {
        label: 'Nombre de mineurs (Outre-Mer non compris)',
        bgColor: COLORS.CHIFFRES_MINEURS,
        value: (report, section) => report[section].number_of_people.minors,
    },
    {
        label: 'Nombre de mineurs scolarisés (Outre-Mer non compris)',
        bgColor: COLORS.CHIFFRES_MINEURS,
        value: (report, section) => report[section].number_of_people.minors_in_school,
    },
];

type SectionDefinition = { label: string, key: 'all' | 'big_towns_only' };
const sectionsList: SectionDefinition[] = [
    { key: 'all', label: 'Sites de toutes tailles (dont NC)' },
    { key: 'big_towns_only', label: 'Sites + 10 pers. NC non compris' },
];

function getFirstRowIndexOfASection(sectionIndex: number): number {
    // pour chaque section il y a :
    //  N lignes (1 pour chaque propriété)
    // +1 ligne vide de séparation avec la section suivante
    // = +1

    // ensuite, globalement il y a :
    // +1 car les index des lignes sur Excel commencent à 1 et non pas 0
    // +1 car la première ligne est le header
    // = +2
    return (sectionIndex * (propertiesList.length + 1)) + 2;
}

function createSeparationRowForSection(sheet: Worksheet, sectionIndex: number, column: string): void {
    // no separation row for the last section
    if (sectionIndex >= sectionsList.length - 1) {
        return;
    }

    const rowIndex = getFirstRowIndexOfASection(sectionIndex + 1) - 1;
    fill(sheet, `${column}${rowIndex}`, COLORS.SEPARATEUR);
}

function createColumnTailleDuSite(sheet: Worksheet): void {
    // on définit la largeur de la colonne
    const col = sheet.getColumn(1);
    col.width = 40;

    // on crée le header
    writeHeaderCell(sheet, 'A1', 'Taille du site');

    // on crée les entêtes pour les deux catégories "toutes tailles" et "nombre de sites"
    sectionsList.forEach(({ label }, index) => {
        const rowIndex = getFirstRowIndexOfASection(index);
        writeTo(sheet, `A${rowIndex}`, { text: label });
        createSeparationRowForSection(sheet, index, 'A');
    });
}

function createColumnOrigines(sheet: Worksheet): void {
    // on définit la largeur de la colonne
    const col = sheet.getColumn(2);
    col.width = 40;

    // on crée le header
    writeHeaderCell(sheet, 'B1', 'Origines');

    // on crée les entêtes pour chaque propriété
    sectionsList.forEach((section, index) => {
        const rowIndex = getFirstRowIndexOfASection(index);
        propertiesList.forEach((property, propertyIndex) => {
            fill(sheet, `B${rowIndex + propertyIndex}`, property.bgColor);
            writeTo(sheet, `B${rowIndex + propertyIndex}`, { text: property.label });
        });
        createSeparationRowForSection(sheet, index, 'B');
    });
}

function createColumnData(sheet: Worksheet, report: TownReport, index: number) {
    // on définit la largeur de la colonne
    const col = sheet.getColumn(index + 3);
    col.width = 16;

    // on crée le header
    const colAlpha = columnLetter(index + 3);
    writeHeaderCell(sheet, `${colAlpha}1`, moment(report.date).format('DD/MM/YYYY'));

    // on injecte les valeurs pour chaque propriété
    sectionsList.forEach((section, sectionIndex) => {
        const rowIndex = getFirstRowIndexOfASection(sectionIndex);
        propertiesList.forEach((property, propertyIndex) => {
            const ref = `${colAlpha}${rowIndex + propertyIndex}`;
            fill(sheet, ref, property.bgColor);
            writeTo(sheet, ref, { text: property.value(report, section.key) });
            align(sheet, ref, {
                horizontal: 'right',
                vertical: 'middle',
            });
        });
        createSeparationRowForSection(sheet, sectionIndex, colAlpha);
    });
}

export default async (from: Date, to: Date): Promise<Excel.Buffer> => {
    const workbook = new Excel.Workbook();

    const data = await getTownsReport(from, to);
    const sheet: Worksheet = workbook.addWorksheet(
        'Sites ouverts',
        {
            views: [{
                state: 'frozen',
                xSplit: 1,
                ySplit: 2,
            }],
        },
    );

    createColumnTailleDuSite(sheet);
    createColumnOrigines(sheet);
    data.forEach((report, index) => createColumnData(sheet, report, index));

    return workbook.xlsx.writeBuffer();
};
