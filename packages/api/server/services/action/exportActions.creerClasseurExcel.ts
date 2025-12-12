/* eslint-disable no-param-reassign */
import ExcelJS from 'exceljs';
import departementsOrdonnes from '#server/utils/departementsOrdonnes';
import columnToNumber from '#server/utils/excelUtils';
import { ActionReportRow, ActionItem } from '#root/types/resources/Action.d';

type DepartementObject = {
    departement: string,
    data: ActionItem[]
};

type Range = {
    from: string,
    to: string
};

type SectionTitle = {
    name: string,
    range: Range
};

const sectionTitles = [
    { name: 'ACTION', range: { from: 'A1', to: 'J1' } },
    { name: 'OPÉRATEURS', range: { from: 'K1', to: 'K1' } },
    { name: 'INDICATEURS GÉNÉRAUX', range: { from: 'L1', to: 'O1' } },
    { name: 'SANTÉ', range: { from: 'P1', to: 'P1' } },
    { name: 'EMPLOI', range: { from: 'Q1', to: 'R1' } },
    { name: 'HÉBERGEMENT/LOGEMENT', range: { from: 'S1', to: 'V1' } },
    { name: 'SCOLARISATION', range: { from: 'W1', to: 'AG1' } },
    { name: 'FINANCEMENT', range: { from: 'AH1', to: 'AS1' } },
    { name: 'COMMENTAIRES', range: { from: 'AT1', to: 'AV1' } },
    { name: 'MISE À JOUR', range: { from: 'AW1', to: 'AW1' } },
];

const headers = [
    { label: 'Département', width: '7' },
    { label: 'Code région', width: '3' },
    { label: 'Région', width: '7' },
    { label: 'ID action', width: '3' },
    { label: 'Nom action', width: '8' },
    { label: 'Date de lancement/début', width: '3' },
    { label: 'Date de fin (prévue)', width: '3' },
    { label: 'Lieu', width: '4' },
    { label: 'Champs d\'intervention', width: '7' },
    { label: 'Objectifs de l\'action', width: '10' },
    { label: 'Opérateurs', width: '7' },
    { label: 'Nombre total de personnes concernées par l\'action', width: '5' },
    { label: 'Nombre de ménages', width: '5' },
    { label: 'Nombre de femmes', width: '5' },
    { label: 'Nombre de mineurs', width: '5' },
    { label: 'Nombre de personnes ayant eu un accompagnement vers la santé', width: '5' },
    { label: 'Nombre de personnes ayant eu au moins un contrat de travail dans l\'année', width: '5' },
    { label: 'Nombre de femmes ayant eu au moins un contrat de travail dans l\'année', width: '5' },
    { label: 'Nombre de personnes ayant eu accès à une solution longue durée en hébergement ou logement adapté avec accompagnement, dont espace temporaire d\'accompagnement', width: '5' },
    { label: 'Nombre de ménages ayant eu accès à une solution longue durée en hébergement ou logement adapté avec accompagnement, dont espace temporaire d\'accompagnement', width: '5' },
    { label: 'Nombre de personnes ayant eu accès à un logement', width: '5' },
    { label: 'Nombre de ménages ayant eu accès à un logement', width: '5' },
    { label: 'Mineurs de moins de 3 ans identifiés sur site', width: '5' },
    { label: 'Mineurs de 3 ans et plus identifiés sur site', width: '5' },
    { label: 'Mineurs de moins de 3 ans bénéficiant d\'une action de médiation', width: '5' },
    { label: 'Mineurs de 3 ans et plus bénéficiant d\'une action de médiation', width: '5' },
    { label: 'Mineurs dont la scolarité a débuté cette année', width: '5' },
    { label: 'Total mineurs scolarisés (maternelle/élémentaire/collège/lycée ou formation professionnelle, hors "Autre")', width: '5' },
    { label: 'Mineurs en maternelle', width: '5' },
    { label: 'Mineurs en élémentaire', width: '5' },
    { label: 'Mineurs au collège', width: '5' },
    { label: 'Mineurs au lycée ou en formation professionnelle', width: '5' },
    { label: 'Autre - jeunes en dispositif d\'insertion', width: '5' },
    { label: 'Financement étatique hors crédits dédiés', width: '5' },
    { label: 'Dépense sur financement étatique hors crédits dédiés', width: '5' },
    { label: 'Crédits dédiés à la résorption des bidonvilles', width: '5' },
    { label: 'Dépense sur crédits dédiés à la résorption des bidonvilles', width: '5' },
    { label: 'Cofinancement collectivité territoriale', width: '5' },
    { label: 'Dépense sur cofinancement collectivité territoriale', width: '5' },
    { label: 'Financement européen', width: '5' },
    { label: 'Dépense sur financement européen', width: '5' },
    { label: 'Financement privé', width: '5' },
    { label: 'Dépense sur financement privé', width: '5' },
    { label: 'Autre financement', width: '5' },
    { label: 'Dépense sur autre financement', width: '5' },
    { label: 'Commentaires', width: '10' },
    { label: 'Dernier commentaire', width: '10' },
    { label: 'Date du dernier commentaire', width: '5' },
    { label: 'Action mise à jour le', width: '5' },
    { label: 'Indicateurs mis à jour le', width: '5' },
];

function regrouperParDepartement(data: ActionReportRow[]): DepartementObject[] {
    const groupedData: { [key: string]: DepartementObject } = data.reduce((acc, item) => {
        const { departement_code, ...rest } = item;
        acc[departement_code] = acc[departement_code] ?? {
            departement: departement_code,
            data: [],
        };
        acc[departement_code].data.push(rest);
        return acc;
    }, {});

    // Convertir l'objet en tableau
    const result: DepartementObject[] = Object.values(groupedData);

    // Créer l'objet "all"
    const allData: ActionItem[] = result.reduce((acc, dept) => acc.concat(dept.data), []);
    result.push({ departement: 'Tous', data: allData });

    return result;
}

function trierParDepartement(
    data: DepartementObject[],
    orderMap: Map<string, number>,
): DepartementObject[] {
    return data.sort((a, b) => {
        const orderA = orderMap.get(a.departement) ?? Infinity; // Utiliser Infinity si non trouvé
        const orderB = orderMap.get(b.departement) ?? Infinity;
        return orderA - orderB;
    });
}

/**
 * Regroupe et trie les données par département
 *
 * @param {ActionReportRow}        data     Données à traiter
 * @returns {DepartementObject}             Données regroupées et triées par département
 *
 */
function regrouperEtTrierParDepartement(data: ActionReportRow[]): DepartementObject[] {
    // Regroupement par département et transformation en objet
    const groupedData = regrouperParDepartement(data);

    // Tri des départements (tri personnalisé)
    return trierParDepartement(groupedData, departementsOrdonnes);
}

function formaterCommentaires(cell: ExcelJS.Cell, comments: any): void {
    // Fusionne les commentaires en une seule chaîne avec des retours à la ligne
    if (comments.length > 0 && Array.isArray(comments)) {
        const formatedComments = comments.join('\n\n');
        cell.value = formatedComments;
    }
}

function findSection(sectionLabel: string) {
    return sectionTitles.find(section => section.name === sectionLabel);
}

function findSectionIndex() {
    return sectionTitles.map((section) => {
        const match = /[A-Z]+/.exec(section.range.to);
        const lastColumnLetter = match ? match[0] : '';
        return columnToNumber(lastColumnLetter);
    });
}

function createFinancementColumns(fromColumn: number, toColumn: number) {
    return Array.from({ length: toColumn + 1 - fromColumn }, (_, i) => fromColumn + i);
}

// Ajouter les entêtes de sections
function setSectionTitles(sections: SectionTitle[], worksheet: ExcelJS.Worksheet) {
    sections.forEach((section) => {
        const { from, to } = section.range;
        worksheet.mergeCells(from, to);
        worksheet.getCell(from).value = section.name;
        worksheet.getCell(from).font = {
            name: 'Arial',
            size: 14,
            bold: true,
            color: { argb: 'FFFFFF' },
        };
        worksheet.getCell(from).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '000000' },
        };
        worksheet.getCell(from).alignment = { horizontal: 'left', vertical: 'middle', indent: 5 };
    });
}

// Ajouter les lignes de données
function sumNumbers(values: Array<number | null | undefined>): number | null {
    const numericValues = values
        .map(value => (typeof value === 'number' ? value : Number(value)))
        .filter(value => Number.isFinite(value));

    if (numericValues.length === 0) {
        return null;
    }

    return numericValues.reduce((acc, value) => acc + value, 0);
}

function addDataToWorksheet(data: ActionItem[], worksheet: ExcelJS.Worksheet) {
    data.forEach((item: ActionItem) => {
        // Calcul du total des mineurs scolarisés (hors "Autre")
        const mineursScolarisesTotal = sumNumbers([
            item.scolaire_nombre_maternelle,
            item.scolaire_nombre_elementaire,
            item.scolaire_nombre_college,
            item.scolaire_nombre_lycee,
        ]);

        // Traiter les opérateurs (nom, prénom, organisation)
        worksheet.addRow([
            item.departement_name,
            item.region_code,
            item.region_name,
            item.action_id,
            item.action_name,
            item.started_at,
            item.ended_at,
            item.location_type,
            item.topics.join(', '),
            item.goals,
            item.operators.join('\n'),
            item.nombre_personnes,
            item.nombre_menages,
            item.nombre_femmes,
            item.nombre_mineurs,
            item.sante_nombre_personnes,
            item.travail_nombre_personnes,
            item.travail_nombre_femmes,
            item.hebergement_nombre_personnes,
            item.hebergement_nombre_menages,
            item.logement_nombre_personnes,
            item.logement_nombre_menages,
            item.scolaire_mineurs_moins_de_trois_ans,
            item.scolaire_mineurs_trois_ans_et_plus,
            item.scolaire_mediation_moins_de_trois_ans,
            item.scolaire_mediation_trois_ans_et_plus,
            item.scolaire_mineur_scolarise_dans_annee,
            mineursScolarisesTotal,
            item.scolaire_nombre_maternelle,
            item.scolaire_nombre_elementaire,
            item.scolaire_nombre_college,
            item.scolaire_nombre_lycee,
            item.scolaire_nombre_autre,
            item.finance_etatique,
            item.depense_finance_etatique,
            item.finance_dedie,
            item.depense_finance_dedie,
            item.finance_collectivite,
            item.depense_finance_collectivite,
            item.finance_europeen,
            item.depense_finance_europeen,
            item.finance_prive,
            item.depense_finance_prive,
            item.finance_autre,
            item.depense_finance_autre,
            item.comments,
            item.last_comment,
            item.last_comment_date,
            item.last_update,
            item.metrics_updated_at,
        ]);
    });
}

function addDepartmentWorksheet(workbook: ExcelJS.Workbook, departement: string) {
    return workbook.addWorksheet(departement === 'Tous' ? `${departement}` : `Dépt ${departement}`);
}

// Activer le retour à la ligne automatique,
// centrer le texte pour toutes les cellules
// et ajouter une bordure à chaque cellule
function formatWorksheetCells(worksheet: ExcelJS.Worksheet, columnNumbers: number[], financementColumns: number[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    worksheet.eachRow({ includeEmpty: true }, (row, _rowNumber) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        row.eachCell({ includeEmpty: true }, (cell, _colNumber) => {
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } },
            };
            if (columnNumbers.includes(_colNumber)) {
                cell.border = {
                    top: { style: 'thin', color: { argb: '000000' } },
                    left: { style: 'thin', color: { argb: '000000' } },
                    bottom: { style: 'thin', color: { argb: '000000' } },
                    right: { style: 'thick', color: { argb: '000000' } },
                };
            }
            cell.alignment = { wrapText: true, indent: 2 };
            if (financementColumns.includes(_colNumber)) {
                cell.numFmt = '# ##0.00 [$€-40C];[RED]-# ##0.00 [$€-40C]'; // Format monétaire français
            }
        });
    });
}

function formatCommentCol(worksheet: ExcelJS.Worksheet) {
    const commentsCol = worksheet.getColumn('AU');
    commentsCol.eachCell((cell) => {
        if (cell.value) {
            formaterCommentaires(cell, cell.value);
        }
    });
}

function setSectionHeadersHeight(worksheet: ExcelJS.Worksheet) {
    const firstRow = worksheet.getRow(1);
    firstRow.height = 30;
    firstRow.eachCell((cell) => {
        cell.alignment = {
            wrapText: true, horizontal: 'left', vertical: 'middle', indent: 2,
        };
    });
}

function setColumnHeadersHeight(worksheet: ExcelJS.Worksheet) {
    const secondRow = worksheet.getRow(2);
    secondRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFbdbdbd' },
        };
        cell.font = {
            name: 'Arial',
            size: 10,
            bold: true,
            color: { argb: 'OOOOOO' },
        };
        cell.alignment = {
            wrapText: true, horizontal: 'center', vertical: 'middle', indent: 2,
        };
    });
}

function hideThreeFirstColumns(worksheet: ExcelJS.Worksheet) {
    const colsToHide = worksheet.name === 'Tous' ? [1, 2] : [0, 1, 2];
    worksheet.columns.forEach((column, index) => {
        if (colsToHide.includes(index)) {
            column.hidden = true;
        }
    });
}

export default (data: ActionReportRow[]) => {
    // Trouver la section "FINANCEMENT"
    const financementSection = findSection('FINANCEMENT');

    // Extraire les numéros de colonnes
    const fromColumn = columnToNumber(/[A-Z]+/.exec(financementSection.range.from)[0]);
    const toColumn = columnToNumber(/[A-Z]+/.exec(financementSection.range.to)[0]);

    // Créer un tableau avec les numéros de colonnes
    const financementColumns = createFinancementColumns(fromColumn, toColumn);

    const workbook = new ExcelJS.Workbook();

    // Obtenir les données regroupées et triées par département
    const donneesParDepartement = regrouperEtTrierParDepartement(data);

    // Indices de colonnes de fin des sections pour mise en gras
    const columnNumbers = findSectionIndex();

    // Itérer sur chaque data de département
    donneesParDepartement.forEach((donneeParDepartement: DepartementObject) => {
        const worksheet = addDepartmentWorksheet(workbook, donneeParDepartement.departement);
        // const worksheet = workbook.addWorksheet(donneeParDepartement.departement === 'Tous' ? `${donneeParDepartement.departement}` : `Dépt ${donneeParDepartement.departement}`);
        worksheet.properties.defaultColWidth = 25; // Largeur par défaut des colonnes

        // Ajouter les entêtes de sections
        setSectionTitles(sectionTitles, worksheet);

        // Ajouter les entêtes de colonnes
        worksheet.addRow(headers.map(header => header.label));

        // Fixer la largeur des colonnes
        headers.forEach((header, index) => {
            worksheet.getColumn(index + 1).width = parseInt(header.width, 10) * 5;
        });

        // Ajouter les lignes de données
        addDataToWorksheet(donneeParDepartement.data, worksheet);

        // Formater toutes les cellules
        formatWorksheetCells(worksheet, columnNumbers, financementColumns);

        // Formater la colonne des commentaires
        formatCommentCol(worksheet);

        // Fixer la hauteur des lignes et formater les entêtes de sections
        setSectionHeadersHeight(worksheet);

        // Fixer la hauteur des lignes et formater les entêtes de colonnes
        setColumnHeadersHeight(worksheet);

        // Masquer les colonnes A, B et C
        hideThreeFirstColumns(worksheet);
    });

    return workbook.xlsx.writeBuffer();
};
