const {
    Paragraph, TextRun, SectionType,
} = require('docx');

const moment = require('moment');
const heading = require('./heading');

module.exports = (shantytown) => {
    const comments = [...shantytown.comments.regular, ...shantytown.comments.covid].sort((a, b) => (moment(a.createdAt).isBefore(b.createdAt) ? 1 : -1));

    return {
        properties: {
            type: SectionType.CONTINUOUS,
        },
        children: [
            heading(`Le journal du site - ${comments.length} message${comments.length > 1 ? 's' : ''}`),

            ...(comments.length > 0
                ? comments.map(comment => new Paragraph({
                    spacing: {
                        before: 100,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: `${moment(comment.createdAt * 1000).utcOffset(2).locale('fr').format('DD MMMM YYYY')} à ${moment(comment.createdAt * 1000).utcOffset(2).locale('fr').format('HH:mm')}`,
                            break: 1,
                            bold: false,
                            size: 22,
                            font: 'Arial',
                        }),
                        new TextRun({
                            text: `${comment.createdBy.first_name} ${comment.createdBy.last_name} - ${comment.createdBy.organization}`,
                            bold: true,
                            break: 1,
                            size: 22,
                            font: 'Arial',
                        }),
                        new TextRun({
                            text: `«${comment.description}»`,
                            break: 1,
                            bold: false,
                            size: 22,
                            font: 'Arial',
                        })],
                }))
                : [new Paragraph({
                    spacing: {
                        before: 300,
                        after: 100,
                    },
                    children: [
                        new TextRun({
                            text: 'Aucun message n\'a été publié dans le journal du site',
                            break: 1,
                            color: '605F5F',
                            size: 22,
                            font: 'Arial',
                        }),
                    ],
                })]
            ),
        ],
    };
};
