import {
    Paragraph, TextRun, SectionType,
} from 'docx';

import heading from './heading';
import formatDate from '../_common/formatDate';

const STARTING_PHASE_UIDS = ['sociological_diagnosis', 'social_assessment', 'political_validation'];

export default shantytown => ({
    properties: {
        type: SectionType.CONTINUOUS,
    },
    children: [
        heading('Phases préparatoires à la résorption'),
        ...(() => {
            const phases = shantytown.preparatoryPhasesTowardResorption ?? [];
            if (phases.length === 0) {
                return [
                    new Paragraph({
                        spacing: {
                            before: 300,
                            after: 100,
                        },
                        children: [
                            new TextRun({
                                text: 'Aucune phase de résorption déclarée',
                                color: '605F5F',
                                size: 22,
                                font: 'Arial',
                            }),
                        ],
                    }),
                ];
            }

            const startingPhases = phases.filter(phase => STARTING_PHASE_UIDS.includes(phase.preparatoryPhaseId));
            const otherPhases = phases.filter(phase => !STARTING_PHASE_UIDS.includes(phase.preparatoryPhaseId));

            const sortPhases = phaseList => phaseList.sort((a, b) => {
                const aDate = a.completedAt || a.createdAt;
                const bDate = b.completedAt || b.createdAt;
                return bDate - aDate;
            });

            const sortedStartingPhases = sortPhases([...startingPhases]);
            const sortedOtherPhases = sortPhases([...otherPhases]);

            const paragraphDescriptors: {
                text: string,
                bold?: boolean,
                keepNext?: boolean,
                spacingBefore?: number,
            }[] = [];

            const pushTitleAndPhases = (title: string, phaseList) => {
                if (phaseList.length === 0) {
                    return;
                }

                paragraphDescriptors.push({
                    text: title,
                    bold: true,
                    keepNext: true,
                    spacingBefore: paragraphDescriptors.length === 0 ? 300 : 200,
                });

                phaseList.forEach(({ preparatoryPhaseName, preparatoryPhaseDateLabel, completedAt }) => {
                    const status = completedAt
                        ? `${preparatoryPhaseDateLabel.toLowerCase()} ${formatDate(completedAt, 'DD/MM/YYYY')}`
                        : 'en cours';

                    paragraphDescriptors.push({
                        text: `    -    ${preparatoryPhaseName} : ${status}`,
                    });
                });
            };

            pushTitleAndPhases('Phases initiales', sortedStartingPhases);
            pushTitleAndPhases('Autres phases', sortedOtherPhases);

            if (paragraphDescriptors.length === 0) {
                paragraphDescriptors.push({
                    text: 'Aucune phase de résorption déclarée',
                    spacingBefore: 300,
                });
            }

            return paragraphDescriptors.map(({
                text, bold = false, keepNext = false, spacingBefore,
            }, index) => new Paragraph({
                keepNext,
                spacing: {
                    before: spacingBefore ?? (index === 0 ? 300 : undefined),
                    after: index === paragraphDescriptors.length - 1 ? 100 : undefined,
                },
                children: [
                    new TextRun({
                        text,
                        size: 22,
                        font: 'Arial',
                        bold,
                    }),
                ],
            }));
        })(),
    ],
});
