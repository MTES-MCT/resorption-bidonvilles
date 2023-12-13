import {
    Paragraph, TextRun, SectionType,
} from 'docx';
import { ShantytownAction } from '#root/types/resources/Action.d';

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
            children: shantytown.actions.length > 0
                ? [
                    ...shantytown.actions.reduce(
                        (acc, action: ShantytownAction) => [
                            ...acc,
                            new TextRun({
                                text: `    -    Action «${action.name}»`,
                                bold: true,
                                break: 1,
                                size: 22,
                                font: 'Arial',
                            }),
                            new TextRun({
                                text: `         Menée par ${action.operators.map(({ name, abbreviation }) => abbreviation || name).join(', ')}`,
                                bold: false,
                                break: 1,
                                size: 22,
                                font: 'Arial',
                            }),
                            new TextRun({
                                text: `         ${action.topics.map(({ name }) => name).join(', ')}`,
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
