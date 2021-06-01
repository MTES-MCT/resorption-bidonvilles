const fs = require('fs');
const path = require('path');
const Excel = require('exceljs/modern.nodejs');
const { assetsSrc } = require('#server/config');
const { toFormat: dateToString } = require('#server/utils/date');

/**
 * @typedef {Object} CellContent
 * @property {String|Number} [text]         Either text or formula must be provided
 * @property {String}        [formula]      Either text or formula must be provided
 * @property {Number}        [size=DEFAULT] Font size
 * @property {Number}        [bold=false]
 * @property {Number}        [italic=false]
 * @property {Number}        [color=BLACK]
 */

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

/**
 * @enum {'top'|'bottom'|'left'|'right'} BorderPosition
 */

/**
 * Index of the last frozen row
 *
 * Index starts from 1
 *
 * @const {Number}
 */
const LAST_FROZEN_ROW = 7;

/**
 * Font sizes
 *
 * @enum {Number}
 */
const SIZES = {
    DEFAULT: 10,
    BIG: 14,
};

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
};

/**
 * Default font
 *
 * @const {String}
 */
const FONT_NAME = 'Arial';

/**
 * Writes the given content to a cell
 *
 * @param {Sheet}                           sheet
 * @param {String}                          cellReference
 * @param {Array.<CellContent>|CellContent} content
 */
function writeTo(sheet, cellReference, content) {
    const cell = sheet.getCell(cellReference);

    if (Array.isArray(content)) {
        cell.value = {
            richText: content.map(({
                size, bold, italic, color, text,
            }) => ({
                font: {
                    size: size || SIZES.DEFAULT,
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
            };
        } else {
            cell.value = content.text;
        }

        cell.font = {
            size: content.size || SIZES.DEFAULT,
            bold: content.bold,
            italic: content.italic,
            color: content.color || COLORS.BLACK,
            name: FONT_NAME,
        };
    }
}

/**
 * Fills a specific cell with a background color
 *
 * @param {Sheet}  sheet
 * @param {String} cellReference
 * @param {Color}  color
 */
function fill(sheet, cellReference, color) {
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
 */
function setBorder(sheet, cellReference, positions) {
    const cell = sheet.getCell(cellReference);
    cell.border = {};

    positions.forEach((position) => {
        cell.border[position] = {
            style: 'thick',
            color: COLORS.BLACK,
        };
    });
}

/**
 * Sets the alignment configuration of a specific cell
 *
 * @param {Sheet}     sheet
 * @param {String}    cellReference
 * @param {Alignment} alignment     Please @see exceljs for details
 */
function align(sheet, cellReference, alignment) {
    const cell = sheet.getCell(cellReference);
    cell.alignment = alignment;
}

/**
 * Converts a numeric column index to an alphabetical index
 *
 * @param {Number} i The column index, starting from 1
 *
 * @returns {String}
 */
function column(i) {
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
 */
function writeHeader(workbook, sheet, lastFrozenColumn, locationName, title) {
    // first row
    writeTo(sheet, 'A1', [
        { bold: true, color: COLORS.WHITE, text: 'SITUATION DES BIDONVILLES' },
        { bold: true, color: COLORS.YELLOW, text: ` ${title.toUpperCase()}` },
    ]);

    for (let i = 1; i <= lastFrozenColumn; i += 1) {
        fill(sheet, `${column(i)}1`, COLORS.BLACK);
    }

    // other rows
    writeTo(sheet, 'A2', {
        bold: true,
        size: SIZES.BIG,
        text: locationName,
    });

    writeTo(sheet, 'A3', {
        bold: true,
        text: 'Extraction de la plateforme Résorption bidonvilles',
    });

    writeTo(sheet, 'A4', {
        bold: true,
        text: `à la date du ${dateToString(new Date(), 'd/m/Y')}`,
    });

    // logo
    const logoColRef = column(lastFrozenColumn + 1);
    sheet.addImage(
        workbook.addImage({
            buffer: fs.readFileSync(path.join(assetsSrc, 'logo_rb.png')),
            extension: 'png',
        }),
        `${logoColRef}1:${logoColRef}4`,
    );
}

/**
 * Writes the data of a single cell
 *
 * @param {Sheet}                  sheet
 * @param {String}                 cellReference
 * @param {String|Number}          data
 * @param {Property}               style
 * @param {Array.<BorderPosition>} [borders]
 * @param {Boolean}                [shouldFill]   Wether the cell should be filled with a bgColor or not
 */
function writeData(sheet, cellReference, data, style, borders = [], shouldFill = false) {
    align(sheet, cellReference, {
        vertical: 'middle',
        horizontal: style.align || 'center',
        wrapText: true,
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
 */
function writeProperty(sheet, property, columnIndex, drawBorder, shantytowns) {
    const { title, width, data } = property;
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

    if (drawBorder === true) {
        setBorder(sheet, cellRef, ['right']);
    }

    // write the content for each shantytown
    shantytowns.forEach((shantytown, shantytownIndex) => {
        const borders = [];
        if (drawBorder === true) {
            borders.push('right');
        }

        if (shantytownIndex === shantytowns.length - 1) {
            borders.push('bottom');
        }

        writeData(
            sheet,
            `${colRef}${rowIndex + shantytownIndex + 1}`,
            data(shantytown),
            property,
            borders,
            shantytownIndex % 2 !== 0,
        );
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
            size: sectionType === 'section' ? SIZES.BIG : SIZES.DEFAULT,
            text: title.toUpperCase(),
        });
        align(sheet, firstCellRef, {
            vertical: 'middle',
            wrapText: true,
        });
        fill(sheet, firstCellRef, COLORS.BLACK);
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
        writeProperty(
            sheet,
            property,
            columnIndex + propertyIndex,
            columnIndex + propertyIndex > lastFrozenColumn && propertyIndex === properties.length - 1,
            shantytowns,
        );
    });
}

module.exports = {
    /**
     * Generates an excel document for the given shantytowns and configuration
     *
     * @param {String}             title        Sheet's title
     * @param {String}             locationName Name of the geographic location
     * @param {Array.<Section>}    sections
     * @param {Array.<Shantytown>} shantytowns
     *
     * @returns {Promise} The promise responds with a Buffer
     */
    createExport(title, locationName, sections, shantytowns) {
        // create a whole workbook
        const workbook = new Excel.Workbook();

        // calculate the index of the last frozen column
        let lastFrozenColumn = 0;
        for (let i = 0; i < sections.length; i += 1) {
            lastFrozenColumn += sections[i].properties.length;

            if (sections[i].lastFrozen === true) {
                break;
            }
        }

        // create a single sheet
        const sheet = workbook.addWorksheet(
            `Sites ${title}`,
            {
                views: [{
                    state: 'frozen',
                    xSplit: lastFrozenColumn,
                    ySplit: LAST_FROZEN_ROW,
                }],
            },
        );

        // create the header
        writeHeader(workbook, sheet, lastFrozenColumn, locationName, title);

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

        // respond
        return workbook.xlsx.writeBuffer();
    },
};
