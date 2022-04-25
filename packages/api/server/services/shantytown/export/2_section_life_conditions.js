const {
    SectionType, Table, Paragraph, TextRun,
} = require('docx');
const accessToWater = require('./2_section_life_conditions/accessToWater');
const trashEvacuation = require('./2_section_life_conditions/trashEvacuation');
const accessToElectricity = require('./2_section_life_conditions/accessToElectricity');
const accessToSanitary = require('./2_section_life_conditions/accessToSanitary');
const vermin = require('./2_section_life_conditions/vermin');
const heading = require('./heading');
const firePrevention = require('./2_section_life_conditions/firePrevention');

module.exports = shantytown => ({
    properties: {
        type: SectionType.NEXT_PAGE,
    },
    children: [
        heading('Description du site, des besoins et problématiques repérées'),
        new Paragraph({
            spacing: {
                before: 300,
                after: 100,
            },
            children: [
                new TextRun({
                    text: 'Aspects techniques',
                    bold: true,
                    size: 22,
                    font: 'Arial',
                }),
            ],
        }),
        new Table({
            columnWidths: [2410, 7228], // total page width is 9638 DXA for A4 portrait
            rows: [
                accessToWater(shantytown),
                accessToElectricity(shantytown),
                trashEvacuation(shantytown),
                accessToSanitary(shantytown),
                vermin(shantytown),
                firePrevention(shantytown),
            ],
        }),
    ],
});
