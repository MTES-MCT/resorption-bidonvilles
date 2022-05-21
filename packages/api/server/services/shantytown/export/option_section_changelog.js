const {
    Table, SectionType,
} = require('docx');
const formatDate = require('../_common/formatDate');
const heading = require('./heading');
const createRow = require('./create_row');

module.exports = shantytown => ({
    properties: {
        type: SectionType.CONTINUOUS,
    },
    children: [
        heading('Historique des modifications'),

        new Table({
            columnWidths: [1927, 1927, 1927, 1927, 1927], // total page width is 9638 DXA for A4 portrait
            rows: [
                createRow(['Date', 'Auteur', 'Champ modifié', 'Ancienne valeur', 'Nouvelle valeur']),
                ...shantytown.changelog.reduce(
                    (acc, changelog) => [
                        ...acc,
                        ...changelog.diff.reduce(
                            (acc2, diff) => [...acc2, createRow([formatDate(changelog.date, 'DD/MM/YYYY'), `${changelog.author.first_name} ${changelog.author.last_name}`, diff.field, diff.oldValue, diff.newValue])],
                            [],
                        ),
                    ],
                    [],
                ),
            ],
        }),
    ],
});
