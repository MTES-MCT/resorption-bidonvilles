import {
    Paragraph, TextRun, SectionType,
} from 'docx';

import moment from 'moment';
import heading from './heading';

export default (shantytown) => {
    const comments = [...shantytown.comments].sort((a, b) => (moment(a.createdAt).isBefore(b.createdAt) ? 1 : -1));

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
                            text: `${moment(comment.createdAt * 1000).locale('fr').format('DD MMMM YYYY [à] HH:mm')}`,
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
                        }),
                        ...(comment.tags.length > 0
                            ? comment.tags.map(tag => new TextRun({
                                text: `    -    ${tag.label}`,
                                break: 1,
                                bold: false,
                                size: 22,
                                font: 'Arial',
                            }))
                            : []
                        ),
                    ],
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
