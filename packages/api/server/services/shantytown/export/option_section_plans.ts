const {
    Paragraph, TextRun, SectionType,
} = require('docx');

import heading from './heading';

export default shantytown => ({
    properties: {
        type: SectionType.CONTINUOUS,
    },
    children: [
        heading('Actions'),
        new Paragraph({
            spacing: {
                before: 300,
                after: 100,
            },
            children: shantytown.plans.length > 0
                ? [
                    ...shantytown.plans.reduce(
                        (acc, plan) => [
                            ...acc,
                            new TextRun({
                                text: `    -    Action «${plan.name}»`,
                                bold: true,
                                break: 1,
                                size: 22,
                                font: 'Arial',
                            }),
                            new TextRun({
                                text: `         Menée par ${plan.operator.name}`,
                                bold: false,
                                break: 1,
                                size: 22,
                                font: 'Arial',
                            }),
                            new TextRun({
                                text: `         ${plan.topics.join(', ')}`,
                                bold: false,
                                break: 1,
                                size: 22,
                                font: 'Arial',
                            }),
                        ],
                        [],
                    ),
                ]
                : [
                    new TextRun({
                        text: 'Aucune action déclarée',
                        break: 1,
                        color: '605F5F',
                        size: 22,
                        font: 'Arial',
                    }),
                ],
        }),
    ],
});
