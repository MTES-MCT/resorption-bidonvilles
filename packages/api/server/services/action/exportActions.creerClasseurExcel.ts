/* eslint-disable no-param-reassign */
import ExcelJS from 'exceljs';
import departementsOrdonnes from '#server/utils/departementsOrdonnes';
import columnToNumber from '#server/utils/excelUtils';
import { DepartementObject, ActionItem } from './exportActions.d';
import { ActionReportRow } from '#root/types/resources/Action.d';


/**
 * Regroupe et trie les données par département
 *
 * @param {ActionReportRow}        data     Données à traiter
 * @returns {DepartementObject}             Données regroupées et triées par département
 *
 */
function regrouperEtTrierParDepartement(data: ActionReportRow[]): DepartementObject[] {
    // Regroupement par département et transformation en objet
    const groupedData: DepartementObject[] = data.reduce((acc, item) => {
        const { departement_code, ...rest } = item;
        acc[departement_code] = acc[departement_code] || {
            departement: departement_code,
            data: [],
        };
        acc[departement_code].data.push(rest);
        return acc;
    }, []);

    // Tri des départements (tri personnalisé)
    const sortedData: DepartementObject[] = Object.entries(groupedData)
        .sort(([codeA], [codeB]) => departementsOrdonnes.get(codeA) - departementsOrdonnes.get(codeB))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([code, value]) => value); // On récupère uniquement les valeurs

    return sortedData;
}

const sectionTitles = [
    { name: 'ACTION', range: { from: 'A1', to: 'J1' } },
    { name: 'INDICATEURS GÉNÉRAUX', range: { from: 'K1', to: 'N1' } },
    { name: 'SANTÉ', range: { from: 'O1', to: 'O1' } },
    { name: 'EMPLOI', range: { from: 'P1', to: 'Q1' } },
    { name: 'HÉBERGEMENT/LOGEMENT', range: { from: 'R1', to: 'U1' } },
    { name: 'SCOLARISATION', range: { from: 'V1', to: 'AB1' } },
    { name: 'FINANCEMENT', range: { from: 'AC1', to: 'AN1' } },
    { name: 'COMMENTAIRES', range: { from: 'AO1', to: 'AQ1' } },
    { name: 'MISE A JOUR', range: { from: 'AR1', to: 'AR1' } },
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
    { label: 'Nombre de mineurs en âge d\'être scolarisés ou de suivre une formation', width: '5' },
    { label: 'Nombre de mineurs bénéficiant d\'une action de médiation (3 - 18 ans)', width: '5' },
    { label: 'Nombre de mineurs scolarisés en maternelle', width: '5' },
    { label: 'Nombre de mineurs scolarisés en élémentaire', width: '5' },
    { label: 'Nombre de mineurs scolarisés au collège', width: '5' },
    { label: 'Nombre de mineurs scolarisés au lycée ou en formation professionnelle', width: '5' },
    { label: 'Nombre de mineurs scolarisés: autre', width: '5' },
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
];

function formaterCommentaires(cell: ExcelJS.Cell, comments: any): void {
    // Fusionne les commentaires en une seule chaîne avec des retours à la ligne
    if (comments.length > 0 && Array.isArray(comments)) {
        const formatedComments = comments.join('\n\n');
        cell.value = formatedComments;
    }
}

export default (data: ActionReportRow[]) => {
    // Trouver la section "FINANCEMENT"
    const financementSection = sectionTitles.find(section => section.name === 'FINANCEMENT');

    // Extraire les numéros de colonnes
    const fromColumn = columnToNumber(financementSection.range.from.match(/[A-Z]+/)[0]);
    const toColumn = columnToNumber(financementSection.range.to.match(/[A-Z]+/)[0]);

    // Créer un tableau avec les numéros de colonnes
    const financementColumns = Array.from({ length: toColumn + 1 - fromColumn }, (_, i) => fromColumn + i);

    const workbook = new ExcelJS.Workbook();

    // Obtenir les données regroupées et triées par département
    const donneesParDepartement = regrouperEtTrierParDepartement(data);
    // console.log('donneesParDepartement', JSON.stringify(donneesParDepartement, null, 2));

    // Indices de colonnes de fin des sections pour mise en gras
    const columnNumbers = sectionTitles.map((section) => {
        const lastColumnLetter = section.range.to.match(/[A-Z]+/)[0];
        return columnToNumber(lastColumnLetter);
    });

    // Itérer sur chaque data de département
    donneesParDepartement.forEach((donneeParDepartement: DepartementObject) => {
        const worksheet = workbook.addWorksheet(`Dépt ${donneeParDepartement.departement}`); // Créer une nouvelle feuille
        worksheet.properties.defaultColWidth = 25; // Largeur par défaut des colonnes

        /* ===============================
           Ajouter les entêtes de sections
           =============================== */
        sectionTitles.forEach((section) => {
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

        /* ================================
           Ajouter les entêtes de colonnes
           ================================ */
        worksheet.addRow(headers.map(header => header.label));

        // Fixer la largeur des colonnes
        headers.forEach((header, index) => {
            worksheet.getColumn(index + 1).width = parseInt(header.width, 10) * 5;
        });

        // Ajouter les lignes de données
        donneeParDepartement.data.forEach((item: ActionItem) => {
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
                item.scolaire_mineurs_scolarisables,
                item.scolaire_mineurs_en_mediation,
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
            ]);
        });

        // Activer le retour à la ligne automatique,
        // centrer le texte pour toutes les cellules
        // et ajouter une bordure à chaque cellule

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

        // Formater la colonne des commentaires
        const commentsCol = worksheet.getColumn('AO');
        commentsCol.eachCell((cell) => {
            if (cell.value) {
                formaterCommentaires(cell, cell.value);
            }
        });

        // Augmenter la hauteur de la lignes affichant les entêtes de sections
        const firstRow = worksheet.getRow(1);
        firstRow.height = 30;
        firstRow.eachCell((cell) => {
            cell.alignment = {
                wrapText: true, horizontal: 'left', vertical: 'middle', indent: 2,
            };
        });


        const secondRow = worksheet.getRow(2);
        secondRow.height = 100;
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

        // Masquer les colonnes A, B et C
        worksheet.columns.forEach((column, index) => {
            if (index < 3) {
                column.hidden = true;
            }
        });
    });

    return workbook.xlsx.writeBuffer();
};
