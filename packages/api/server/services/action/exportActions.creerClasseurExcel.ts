/* eslint-disable no-param-reassign */
import ServiceError from '#server/errors/ServiceError';
import ExcelJS from 'exceljs';
import departementsOrdonnes from '#server/utils/departementsOrdonnes';
import columnToNumber from '#server/utils/excelUtils';
import { ActionReportRow, ActionItem } from '#root/types/resources/Action.d';

type DepartementObject = {
    departement: string,
    departement_name?: string,
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

type HeaderCell = {
    cell: string,
    value: string,
    fontSpecific: {
        [key: string]: string | number,
    },
};

const sectionTitles = [
    { name: 'ACTION', range: { from: 'A6', to: 'J6' } },
    { name: 'OPÉRATEURS', range: { from: 'K6', to: 'K6' } },
    { name: 'INDICATEURS GÉNÉRAUX', range: { from: 'L6', to: 'O6' } },
    { name: 'SANTÉ', range: { from: 'P6', to: 'P6' } },
    { name: 'EMPLOI', range: { from: 'Q6', to: 'R6' } },
    { name: 'HÉBERGEMENT/LOGEMENT', range: { from: 'S6', to: 'V6' } },
    { name: 'SCOLARISATION', range: { from: 'W6', to: 'AH6' } },
    { name: 'FINANCEMENT', range: { from: 'AI6', to: 'AT6' } },
    { name: 'COMMENTAIRES', range: { from: 'AU6', to: 'AW6' } },
    { name: 'MISE À JOUR', range: { from: 'AX6', to: 'AX6' } },
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
    { label: 'Mineurs identifiés sur site (3-18 ans)', width: '5' },
    { label: 'Mineurs de moins de 3 ans identifiés sur site', width: '5' },
    { label: 'Mineurs de 3 ans et plus identifiés sur site', width: '5' },
    { label: 'Mineurs bénéficiant d\'une action de médiation (3-18 ans)', width: '5' },
    { label: 'Mineurs de moins de 3 ans bénéficiant d\'une action de médiation', width: '5' },
    { label: 'Mineurs de 3 ans et plus bénéficiant d\'une action de médiation', width: '5' },
    { label: 'Mineurs dont la scolarité a débuté cette année', width: '5' },
    { label: 'Mineurs en maternelle', width: '5' },
    { label: 'Mineurs en élémentaire', width: '5' },
    { label: 'Mineurs au collège', width: '5' },
    { label: 'Mineurs au lycée ou en formation professionnelle', width: '5' },
    { label: 'Mineurs scolarisés : autre', width: '5' },
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
    const groupedData: { [key: string]: DepartementObject } = data.reduce((acc: { [key: string]: DepartementObject }, item) => {
        const { departement_code, ...rest } = item;
        acc[departement_code] = acc[departement_code] ?? {
            departement: departement_code,
            departement_name: item.departement_name,
            data: [],
        };
        acc[departement_code].data.push(rest as ActionItem);
        return acc;
    }, {});

    // Convertir l'objet en tableau
    const result: DepartementObject[] = Object.values(groupedData);

    // Créer l'objet "all"
    const allData: ActionItem[] = result.reduce((acc: ActionItem[], dept) => acc.concat(dept.data), []);
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

const setDepartementHeader = (worksheet: ExcelJS.Worksheet, departement: DepartementObject, year: number) => {
    const startingCol: string = departement.departement === 'Tous' ? 'A' : 'D';
    const dihalFinanceCampagn: Set<number> = new Set([new Date().getFullYear() - 1, new Date().getFullYear()]);
    const actionFinanceesDihal: number = departement.data.filter(action => action.finance_dedie !== null && action.finance_dedie > 0).length;
    const updatedActionsFinanceesDihal: number = departement.data.filter(action => action.finance_dedie !== null && action.finance_dedie > 0 && action.metrics_updated_at !== null && (new Date(action.metrics_updated_at) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))).length;

    try {
        const headerDatas: HeaderCell[] = [{
            cell: `${startingCol}1`,
            value: `Actions de l'année ${year}`,
            fontSpecific: {
                size: 11,
            },
        }, {
            cell: `${startingCol}2`,
            value: departement.departement === 'Tous' ? 'Toutes les actions' : `Département ${departement.departement} - ${departement.departement_name}`,
            fontSpecific: {
                size: 14,
            },
        }, {
            cell: `${startingCol}3`,
            value: 'Extraction de la plateforme Résorption bidonvilles',
            fontSpecific: {
                size: 10,
            },
        }, {
            cell: `${startingCol}4`,
            value: `à la date du ${new Date().toLocaleDateString('fr-FR')}`,
            fontSpecific: {
                size: 10,
            },
        }];
        // On ajoute les financements DIHAL si l'on est dans l'année N-1 ou N
        if (dihalFinanceCampagn.has(year)) {
            const updatedActionsFinanceesDihalPercentage = departement.data.length > 0 && actionFinanceesDihal > 0 ? `${Math.round((updatedActionsFinanceesDihal / actionFinanceesDihal) * 100)}%` : 'N/A';
            headerDatas.push({
                cell: `${startingCol}5`,
                value: `${updatedActionsFinanceesDihal} actions financées par la DIHAL sur ${actionFinanceesDihal} ont été mises à jour il y a moins de 3 mois (${updatedActionsFinanceesDihalPercentage})`,
                fontSpecific: {
                    size: 10,
                },
            });
        }

        headerDatas.forEach(({ cell, value, fontSpecific }) => {
            const headerCell = worksheet.getCell(cell);
            headerCell.value = value;
            headerCell.font = {
                name: 'Arial',
                bold: true,
                color: { argb: '000000' },
                ...fontSpecific,
            };
            headerCell.alignment = { wrapText: false, horizontal: 'left', vertical: 'middle' };
            headerCell.border = {};
        });
    } catch {
        throw new ServiceError('fetch_failed', new Error('Erreur lors de la création de l\'entête du département'));
    }
};

function sumNumbers(values: Array<number | null | undefined>): number | null {
    const numericValues = values
        .map(value => (typeof value === 'number' ? value : Number(value)))
        .filter(value => Number.isFinite(value)) as number[];

    if (numericValues.length === 0) {
        return null;
    }

    return numericValues.reduce((acc, value) => acc + value, 0);
}

// Ajouter les lignes de données
function addDataToWorksheet(data: ActionItem[], worksheet: ExcelJS.Worksheet, includeFinances: boolean = true) {
    data.forEach((item: ActionItem) => {
        const mineursIdentifiesTotal = sumNumbers([
            item.scolaire_mineurs_moins_de_trois_ans,
            item.scolaire_mineurs_trois_ans_et_plus,
        ]);

        const mineursMediationTotal = sumNumbers([
            item.scolaire_mediation_moins_de_trois_ans,
            item.scolaire_mediation_trois_ans_et_plus,
        ]);

        // Construire la ligne de données selon les permissions
        const rowData = [
            item.departement_name,
            item.region_code,
            item.region_name,
            item.action_id,
            item.action_name,
            item.started_at,
            item.ended_at,
            item.location_type,
            item.topics === null ? '' : item.topics.join(', '),
            item.goals,
            item.operators === null ? '' : item.operators.join('\n'),
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
            mineursIdentifiesTotal,
            item.scolaire_mineurs_moins_de_trois_ans,
            item.scolaire_mineurs_trois_ans_et_plus,
            mineursMediationTotal,
            item.scolaire_mediation_moins_de_trois_ans,
            item.scolaire_mediation_trois_ans_et_plus,
            item.scolaire_mineur_scolarise_dans_annee,
            item.scolaire_nombre_maternelle,
            item.scolaire_nombre_elementaire,
            item.scolaire_nombre_college,
            item.scolaire_nombre_lycee,
            item.scolaire_nombre_autre,
        ];

        // Ajouter les colonnes de financement si l'utilisateur a les permissions
        if (includeFinances) {
            rowData.push(
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
            );
        }

        // Ajouter les colonnes de commentaires et mises à jour
        rowData.push(
            item.comments,
            item.last_comment,
            item.last_comment_date,
            item.last_update,
            item.metrics_updated_at,
        );

        worksheet.addRow(rowData);
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
    const secondRow = worksheet.getRow(7);
    secondRow.height = 170;
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
            color: { argb: '000000' },
        };
        cell.alignment = {
            wrapText: true, horizontal: 'center', vertical: 'middle', indent: 2,
        };
    });
}

function hideThreeFirstColumns(worksheet: ExcelJS.Worksheet) {
    const colsToHide: Set<number> = worksheet.name === 'Tous' ? new Set([1, 2]) : new Set([0, 1, 2]);
    worksheet.columns.forEach((column, index) => {
        if (colsToHide.has(index)) {
            column.hidden = true;
        }
    });
}

export default function exportActions(
    data: ActionReportRow[],
    fetchedYear: number,
    includeFinances: boolean = true,
    allowedDepartements: string[] | null = null,
) {
    // Déterminer les sections à inclure selon les permissions
    let sectionsToInclude: SectionTitle[];
    if (includeFinances) {
        sectionsToInclude = sectionTitles;
    } else {
        // Filtrer la section FINANCEMENT et ajuster les positions des sections suivantes
        sectionsToInclude = sectionTitles
            .filter(s => s.name !== 'FINANCEMENT')
            .map((section) => {
                if (section.name === 'COMMENTAIRES') {
                    return { name: section.name, range: { from: 'AD6', to: 'AF6' } };
                }
                if (section.name === 'MISE À JOUR') {
                    return { name: section.name, range: { from: 'AG6', to: 'AH6' } };
                }
                return section;
            });
    }

    // Déterminer les headers à inclure selon les permissions
    // Les colonnes de financement vont de l'index 29 (finance_etatique) à 40 (depense_finance_autre)
    const headersToInclude = includeFinances ? headers : headers.filter((_, index) => index < 29 || index > 40);

    // Trouver la section "FINANCEMENT" si elle existe
    const financementSection = includeFinances ? findSection('FINANCEMENT') : null;
    let financementColumns: number[] = [];

    if (financementSection) {
        // Extraire les numéros de colonnes
        const fromMatch = /[A-Z]+/.exec(financementSection.range.from);
        const toMatch = /[A-Z]+/.exec(financementSection.range.to);
        if (fromMatch && toMatch) {
            const fromColumn = columnToNumber(fromMatch[0]);
            const toColumn = columnToNumber(toMatch[0]);
            // Créer un tableau avec les numéros de colonnes
            financementColumns = createFinancementColumns(fromColumn, toColumn);
        }
    }

    const workbook = new ExcelJS.Workbook();

    // Obtenir les données regroupées et triées par département
    let donneesParDepartement = regrouperEtTrierParDepartement(data);

    // Filtrer les départements selon les permissions
    if (allowedDepartements !== null) {
        donneesParDepartement = donneesParDepartement.filter(dept => dept.departement === 'Tous' || allowedDepartements.includes(dept.departement));
    }

    // Indices de colonnes de fin des sections pour mise en gras
    const columnNumbers = findSectionIndex();

    // Itérer sur chaque data de département
    donneesParDepartement.forEach((donneeParDepartement: DepartementObject) => {
        const worksheet = addDepartmentWorksheet(workbook, donneeParDepartement.departement);
        worksheet.properties.defaultColWidth = 25; // Largeur par défaut des colonnes

        // Ajouter les entêtes de sections
        setSectionTitles(sectionsToInclude, worksheet);

        // Ajouter les entêtes de colonnes
        worksheet.addRow(headersToInclude.map(header => header.label));

        // Fixer la largeur des colonnes
        headersToInclude.forEach((header, index) => {
            worksheet.getColumn(index + 1).width = Number.parseInt(header.width, 10) * 5;
        });

        // Ajouter les lignes de données
        addDataToWorksheet(donneeParDepartement.data, worksheet, includeFinances);

        // Formater toutes les cellules
        formatWorksheetCells(worksheet, columnNumbers, financementColumns);

        // Formater la colonne des commentaires
        formatCommentCol(worksheet);

        // Fixer la hauteur des lignes et formater les entêtes de sections
        setSectionHeadersHeight(worksheet);

        // Fixer la hauteur des lignes et formater les entêtes de colonnes
        setColumnHeadersHeight(worksheet);

        // Ajouter l'entête du département après le formatage global
        // pour conserver un texte non tronqué et sans bordure.
        setDepartementHeader(worksheet, donneeParDepartement, fetchedYear);

        // Masquer les colonnes A, B et C
        hideThreeFirstColumns(worksheet);
    });

    return workbook.xlsx.writeBuffer();
}
