import {
    Paragraph, TextRun, SectionType,
} from 'docx';

import STARTING_PHASE_UIDS from '#server/config/preparatory_phases_toward_resorption';
import heading from './heading';
import formatPreparatoryPhase from '../_common/formatPreparatoryPhase';
import sortPreparatoryPhases from '../_common/sortPreparatoryPhases';

const buildResorptionPhasesSection = shantytown => ({
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

            const startingPhases = phases.filter(phase => STARTING_PHASE_UIDS.has(phase.preparatoryPhaseId));
            const otherPhases = phases.filter(phase => !STARTING_PHASE_UIDS.has(phase.preparatoryPhaseId));

            const sortedStartingPhases = sortPreparatoryPhases(startingPhases);
            const sortedOtherPhases = sortPreparatoryPhases(otherPhases);

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

                phaseList.forEach((phase) => {
                    paragraphDescriptors.push({
                        text: `    -    ${formatPreparatoryPhase(phase)}`,
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

export default buildResorptionPhasesSection;
