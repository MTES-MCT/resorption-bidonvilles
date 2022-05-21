const {
    Paragraph, TextRun, SectionType,
} = require('docx');

const heading = require('./heading');

module.exports = shantytown => ({
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
            children: [
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
            ],
        }),
    ],
});
