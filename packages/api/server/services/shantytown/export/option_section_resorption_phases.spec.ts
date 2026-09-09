import { expect } from 'chai';
import buildResorptionPhasesSection from './option_section_resorption_phases';

// `docx` construit un arbre XML interne (chaque noeud a un `root` array/objet, ex: rootKey 'w:t' porte le texte)
// plutôt que d'exposer une API publique de type `children`. On descend récursivement dans `.root`
// pour collecter toutes les chaînes de texte, quelle que soit la profondeur exacte de l'arbre.
const extractText = (section: any): string => {
    const strings: string[] = [];
    const walk = (node: unknown): void => {
        if (typeof node === 'string') {
            strings.push(node);
            return;
        }
        if (Array.isArray(node)) {
            node.forEach(walk);
            return;
        }
        if (node && typeof node === 'object' && 'root' in node) {
            walk((node as { root: unknown }).root);
        }
    };
    walk(section.children);
    return strings.join(' ');
};

describe('services/shantytown/export/option_section_resorption_phases', () => {
    describe('buildResorptionPhasesSection()', () => {
        it('ne contient jamais de NaN dans les dates formatées (test de non-régression)', () => {
            const shantytown = {
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'sociological_diagnosis',
                        preparatoryPhaseName: 'Diagnostic sociologique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-01-15T00:00:00.000Z',
                        createdAt: new Date('2023-12-01T00:00:00.000Z'),
                    },
                    {
                        preparatoryPhaseId: 'technical_diagnosis',
                        preparatoryPhaseName: 'Diagnostic technique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-02-20T00:00:00.000Z',
                        createdAt: new Date('2023-12-02T00:00:00.000Z'),
                    },
                    {
                        preparatoryPhaseId: 'social_assessment',
                        preparatoryPhaseName: 'Évaluation sociale',
                        preparatoryPhaseDateLabel: 'Réalisée le',
                        completedAt: null,
                        createdAt: new Date('2024-01-10T00:00:00.000Z'),
                    },
                ],
            };

            const section = buildResorptionPhasesSection(shantytown);

            // Extraire tout le texte des paragraphes pour vérifier
            const allText = extractText(section);

            // Vérifier qu'aucun texte ne contient "NaN"
            expect(allText).to.not.include('NaN');

            // Vérifier que les dates sont formatées correctement (JJ/MM/AAAA)
            expect(allText).to.include('15/01/2024');
            expect(allText).to.include('20/02/2024');

            // Vérifier qu'une phase non complétée affiche "en cours"
            expect(allText).to.include('Évaluation sociale : en cours');
        });

        it('formate correctement les phases complétées avec des dates ISO 8601', () => {
            const shantytown = {
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'political_validation',
                        preparatoryPhaseName: 'Validation politique',
                        preparatoryPhaseDateLabel: 'Validée le',
                        completedAt: '2023-06-08T12:30:00.000Z',
                        createdAt: new Date('2023-05-01T00:00:00.000Z'),
                    },
                ],
            };

            const section = buildResorptionPhasesSection(shantytown);

            const allText = extractText(section);

            expect(allText).to.include('Validation politique : validée le 08/06/2023');
            expect(allText).to.not.include('NaN');
        });

        it('affiche un message si aucune phase n\'est définie', () => {
            const shantytown = {
                preparatoryPhasesTowardResorption: [],
            };

            const section = buildResorptionPhasesSection(shantytown);

            const allText = extractText(section);

            expect(allText).to.include('Aucune phase de résorption déclarée');
        });

        it('formate correctement les phases avec le préfixe "    -    " et les labels en minuscules', () => {
            const shantytown = {
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'preparation_conventionnement',
                        preparatoryPhaseName: 'Préparation conventionnement',
                        preparatoryPhaseDateLabel: 'RÉALISÉE LE',
                        completedAt: '2024-03-15T00:00:00.000Z',
                        createdAt: new Date('2024-02-01T00:00:00.000Z'),
                    },
                ],
            };

            const section = buildResorptionPhasesSection(shantytown);

            const allText = extractText(section);

            // Le label doit être converti en minuscules et préfixé par "    -    "
            expect(allText).to.include('    -    Préparation conventionnement : réalisée le 15/03/2024');
        });

        it('sépare correctement les phases initiales des autres phases', () => {
            const shantytown = {
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'sociological_diagnosis',
                        preparatoryPhaseName: 'Diagnostic sociologique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-01-15T00:00:00.000Z',
                        createdAt: new Date('2023-12-01T00:00:00.000Z'),
                    },
                    {
                        preparatoryPhaseId: 'contractualisation_familles',
                        preparatoryPhaseName: 'Contractualisation des familles',
                        preparatoryPhaseDateLabel: 'Réalisée le',
                        completedAt: '2024-05-01T00:00:00.000Z',
                        createdAt: new Date('2024-04-01T00:00:00.000Z'),
                    },
                ],
            };

            const section = buildResorptionPhasesSection(shantytown);

            const allText = extractText(section);

            // Vérifier que les deux sections de titre sont présentes
            expect(allText).to.include('Phases initiales');
            expect(allText).to.include('Autres phases');
        });

        it('trie les phases complétées par date décroissante (test de non-régression)', () => {
            const shantytown = {
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'sociological_diagnosis',
                        preparatoryPhaseName: 'Diagnostic sociologique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-01-15T00:00:00.000Z',
                        createdAt: new Date('2023-12-01T00:00:00.000Z'),
                    },
                    {
                        preparatoryPhaseId: 'technical_diagnosis',
                        preparatoryPhaseName: 'Diagnostic technique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-05-10T00:00:00.000Z',
                        createdAt: new Date('2023-12-02T00:00:00.000Z'),
                    },
                    {
                        preparatoryPhaseId: 'social_assessment',
                        preparatoryPhaseName: 'Évaluation sociale',
                        preparatoryPhaseDateLabel: 'Réalisée le',
                        completedAt: '2024-03-01T00:00:00.000Z',
                        createdAt: new Date('2024-01-10T00:00:00.000Z'),
                    },
                ],
            };

            const section = buildResorptionPhasesSection(shantytown);
            const allText = extractText(section);

            const technicalIndex = allText.indexOf('Diagnostic technique');
            const socialIndex = allText.indexOf('Évaluation sociale');
            const sociologicalIndex = allText.indexOf('Diagnostic sociologique');

            expect(technicalIndex).to.be.lessThan(socialIndex);
            expect(socialIndex).to.be.lessThan(sociologicalIndex);
        });
    });
});
