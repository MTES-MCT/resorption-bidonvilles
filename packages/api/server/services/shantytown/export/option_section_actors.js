const {
    Paragraph, TextRun, SectionType,
} = require('docx');

const themes = require('#server/config/shantytown_actor_themes');
const heading = require('./heading');


module.exports = shantytown => ({
    properties: {
        type: SectionType.CONTINUOUS,
    },
    children: [
        heading('Intervenants'),
        new Paragraph({
            spacing: {
                before: 300,
                after: 100,
            },
            children: shantytown.actors.length > 0
                ? [
                    ...shantytown.actors.reduce((acc, actor) => [
                        ...acc,
                        new TextRun({
                            text: `    -    ${actor.first_name} ${actor.last_name}, `,
                            break: 1,
                            bold: true,
                            size: 22,
                            font: 'Arial',
                        }),
                        new TextRun({
                            text: `${actor.organization.name}`,
                            bold: false,
                            size: 22,
                            font: 'Arial',
                        }),
                        new TextRun({
                            text: `         ${actor.themes.map(theme => `«${theme.value || themes[theme.id]}»`).join(' , ')}`,
                            bold: false,
                            break: 1,
                            size: 22,
                            font: 'Arial',
                        }),
                    ], []),
                ]
                : [
                    new TextRun({
                        text: 'Aucun intervenant déclaré',
                        break: 1,
                        color: '605F5F',
                        size: 22,
                        font: 'Arial',
                    }),
                ],
        }),
        shantytown.actors.length > 0
            ? new Paragraph({
                spacing: {
                    before: 300,
                    after: 100,
                },
                children: [
                    new TextRun({
                        text: 'Pour consulter les coordonnées des intervenants, rendez-vous sur l\'annuaire de la plateforme ',
                        bold: false,
                        size: 22,
                        font: 'Arial',
                    }),
                    new TextRun({
                        text: 'Résorption-bidonvilles',
                        bold: false,
                        italics: true,
                        size: 22,
                        font: 'Arial',
                    }),
                ],
            })
            : undefined,
    ],
});
