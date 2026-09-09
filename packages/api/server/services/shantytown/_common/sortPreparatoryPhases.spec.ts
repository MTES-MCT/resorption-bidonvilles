import { expect } from 'chai';
import sortPreparatoryPhases from './sortPreparatoryPhases';

describe('services/shantytown/_common', () => {
    describe('sortPreparatoryPhases()', () => {
        it('trie les phases complétées par date décroissante', () => {
            const phases = [
                {
                    preparatoryPhaseId: 'phase1',
                    preparatoryPhaseName: 'Phase 1',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: '2024-01-15T00:00:00.000Z',
                    createdAt: '2023-12-01T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
                {
                    preparatoryPhaseId: 'phase2',
                    preparatoryPhaseName: 'Phase 2',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: '2024-05-10T00:00:00.000Z',
                    createdAt: '2023-12-02T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
                {
                    preparatoryPhaseId: 'phase3',
                    preparatoryPhaseName: 'Phase 3',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: '2024-03-01T00:00:00.000Z',
                    createdAt: '2024-01-10T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
            ];

            const sorted = sortPreparatoryPhases(phases);

            expect(sorted[0].preparatoryPhaseId).to.equal('phase2'); // 10/05/2024
            expect(sorted[1].preparatoryPhaseId).to.equal('phase3'); // 01/03/2024
            expect(sorted[2].preparatoryPhaseId).to.equal('phase1'); // 15/01/2024
        });

        it('place les phases complétées avant les phases en cours, indépendamment des dates', () => {
            const phases = [
                {
                    preparatoryPhaseId: 'phase_en_cours',
                    preparatoryPhaseName: 'Phase en cours (créée récemment)',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: null,
                    createdAt: '2024-06-01T00:00:00.000Z', // Très récente
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
                {
                    preparatoryPhaseId: 'phase_completee',
                    preparatoryPhaseName: 'Phase complétée (ancienne)',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: '2023-01-15T00:00:00.000Z', // Très ancienne
                    createdAt: '2022-12-01T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
            ];

            const sorted = sortPreparatoryPhases(phases);

            // La phase complétée ancienne doit passer AVANT la phase en cours récente
            expect(sorted[0].preparatoryPhaseId).to.equal('phase_completee');
            expect(sorted[1].preparatoryPhaseId).to.equal('phase_en_cours');
        });

        it('trie les phases en cours par date de création décroissante', () => {
            const phases = [
                {
                    preparatoryPhaseId: 'phase1',
                    preparatoryPhaseName: 'Phase 1',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: null,
                    createdAt: '2024-01-15T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
                {
                    preparatoryPhaseId: 'phase2',
                    preparatoryPhaseName: 'Phase 2',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: null,
                    createdAt: '2024-03-10T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
                {
                    preparatoryPhaseId: 'phase3',
                    preparatoryPhaseName: 'Phase 3',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: null,
                    createdAt: '2024-02-01T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
            ];

            const sorted = sortPreparatoryPhases(phases);

            expect(sorted[0].preparatoryPhaseId).to.equal('phase2'); // 10/03/2024
            expect(sorted[1].preparatoryPhaseId).to.equal('phase3'); // 01/02/2024
            expect(sorted[2].preparatoryPhaseId).to.equal('phase1'); // 15/01/2024
        });

        it('trie correctement un mélange de phases complétées et en cours', () => {
            const phases = [
                {
                    preparatoryPhaseId: 'phase_en_cours_1',
                    preparatoryPhaseName: 'Phase en cours 1',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: null,
                    createdAt: '2024-03-01T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
                {
                    preparatoryPhaseId: 'phase_completee_1',
                    preparatoryPhaseName: 'Phase complétée 1',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: '2024-01-15T00:00:00.000Z',
                    createdAt: '2023-12-01T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
                {
                    preparatoryPhaseId: 'phase_en_cours_2',
                    preparatoryPhaseName: 'Phase en cours 2',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: null,
                    createdAt: '2024-02-01T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
                {
                    preparatoryPhaseId: 'phase_completee_2',
                    preparatoryPhaseName: 'Phase complétée 2',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: '2024-05-10T00:00:00.000Z',
                    createdAt: '2024-04-01T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
            ];

            const sorted = sortPreparatoryPhases(phases);

            // D'abord les phases complétées (par date décroissante)
            expect(sorted[0].preparatoryPhaseId).to.equal('phase_completee_2'); // 10/05/2024
            expect(sorted[1].preparatoryPhaseId).to.equal('phase_completee_1'); // 15/01/2024

            // Puis les phases en cours (par date de création décroissante)
            expect(sorted[2].preparatoryPhaseId).to.equal('phase_en_cours_1'); // créée le 01/03/2024
            expect(sorted[3].preparatoryPhaseId).to.equal('phase_en_cours_2'); // créée le 01/02/2024
        });

        it('ne modifie pas le tableau original (shallow copy)', () => {
            const phases = [
                {
                    preparatoryPhaseId: 'phase2',
                    preparatoryPhaseName: 'Phase 2',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: '2024-05-10T00:00:00.000Z',
                    createdAt: '2023-12-02T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
                {
                    preparatoryPhaseId: 'phase1',
                    preparatoryPhaseName: 'Phase 1',
                    preparatoryPhaseDateLabel: 'Réalisé le',
                    completedAt: '2024-01-15T00:00:00.000Z',
                    createdAt: '2023-12-01T00:00:00.000Z',
                    createdBy: {
                        authorId: 1,
                        authorFirstName: 'John',
                        authorLastName: 'Doe',
                        organizationName: 'Org',
                        organizationId: 1,
                    },
                },
            ];

            const originalOrder = phases.map(p => p.preparatoryPhaseId);
            sortPreparatoryPhases(phases);

            // Le tableau original doit rester inchangé
            expect(phases.map(p => p.preparatoryPhaseId)).to.deep.equal(originalOrder);
        });
    });
});
