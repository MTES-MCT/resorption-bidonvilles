const {
    Paragraph, TextRun, SectionType,
} = require('docx');

const moment = require('moment');
const heading = require('./heading');

module.exports = shantytown => ({
    properties: {
        type: SectionType.CONTINUOUS,
    },
    children: [
        heading(`Le journal du site - ${shantytown.comments.regular.length} message${shantytown.comments.regular.length > 1 ? 's' : ''}`),
        ...shantytown.comments.regular.map(comment => new Paragraph({
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
        })),
    ],
});
