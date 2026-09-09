import { expect } from 'chai';
import serializeExportProperties from './serializeExportProperties';

describe('services/shantytown/_common/serializeExportProperties', () => {
    describe('preparatoryPhasesTowardResorption property', () => {
        let properties;

        beforeEach(() => {
            // Initialiser les propriétés d'export avec une liste de closingSolutions vide
            properties = serializeExportProperties([]);
        });

        it('ne contient jamais de NaN dans les dates formatées (test de non-régression)', () => {
            const shantytown = {
                departement: {
                    code: '44', // Loire-Atlantique - département de l'expérimentation
                },
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'sociological_diagnosis',
                        preparatoryPhaseName: 'Diagnostic sociologique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-01-15T00:00:00.000Z',
                        createdAt: '2023-12-01T00:00:00.000Z',
                    },
                    {
                        preparatoryPhaseId: 'technical_diagnosis',
                        preparatoryPhaseName: 'Diagnostic technique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-02-20T00:00:00.000Z',
                        createdAt: '2023-12-02T00:00:00.000Z',
                    },
                    {
                        preparatoryPhaseId: 'social_assessment',
                        preparatoryPhaseName: 'Évaluation sociale',
                        preparatoryPhaseDateLabel: 'Réalisée le',
                        completedAt: null,
                        createdAt: '2024-01-10T00:00:00.000Z',
                    },
                ],
            };

            const result = properties.preparatoryPhasesTowardResorption.data(shantytown);

            // Vérifier qu'aucune ligne ne contient "NaN"
            expect(result).to.not.include('NaN');

            // Vérifier que les dates sont formatées correctement (JJ/MM/AAAA)
            expect(result).to.include('15/01/2024');
            expect(result).to.include('20/02/2024');

            // Vérifier qu'une phase non complétée affiche "en cours"
            expect(result).to.include('Évaluation sociale : en cours');
        });

        it('formate correctement les phases complétées avec des dates ISO 8601', () => {
            const shantytown = {
                departement: {
                    code: '44',
                },
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'political_validation',
                        preparatoryPhaseName: 'Validation politique',
                        preparatoryPhaseDateLabel: 'Validée le',
                        completedAt: '2023-06-08T12:30:00.000Z',
                        createdAt: '2023-05-01T00:00:00.000Z',
                    },
                ],
            };

            const result = properties.preparatoryPhasesTowardResorption.data(shantytown);

            expect(result).to.include('Validation politique : validée le 08/06/2023');
            expect(result).to.not.include('NaN');
        });

        it('retourne null si le département n\'est pas dans l\'expérimentation', () => {
            const shantytown = {
                departement: {
                    code: '75', // Paris - pas dans l'expérimentation
                },
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'sociological_diagnosis',
                        preparatoryPhaseName: 'Diagnostic sociologique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-01-15T00:00:00.000Z',
                        createdAt: '2023-12-01T00:00:00.000Z',
                    },
                ],
            };

            const result = properties.preparatoryPhasesTowardResorption.data(shantytown);

            expect(result).to.be.null;
        });

        it('retourne null si aucune phase n\'est définie', () => {
            const shantytown = {
                departement: {
                    code: '44',
                },
                preparatoryPhasesTowardResorption: [],
            };

            const result = properties.preparatoryPhasesTowardResorption.data(shantytown);

            expect(result).to.be.null;
        });

        it('formate correctement les phases avec le préfixe "- " et les labels en minuscules', () => {
            const shantytown = {
                departement: {
                    code: '44',
                },
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'preparation_conventionnement',
                        preparatoryPhaseName: 'Préparation conventionnement',
                        preparatoryPhaseDateLabel: 'RÉALISÉE LE',
                        completedAt: '2024-03-15T00:00:00.000Z',
                        createdAt: '2024-02-01T00:00:00.000Z',
                    },
                ],
            };

            const result = properties.preparatoryPhasesTowardResorption.data(shantytown);

            // Le label doit être converti en minuscules
            expect(result).to.include('- Préparation conventionnement : réalisée le 15/03/2024');
        });

        it('trie les phases complétées par date décroissante (test de non-régression)', () => {
            const shantytown = {
                departement: {
                    code: '44',
                },
                preparatoryPhasesTowardResorption: [
                    {
                        preparatoryPhaseId: 'sociological_diagnosis',
                        preparatoryPhaseName: 'Diagnostic sociologique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-01-15T00:00:00.000Z',
                        createdAt: '2023-12-01T00:00:00.000Z',
                    },
                    {
                        preparatoryPhaseId: 'technical_diagnosis',
                        preparatoryPhaseName: 'Diagnostic technique',
                        preparatoryPhaseDateLabel: 'Réalisé le',
                        completedAt: '2024-05-10T00:00:00.000Z',
                        createdAt: '2023-12-02T00:00:00.000Z',
                    },
                    {
                        preparatoryPhaseId: 'social_assessment',
                        preparatoryPhaseName: 'Évaluation sociale',
                        preparatoryPhaseDateLabel: 'Réalisée le',
                        completedAt: '2024-03-01T00:00:00.000Z',
                        createdAt: '2024-01-10T00:00:00.000Z',
                    },
                ],
            };

            const result = properties.preparatoryPhasesTowardResorption.data(shantytown);

            // La phase la plus récemment complétée (Diagnostic technique, 10/05) doit apparaître
            // avant Évaluation sociale (01/03), elle-même avant Diagnostic sociologique (15/01).
            const technicalIndex = result.indexOf('Diagnostic technique');
            const socialIndex = result.indexOf('Évaluation sociale');
            const sociologicalIndex = result.indexOf('Diagnostic sociologique');

            expect(technicalIndex).to.be.lessThan(socialIndex);
            expect(socialIndex).to.be.lessThan(sociologicalIndex);
        });
    });
});
