import Excel, { Color, Worksheet } from 'exceljs';


enum FONT_SIZES {
    DEFAULT = 10,
    BIG = 14,
}

type CellContent = {
    text?: string | number,
    link?: string,
    formula?: string,
    size?: FONT_SIZES,
    bold?: boolean,
    italic?: boolean,
    color?: Partial<Color>,
};

type CellMultipart = {
    text: string,
    size?: FONT_SIZES,
    bold?: boolean,
    italic?: boolean,
    color?: Partial<Color>,
};
type MultipartCellContent = CellMultipart[];

/**
 * @callback DataCallback
 * @param {Shantytown} shantytown
 * @returns {String|Number}
 */

/**
 * @typedef {Object} Section
 * @property {String}           title
 * @property {Array.<Property>} [properties]  Either properties or subsections
 * @property {Array.<Section>}  [subsections] Either properties or subsections
 * @property {Boolean}          [lastFrozen]
 */

/**
 * @typedef {Object} Property
 * @property {String}       title
 * @property {Number}       width            Width of the column for this property
 * @property {DataCallback} data             Takes a shantytown as input and computes the data for this property
 * @property {Boolean}      [sum=false]      Wether a sum of the column should be added in the "footer"
 * @property {Boolean}      [bold=false]
 * @property {String}       [align='center'] Horizontal alignment (@see exceljs)
 */

type BorderPosition = 'top' | 'bottom' | 'left' | 'right';

const LAST_FROZEN_ROW = 7;

/**
 * Colors used for fonts and backgrounds
 *
 * @enum {Color}
 */
const COLORS = {
    BLACK: { argb: 'FF000000' },
    GREY: { argb: 'FFBDBDBD' },
    PALE_GREY: { argb: 'FF999999' },
    XPALE_GREY: { argb: 'FFF3F3F3' },
    WHITE: { argb: 'FFFFFFFF' },
    YELLOW: { argb: 'FFFFFF00' },
    LINK: { argb: 'FF0020F8' },
};

/**
 * Default font
 *
 * @const {String}
 */
const FONT_NAME = 'Arial';

export function writeTo(sheet: Worksheet, cellReference: string, content: CellContent | MultipartCellContent) {
    const cell = sheet.getCell(cellReference);

    if (Array.isArray(content)) {
        cell.value = {
            richText: content.map(({
                size, bold, italic, color, text,
            }) => ({
                font: {
                    size: size || FONT_SIZES.DEFAULT,
                    bold,
                    italic,
                    color: color || COLORS.BLACK,
                    name: FONT_NAME,
                },
                text,
            })),
        };
    } else {
        if (content.formula) {
            cell.value = {
                formula: content.formula,
                date1904: true,
            };
        } else if (content.link) {
            cell.value = {
                text: content.text.toString(),
                hyperlink: content.link,
            };
        } else {
            cell.value = content.text;
        }

        cell.font = {
            size: content.size || FONT_SIZES.DEFAULT,
            bold: content.bold,
            italic: content.italic,
            color: content.color || COLORS.BLACK,
            name: FONT_NAME,
        };

        if (content.link) {
            cell.font.color = COLORS.LINK;
            cell.font.underline = true;
        }
    }
}

/**
 * Fills a specific cell with a background color
 *
 * @param {Sheet}  sheet
 * @param {String} cellReference
 * @param {Color}  color
 */
export function fill(sheet: Worksheet, cellReference: string, color: Partial<Color>) {
    const cell = sheet.getCell(cellReference);
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: color,
    };
}

/**
 * Draws borders around a specific cell
 *
 * @param {Sheet}                  sheet
 * @param {String}                 cellReference
 * @param {Array.<BorderPosition>} positions
 * @param {String}                 [thickness='thick'] Épaisseur de la bordure: 'thin', 'medium', 'thick'
 */
function setBorder(sheet: Worksheet, cellReference: string, positions: BorderPosition[], thickness: 'thin' | 'medium' | 'thick' = 'thick') {
    const cell = sheet.getCell(cellReference);

    // Préserver les bordures existantes au lieu de les écraser
    if (!cell.border) {
        cell.border = {};
    }

    positions.forEach((position) => {
        cell.border[position] = {
            style: thickness,
            color: COLORS.BLACK,
        };
    });
}

export function align(sheet: Worksheet, cellReference: string, alignment: Partial<Excel.Alignment>): void {
    const cell = sheet.getCell(cellReference);
    cell.alignment = alignment;
}

export function column(i: number): string {
    if (i <= 26) {
        return String.fromCharCode(((i - 1) % 26) + 65);
    }

    return column(Math.floor((i - 1) / 26)) + String.fromCharCode(((i % 26 === 0 ? 26 : i % 26) - 1) + 65);
}

/**
 * Draws the header to the given workbook/sheet
 *
 * @param {Workbook} workbook
 * @param {Sheet}    sheet
 * @param {Number}   lastFrozenColumn Index of the last frozen column (starting from 1)
 * @param {String}   locationName
 * @param {String}   title
 * @param {String}   dateOfExport
 * @param {Object}   updatedSitesStats Statistiques des sites mis à jour dans les 6 derniers mois
 */
function writeHeader(workbook, sheet, lastFrozenColumn, locationName, title, dateOfExport, updatedSitesStats) {
    // first row
    writeTo(sheet, 'A1', [
        { bold: true, color: COLORS.BLACK, text: 'SITUATION DES BIDONVILLES' },
        { bold: true, color: COLORS.BLACK, text: ` ${title.toUpperCase()}` },
    ]);

    for (let i = 1; i <= lastFrozenColumn; i += 1) {
        fill(sheet, `${column(i)}1`, COLORS.BLACK);
    }

    // other rows
    writeTo(sheet, 'A2', {
        bold: true,
        size: FONT_SIZES.BIG,
        text: locationName,
    });

    writeTo(sheet, 'A3', {
        bold: true,
        text: 'Extraction de la plateforme Résorption bidonvilles',
    });

    writeTo(sheet, 'A4', {
        bold: true,
        text: `à la date du ${dateOfExport}`,
    });

    if (updatedSitesStats) {
        writeTo(sheet, 'A5', {
            bold: true,
            text: `${updatedSitesStats.updatedCount} site${updatedSitesStats.updatedCount > 1 ? 's' : ''} sur ${updatedSitesStats.totalCount} mis à jour dans les 6 derniers mois (${updatedSitesStats.percentage}%)`,
        });
    }
}

/**
 * Writes the data of a single cell
 *
 * @param {Sheet}                  sheet
 * @param {String}                 cellReference
 * @param {String|Number}          data
 * @param {String|null}            link
 * @param {Property}               style
 * @param {Array.<BorderPosition>} [borders]
 * @param {Boolean}                [shouldFill]   Wether the cell should be filled with a bgColor or not
 */
function writeData(sheet, cellReference, data, link, style, borders = [], shouldFill = false) {
    align(sheet, cellReference, {
        vertical: 'middle',
        horizontal: style.align ?? 'center',
        wrapText: style.wrapText ?? false,
    });

    let text = data;
    let color = COLORS.BLACK;
    let italic = false;

    if (data === null || data === '') {
        text = 'NC';
        color = COLORS.PALE_GREY;
        italic = true;
    }

    writeTo(sheet, cellReference, {
        bold: style.bold === true,
        italic,
        text,
        color,
        link,
    });

    if (borders.length > 0) {
        setBorder(sheet, cellReference, borders);
    }

    if (shouldFill === true) {
        fill(sheet, cellReference, COLORS.XPALE_GREY);
    }
}

/**
 * Writes the whole column for the given property
 *
 * @param {Sheet}              sheet
 * @param {Property}           property
 * @param {Number}             columnIndex Starting from 1
 * @param {Boolean}            drawBorder
 * @param {Array.<Shantytown>} shantytowns
 * @param {Boolean}            isFirstInSection
 * @param {Boolean}            isLastInSection
 */
function writeProperty(sheet, property, columnIndex, drawBorder, shantytowns, isFirstInSection = false, isLastInSection = false) {
    const {
        title, width, data, link,
    } = property;
    const rowIndex = 7;
    const colRef = column(columnIndex);
    const cellRef = `${colRef}${rowIndex}`;

    // set column size
    const col = sheet.getColumn(columnIndex);
    col.width = width;

    const row = sheet.getRow(rowIndex);
    row.height = 70;

    // write the header
    writeTo(sheet, cellRef, { bold: true, text: title });
    fill(sheet, cellRef, COLORS.GREY);
    align(sheet, cellRef, {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
    });

    // Bordures de section (épaisses)
    const headerThickBorders: BorderPosition[] = [];
    if (isFirstInSection) {
        headerThickBorders.push('left');
    }
    if (isLastInSection || drawBorder === true) {
        headerThickBorders.push('right');
    }
    if (headerThickBorders.length > 0) {
        setBorder(sheet, cellRef, headerThickBorders, 'thick');
    }

    // Bordures fines entre les colonnes (sauf dernière de section)
    const headerThinBorders: BorderPosition[] = [];
    if (!isLastInSection && drawBorder !== true) {
        headerThinBorders.push('right');
    }
    if (headerThinBorders.length > 0) {
        setBorder(sheet, cellRef, headerThinBorders, 'thin');
    }

    // write the content for each shantytown
    shantytowns.forEach((shantytown, shantytownIndex) => {
        const dataCellRef = `${colRef}${rowIndex + shantytownIndex + 1}`;

        writeData(
            sheet,
            dataCellRef,
            data(shantytown),
            link ? link(shantytown) : null,
            property,
            [],
            shantytownIndex % 2 !== 0,
        );

        // Ajouter les bordures de section et de ligne
        // Bordures épaisses pour délimiter les sections (gauche/droite)
        const thickBorders: BorderPosition[] = [];
        if (isFirstInSection) {
            thickBorders.push('left');
        }
        if (isLastInSection || drawBorder === true) {
            thickBorders.push('right');
        }

        // Bordures fines pour séparer les colonnes et lignes
        const thinBorders: BorderPosition[] = ['bottom'];

        // Ajouter une bordure fine à droite pour toutes les colonnes sauf la dernière de la section
        // (car la dernière a déjà une bordure épaisse)
        if (!isLastInSection && drawBorder !== true) {
            thinBorders.push('right');
        }

        // Appliquer les bordures épaisses si nécessaire
        if (thickBorders.length > 0) {
            setBorder(sheet, dataCellRef, thickBorders, 'thick');
        }

        // Appliquer les bordures fines
        setBorder(sheet, dataCellRef, thinBorders, 'thin');
    });

    // write a sum, if requested
    if (property.sum === true) {
        const sumRef = `${colRef}${rowIndex + shantytowns.length + 1}`;
        writeTo(sheet, sumRef, {
            bold: property.bold,
            formula: `SUM(${colRef}${rowIndex + 1}:${colRef}${rowIndex + shantytowns.length})`,
        });
        align(sheet, sumRef, {
            horizontal: 'center',
        });
    }
}

/**
 * Writes the title of a whole section (merging cells)
 *
 * @param {Sheet}                  sheet
 * @param {Number}                 rowIndex      Starting from 1
 * @param {Number}                 colIndex      Starting from 1
 * @param {Number}                 sectionLength Number of cells composing the section
 * @param {'section'|'subsection'} sectionType
 * @param {String}                 title         Title
 */
function writeSectionTitle(sheet, rowIndex, colIndex, sectionLength, sectionType, title) {
    const firstCellRef = `${column(colIndex)}${rowIndex}`;

    if (sectionLength > 1) {
        const lastCellRef = `${column(colIndex + sectionLength - 1)}${rowIndex}`;
        sheet.mergeCells(`${firstCellRef}:${lastCellRef}`);
    }

    if (title !== null) {
        writeTo(sheet, firstCellRef, {
            bold: true,
            color: COLORS.WHITE,
            size: sectionType === 'section' ? FONT_SIZES.BIG : FONT_SIZES.DEFAULT,
            text: title.toUpperCase(),
        });
        align(sheet, firstCellRef, {
            vertical: 'middle',
            wrapText: true,
        });
        fill(sheet, firstCellRef, COLORS.BLACK);

        // Ajouter des bordures épaisses à gauche et à droite de la section
        setBorder(sheet, firstCellRef, ['left', 'right'], 'thick');
    }
}

/**
 * Writes the whole columns for each property of the given section
 *
 * @param {Sheet}                  sheet
 * @param {Number}                 lastFrozenColumn Index of the last frozen column (starting from 1)
 * @param {Section}                section
 * @param {Number}                 columnIndex      Starting from 1
 * @param {Array.<Shantytown>}     shantytowns
 * @param {'section'|'subsection'} sectionType
 */
function writeSection(sheet, lastFrozenColumn, { title, properties }, columnIndex, shantytowns, sectionType) {
    // write the header
    writeSectionTitle(sheet, 6, columnIndex, properties.length, sectionType, title);

    // write each property of this section
    properties.forEach((property, propertyIndex) => {
        const isFirstInSection = propertyIndex === 0;
        const isLastInSection = propertyIndex === properties.length - 1;
        writeProperty(
            sheet,
            property,
            columnIndex + propertyIndex,
            columnIndex + propertyIndex > lastFrozenColumn && isLastInSection,
            shantytowns,
            isFirstInSection,
            isLastInSection,
        );
    });
}

export default {
    /**
     * Generates an excel document for the given shantytowns and configuration
     *
     * @param {String}             title        Sheet's title
     * @param {String}             locationName Name of the geographic location
     * @param {Array.<Section>}    sections
     * @param {Array.<Shantytown>} shantytowns
     * @param {String}             dateOfExport Date d'export au format DD/MM/YYYY
     * @param {Object}             updatedSitesStats Statistiques des sites mis à jour dans les 6 derniers mois
     *
     * @returns {Promise} The promise responds with a Buffer
     */
    createExport(title, locationName, sections, shantytowns, dateOfExport, updatedSitesStats) {
        // create a whole workbook
        const workbook = new Excel.Workbook();

        // On vérifie si l'une des section doit être figée
        const lastFrozenIndex = sections.findIndex(section => section.lastFrozen === true);
        // Si on a pas trouvé de section à figer, on renvoie null sinon calcule la colonne à figer
        const lastFrozenColumn = lastFrozenIndex === -1
            ? null
            : sections
                .slice(0, lastFrozenIndex + 1)
                .reduce((total, section) => total + section.properties.length, 0);

        // create first sheet
        const sheet = workbook.addWorksheet(
            `Sites ${title}`,
            {
                views: [{
                    state: 'frozen',
                    xSplit: lastFrozenColumn ?? 0,
                    ySplit: LAST_FROZEN_ROW,
                }],
            },
        );

        // create the header
        writeHeader(workbook, sheet, lastFrozenColumn, locationName, title, dateOfExport, updatedSitesStats);

        // write each section
        const lastColumnIndex = sections.reduce((colIndex, section) => {
            if (section.subsections) {
                const sectionLength = section.subsections.reduce((total, subSection) => {
                    writeSection(sheet, lastFrozenColumn, subSection, colIndex + total, shantytowns, 'subsection');
                    return total + subSection.properties.length;
                }, 0);

                writeSectionTitle(sheet, 5, colIndex, sectionLength, 'section', section.title);

                return colIndex + sectionLength;
            }

            writeSection(sheet, lastFrozenColumn, section, colIndex, shantytowns, 'section');
            return colIndex + section.properties.length;
        }, 1);

        // setup auto-filter
        sheet.autoFilter = {
            from: 'A7',
            to: {
                row: 7 + shantytowns.length,
                column: lastColumnIndex - 1,
            },
        };

        // 2e sheet pour les taux de MAJ de site par département s'il y a plus d'un département représenté
        let sheet2: Worksheet;
        const departementsDistincts = new Set(shantytowns.map(town => town.departement?.code)).size;

        if (departementsDistincts > 1) {
            sheet2 = workbook.addWorksheet(
                'Taux de MAJ par département',
                {
                    views: [{
                        state: 'frozen',
                        ySplit: 5,
                    }],
                },
            );

            const analyzeUpdatesByDepartement = () => {
                // 1. Définir le seuil de 6 mois en secondes
                // (6 mois * 30 jours * 24h * 3600s)
                const SIX_MONTHS_IN_SECONDS = 6 * 30 * 24 * 3600;
                const now = Math.floor(Date.now() / 1000);
                const limit = now - SIX_MONTHS_IN_SECONDS;

                // 2. Grouper par département
                const stats: Record<string, { name: string; total: number; updated: number }> = shantytowns.reduce((acc, town) => {
                    const depCode = town.departement?.code || 'Inconnu';
                    const depName = town.departement?.name || 'Inconnu';

                    if (!acc[depCode]) {
                        acc[depCode] = { name: depName, total: 0, updated: 0 };
                    }

                    acc[depCode].total += 1;

                    // Vérification de la date (supérieure à la limite d'il y a 6 mois)
                    if (town.updatedAt > limit) {
                        acc[depCode].updated += 1;
                    }

                    return acc;
                }, {});


                // 3. Calculer le taux final
                return Object.entries(stats).map(([code, data]) => (
                    {
                        departementCode: code,
                        departementName: data.name,
                        total: data.total,
                        updatedCount: data.updated,
                        updateRate: `${((data.updated / data.total) * 100).toFixed(2)}`,
                    }));
            };

            const results = analyzeUpdatesByDepartement();
            writeHeader(workbook, sheet2, lastFrozenColumn, `${shantytowns.length} sites sur ${departementsDistincts} départements`, ' - Taux de mise à jour par département', dateOfExport, null);
            const headerRow = sheet2.getRow(5);
            headerRow.values = [
                'Département',
                'Nombre de sites',
                'Mis à jour < 6 mois',
                'Taux de MAJ (%)',
            ];
            headerRow.font = {
                color: { argb: 'FFFFFFFF' },
                bold: true,
                size: 12,
            };
            headerRow.height = 25;
            headerRow.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true,
            };
            headerRow.eachCell((cell, colNumber) => {
                const targetCell = headerRow.getCell(colNumber);
                targetCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '434343' },
                };
            });

            // On écrit les données et on applique la colorisation conditionnelle sur le taux de MAJ
            results.forEach((item, index) => {
                const rowIndex = 6 + index;
                const row = sheet2.getRow(rowIndex);

                row.values = [
                    `${item.departementCode} - ${item.departementName}`,
                    item.total,
                    item.updatedCount,
                    Number.parseFloat(item.updateRate),
                ];

                const rateValue = Number.parseFloat(item.updateRate);
                const rateCell = row.getCell(4); // 4ème colonne pour le taux de MAJ

                // Logique de colorisation
                if (rateValue < 30) {
                    // ROUGE : Fond clair, texte foncé
                    rateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } }; // Fond rouge clair
                    rateCell.font = { color: { argb: 'FF9C0006' }, bold: true }; // Texte rouge foncé
                } else if (rateValue >= 60) {
                    // VERT : Fond vert clair, texte vert foncé
                    rateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } };
                    rateCell.font = { color: { argb: 'FF006100' }, bold: true };
                } else {
                    // ORANGE : Fond orange clair, texte noir
                    rateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
                    rateCell.font = { color: { argb: 'FF000000' }, bold: true };
                }
            });
            // Largeur des colonnes
            sheet2.columns.forEach((_col, index) => {
                let maxLength = 0;
                const column2 = sheet2.getColumn(index + 1);
                // On parcourt chaque cellule de la colonne
                column2.eachCell({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 0;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });

                // On applique la largeur avec une petite marge de sécurité
                column2.width = maxLength < 10 ? 10 : maxLength + 2;
            });
            // Activation du filtrage sur le tableau
            sheet2.autoFilter = {
                from: 'A5',
                to: {
                    row: 5 + results.length,
                    column: 4,
                },
            };
        }

        // respond
        return workbook.xlsx.writeBuffer();
    },
};
