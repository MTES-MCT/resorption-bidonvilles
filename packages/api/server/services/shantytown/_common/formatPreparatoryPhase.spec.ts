import { expect } from 'chai';
import formatPreparatoryPhase from './formatPreparatoryPhase';

describe('services/shantytown/_common', () => {
    describe('formatPreparatoryPhase()', () => {
        it('formate correctement une phase complétée avec une date ISO valide', () => {
            const phase = {
                preparatoryPhaseName: 'Diagnostic sociologique',
                preparatoryPhaseDateLabel: 'Réalisé le',
                completedAt: '2024-01-15T00:00:00.000Z',
            };

            const result = formatPreparatoryPhase(phase);

            expect(result).to.equal('Diagnostic sociologique : réalisé le 15/01/2024');
        });

        it('formate correctement une phase avec une date en milieu d\'année', () => {
            const phase = {
                preparatoryPhaseName: 'Diagnostic technique',
                preparatoryPhaseDateLabel: 'Réalisé le',
                completedAt: '2023-06-08T12:30:00.000Z',
            };

            const result = formatPreparatoryPhase(phase);

            expect(result).to.equal('Diagnostic technique : réalisé le 08/06/2023');
        });

        it('formate correctement une phase avec une date en fin d\'année', () => {
            const phase = {
                preparatoryPhaseName: 'Validation politique',
                preparatoryPhaseDateLabel: 'Validée le',
                completedAt: '2022-12-31T23:59:59.999Z',
            };

            const result = formatPreparatoryPhase(phase);

            expect(result).to.equal('Validation politique : validée le 31/12/2022');
        });

        it('retourne "en cours" pour une phase non complétée', () => {
            const phase = {
                preparatoryPhaseName: 'Évaluation sociale',
                preparatoryPhaseDateLabel: 'Réalisée le',
                completedAt: null,
            };

            const result = formatPreparatoryPhase(phase);

            expect(result).to.equal('Évaluation sociale : en cours');
        });

        it('ne contient jamais de NaN dans la sortie (test de non-régression)', () => {
            const phasesWithDates = [
                {
                    preparatoryPhaseName: 'Phase 1',
                    preparatoryPhaseDateLabel: 'Complétée le',
                    completedAt: '2020-01-01T00:00:00.000Z',
                },
                {
                    preparatoryPhaseName: 'Phase 2',
                    preparatoryPhaseDateLabel: 'Complétée le',
                    completedAt: '2025-12-25T10:00:00.000Z',
                },
            ];

            const phaseWithoutDate = {
                preparatoryPhaseName: 'Phase 3',
                preparatoryPhaseDateLabel: 'Complétée le',
                completedAt: null,
            };

            phasesWithDates.forEach((phase) => {
                const result = formatPreparatoryPhase(phase);
                expect(result).to.not.include('NaN');
            });

            const resultWithoutDate = formatPreparatoryPhase(phaseWithoutDate);
            expect(resultWithoutDate).to.not.include('NaN');
        });

        it('met le label de date en minuscules', () => {
            const phase = {
                preparatoryPhaseName: 'Préparation conventionnement',
                preparatoryPhaseDateLabel: 'RÉALISÉE LE',
                completedAt: '2024-03-15T00:00:00.000Z',
            };

            const result = formatPreparatoryPhase(phase);

            expect(result).to.equal('Préparation conventionnement : réalisée le 15/03/2024');
        });

        it('pad les jours et mois sur deux chiffres', () => {
            const phase = {
                preparatoryPhaseName: 'Aménagement équipement terrain',
                preparatoryPhaseDateLabel: 'Réalisé le',
                completedAt: '2024-02-03T00:00:00.000Z', // 3 février
            };

            const result = formatPreparatoryPhase(phase);

            expect(result).to.equal('Aménagement équipement terrain : réalisé le 03/02/2024');
        });
    });
});
