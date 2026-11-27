import { expect } from 'chai';

import mergeMetrics from './mergeMetrics';
import { ActionHash } from './hashActions';
import { ActionMetricsRow } from './fetchMetrics';

/**
 * Contrat testé : `fetch/mergeMetrics.ts` (correctif « version des indicateurs »).
 *
 *  - metrics_updated_at = max(version_at) des lignes de rang 1 de l'action (et non plus created_at) ;
 *  - les lignes de rang > 1 sont ignorées ;
 *  - created_at / created_by exposés pour chaque ligne restent ceux de la ligne (inchangés).
 */
function buildHash(...ids: number[]): ActionHash {
    return ids.reduce((acc, id) => {
        acc[id] = { id, metrics: [], metrics_updated_at: null } as unknown as ActionHash[number];
        return acc;
    }, {} as ActionHash);
}

function buildRow(override: Partial<ActionMetricsRow> & { version_at?: Date, created_at?: Date } = {}): ActionMetricsRow {
    return {
        rank: 1,
        action_id: 1,
        date: '2024-12-31',
        nombre_personnes: 10,
        nombre_menages: null,
        nombre_femmes: null,
        nombre_mineurs: null,
        sante_nombre_personnes: null,
        travail_nombre_personnes: null,
        travail_nombre_femmes: null,
        hebergement_nombre_personnes: null,
        hebergement_nombre_menages: null,
        logement_nombre_personnes: null,
        logement_nombre_menages: null,
        scolaire_mineurs_moins_de_trois_ans: null,
        scolaire_mineurs_trois_ans_et_plus: null,
        scolaire_mediation_moins_de_trois_ans: null,
        scolaire_mediation_trois_ans_et_plus: null,
        scolaire_nombre_maternelle: null,
        scolaire_nombre_elementaire: null,
        scolaire_nombre_college: null,
        scolaire_nombre_lycee: null,
        scolaire_nombre_autre: null,
        scolaire_mineur_scolarise_dans_annee: null,
        created_at: new Date(2025, 0, 10, 8, 0, 0),
        version_at: new Date(2025, 0, 10, 8, 0, 0),
        creator_id: 3,
        creator_first_name: 'Jean',
        creator_last_name: 'Dupont',
        creator_organization_id: 4,
        creator_organization_name: 'Association',
        creator_organization_abbreviation: 'ASSO',
        ...override,
    } as unknown as ActionMetricsRow;
}

describe('models/actionModel/fetch/mergeMetrics()', () => {
    it('définit metrics_updated_at à partir de version_at de la ligne de rang 1', () => {
        const hash = buildHash(1);
        const versionAt = new Date(2025, 5, 1, 12, 0, 0);

        mergeMetrics(hash, [buildRow({ version_at: versionAt, created_at: new Date(2025, 0, 10) })]);

        expect(hash[1].metrics_updated_at).to.equal(versionAt.getTime());
    });

    it('n\'utilise plus created_at pour metrics_updated_at (version_at antérieure à created_at)', () => {
        const hash = buildHash(1);
        const versionAt = new Date(2025, 0, 1, 12, 0, 0);
        const createdAt = new Date(2026, 0, 1, 12, 0, 0);

        mergeMetrics(hash, [buildRow({ version_at: versionAt, created_at: createdAt })]);

        expect(hash[1].metrics_updated_at).to.equal(versionAt.getTime());
        expect(hash[1].metrics_updated_at).not.to.equal(createdAt.getTime());
    });

    it('retient le maximum de version_at parmi les lignes de rang 1', () => {
        const hash = buildHash(1);
        const earlier = new Date(2025, 1, 1, 9, 0, 0);
        const later = new Date(2025, 3, 1, 9, 0, 0);

        mergeMetrics(hash, [
            buildRow({ date: '2023-12-31', version_at: later }),
            buildRow({ date: '2024-12-31', version_at: earlier }),
        ]);

        expect(hash[1].metrics_updated_at).to.equal(later.getTime());
    });

    it('ignore les lignes de rang > 1, même si leur version_at est plus récente', () => {
        const hash = buildHash(1);
        const current = new Date(2025, 1, 1, 9, 0, 0);

        mergeMetrics(hash, [
            buildRow({ rank: 1, version_at: current }),
            buildRow({ rank: 2, version_at: new Date(2026, 1, 1, 9, 0, 0), nombre_personnes: 99 }),
        ]);

        expect(hash[1].metrics_updated_at).to.equal(current.getTime());
        expect(hash[1].metrics).to.have.lengthOf(1);
        expect(hash[1].metrics[0].nombre_personnes).to.equal(10);
    });

    it('laisse metrics_updated_at à null quand l\'action n\'a que des lignes de rang > 1', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildRow({ rank: 2 })]);

        expect(hash[1].metrics_updated_at).to.be.null;
        expect(hash[1].metrics).to.eql([]);
    });

    it('expose created_at et created_by de chaque ligne, inchangés (indépendants de version_at)', () => {
        const hash = buildHash(1);
        const createdAt = new Date(2024, 2, 3, 4, 5, 6);

        mergeMetrics(hash, [buildRow({ created_at: createdAt, version_at: new Date(2025, 5, 1, 12, 0, 0) })]);

        expect(hash[1].metrics[0].created_at).to.equal(createdAt.getTime());
        expect(hash[1].metrics[0].created_by).to.eql({
            id: 3,
            first_name: 'Jean',
            last_name: 'Dupont',
            organization: { id: 4, name: 'Association', abbreviation: 'ASSO' },
        });
    });

    it('conserve les valeurs d\'indicateurs et la date de chaque ligne', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildRow({ date: '2024-12-31', nombre_personnes: 12, nombre_menages: 0 })]);

        expect(hash[1].metrics).to.have.lengthOf(1);
        expect(hash[1].metrics[0].date).to.equal(new Date('2024-12-31').getTime());
        expect(hash[1].metrics[0].nombre_personnes).to.equal(12);
        expect(hash[1].metrics[0].nombre_menages).to.equal(0);
    });

    it('gère plusieurs actions indépendamment', () => {
        const hash = buildHash(1, 2);
        const versionOne = new Date(2025, 0, 5, 9, 0, 0);
        const versionTwo = new Date(2025, 8, 5, 9, 0, 0);

        mergeMetrics(hash, [
            buildRow({ action_id: 1, version_at: versionOne }),
            buildRow({ action_id: 2, version_at: versionTwo }),
            buildRow({ action_id: 2, rank: 2, version_at: new Date(2026, 0, 1) }),
        ]);

        expect(hash[1].metrics_updated_at).to.equal(versionOne.getTime());
        expect(hash[2].metrics_updated_at).to.equal(versionTwo.getTime());
        expect(hash[1].metrics).to.have.lengthOf(1);
        expect(hash[2].metrics).to.have.lengthOf(1);
    });

    it('ignore les lignes d\'une action absente du hash', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildRow({ action_id: 99 })]);

        expect(hash[1].metrics).to.eql([]);
        expect(hash[99]).to.be.undefined;
    });
});

type RowOverride = Omit<Partial<ActionMetricsRow>, 'rank'> & { version_at?: Date, created_at?: Date };

/**
 * Construit une ligne dont le rang peut être un nombre ou une chaîne : le driver pg renvoie en réalité
 * les `bigint` (RANK() OVER ...) sous forme de chaîne ("1", "2", "10").
 */
function buildRowWithRank(rank: number | string, override: RowOverride = {}): ActionMetricsRow {
    return buildRow({ ...override, rank: rank as ActionMetricsRow['rank'] });
}

describe('models/actionModel/fetch/mergeMetrics() - rank renvoyé sous forme de chaîne par le driver pg', () => {
    it('conserve une ligne de rank "1" (ajoutée à metrics, metrics_updated_at issu de son version_at)', () => {
        const hash = buildHash(1);
        const versionAt = new Date(2025, 5, 1, 12, 0, 0);

        mergeMetrics(hash, [buildRowWithRank('1', { version_at: versionAt })]);

        expect(hash[1].metrics).to.have.lengthOf(1);
        expect(hash[1].metrics_updated_at).to.equal(versionAt.getTime());
    });

    it('ignore une ligne de rank "2" (ni dans metrics, ni dans metrics_updated_at)', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildRowWithRank('2', { version_at: new Date(2026, 1, 1, 9, 0, 0) })]);

        expect(hash[1].metrics).to.be.empty;
        expect(hash[1].metrics_updated_at).to.be.null;
    });

    it('ignore une ligne de rank "10" (comparaison numérique et non lexicographique)', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildRowWithRank('10', { version_at: new Date(2026, 1, 1, 9, 0, 0) })]);

        expect(hash[1].metrics).to.be.empty;
        expect(hash[1].metrics_updated_at).to.be.null;
    });

    it('ne compte que les lignes de rank "1" parmi un mélange "1" / "2" et les conserve toutes', () => {
        const hash = buildHash(1);
        const earlier = new Date(2025, 1, 1, 9, 0, 0);
        const later = new Date(2025, 3, 1, 9, 0, 0);

        mergeMetrics(hash, [
            buildRowWithRank('1', { date: '2024-12-31', nombre_personnes: 11, version_at: earlier }),
            buildRowWithRank('2', { date: '2024-12-31', nombre_personnes: 99, version_at: new Date(2026, 1, 1, 9, 0, 0) }),
            buildRowWithRank('1', { date: '2023-12-31', nombre_personnes: 12, version_at: later }),
            buildRowWithRank('2', { date: '2023-12-31', nombre_personnes: 98, version_at: new Date(2026, 2, 1, 9, 0, 0) }),
        ]);

        expect(hash[1].metrics).to.have.lengthOf(2);
        expect(hash[1].metrics.map(metric => metric.nombre_personnes)).to.have.members([11, 12]);
        expect(hash[1].metrics_updated_at).to.equal(later.getTime());
    });

    it('traite de la même façon un rang nombre 1 et un rang chaîne "1"', () => {
        const hashNumber = buildHash(1);
        const hashString = buildHash(1);
        const versionAt = new Date(2025, 5, 1, 12, 0, 0);

        mergeMetrics(hashNumber, [buildRowWithRank(1, { version_at: versionAt, nombre_personnes: 15 })]);
        mergeMetrics(hashString, [buildRowWithRank('1', { version_at: versionAt, nombre_personnes: 15 })]);

        expect(hashString[1].metrics).to.have.lengthOf(1);
        expect(hashString[1].metrics).to.eql(hashNumber[1].metrics);
        expect(hashString[1].metrics_updated_at).to.equal(hashNumber[1].metrics_updated_at);
    });

    it('traite de la même façon un mélange de rangs nombre et chaîne au sein d\'une même action', () => {
        const hash = buildHash(1);
        const versionAt = new Date(2025, 5, 1, 12, 0, 0);

        mergeMetrics(hash, [
            buildRowWithRank(1, { date: '2024-12-31', version_at: versionAt }),
            buildRowWithRank('1', { date: '2023-12-31', version_at: versionAt }),
            buildRowWithRank(2, { date: '2022-12-31' }),
            buildRowWithRank('2', { date: '2021-12-31' }),
        ]);

        expect(hash[1].metrics).to.have.lengthOf(2);
    });

    it('gère plusieurs actions indépendamment quand les rangs sont des chaînes', () => {
        const hash = buildHash(1, 2, 3);
        const versionOne = new Date(2025, 0, 5, 9, 0, 0);
        const versionTwo = new Date(2025, 8, 5, 9, 0, 0);

        mergeMetrics(hash, [
            buildRowWithRank('1', { action_id: 1, version_at: versionOne }),
            buildRowWithRank('1', { action_id: 2, version_at: versionTwo }),
            buildRowWithRank('2', { action_id: 2, version_at: new Date(2026, 0, 1) }),
            buildRowWithRank('10', { action_id: 3, version_at: new Date(2026, 0, 1) }),
        ]);

        expect(hash[1].metrics).to.have.lengthOf(1);
        expect(hash[1].metrics_updated_at).to.equal(versionOne.getTime());
        expect(hash[2].metrics).to.have.lengthOf(1);
        expect(hash[2].metrics_updated_at).to.equal(versionTwo.getTime());
        expect(hash[3].metrics).to.be.empty;
        expect(hash[3].metrics_updated_at).to.be.null;
    });
});

/**
 * Contrat ajouté (ticket 2739, fraîcheur des indicateurs) : chaque entrée de `metrics` porte aussi
 *  - year                  : année de la ligne, extraite de `date` (chaîne YYYY-MM-DD) ;
 *  - indicators_updated_at : `updated_at_indicators` en ms, SEULEMENT si la ligne a au moins une valeur non scolaire
 *                            non nulle, sinon null ;
 *  - scolaire_updated_at   : `updated_at_scolaire` en ms, SEULEMENT si la ligne a au moins une valeur scolaire_*
 *                            non nulle, sinon null.
 * `metrics_updated_at` (max de version_at) reste inchangé ; les lignes de rang > 1 sont toujours ignorées.
 * Choix : « valeur non nulle » = ni null, ni undefined, ni chaîne vide ; 0 est une valeur.
 */
type FreshnessFields = { updated_at_indicators: Date | null, updated_at_scolaire: Date | null };
type FreshnessMetric = { year: number, indicators_updated_at: number | null, scolaire_updated_at: number | null };

function buildFreshRow(override: Partial<ActionMetricsRow> & Partial<FreshnessFields> = {}): ActionMetricsRow {
    return buildRow({
        updated_at_indicators: new Date(2025, 2, 1, 10, 0, 0),
        updated_at_scolaire: new Date(2025, 3, 1, 10, 0, 0),
        ...override,
    } as Partial<ActionMetricsRow>);
}

function metricsOf(hash: ActionHash, id = 1): FreshnessMetric[] {
    return hash[id].metrics as unknown as FreshnessMetric[];
}

describe('models/actionModel/fetch/mergeMetrics() - dates de mise à jour par nature d\'indicateur', () => {
    const indicatorsAt = new Date(2025, 2, 1, 10, 0, 0);
    const scolaireAt = new Date(2025, 3, 1, 10, 0, 0);

    it('expose l\'année de la ligne, extraite de sa date', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildFreshRow({ date: '2024-12-31' })]);

        expect(metricsOf(hash)[0].year).to.equal(2024);
    });

    it('expose indicators_updated_at en ms quand la ligne a une valeur non scolaire', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildFreshRow({ nombre_personnes: 10, scolaire_nombre_college: null })]);

        expect(metricsOf(hash)[0].indicators_updated_at).to.equal(indicatorsAt.getTime());
        expect(metricsOf(hash)[0].scolaire_updated_at).to.be.null;
    });

    it('expose scolaire_updated_at en ms quand la ligne a une valeur scolaire', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildFreshRow({ nombre_personnes: null, scolaire_nombre_college: 4 })]);

        expect(metricsOf(hash)[0].indicators_updated_at).to.be.null;
        expect(metricsOf(hash)[0].scolaire_updated_at).to.equal(scolaireAt.getTime());
    });

    it('expose les deux dates quand les deux natures sont renseignées', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildFreshRow({ nombre_personnes: 10, scolaire_nombre_lycee: 2 })]);

        expect(metricsOf(hash)[0].indicators_updated_at).to.equal(indicatorsAt.getTime());
        expect(metricsOf(hash)[0].scolaire_updated_at).to.equal(scolaireAt.getTime());
    });

    it('considère 0 comme une valeur', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildFreshRow({ nombre_personnes: null, scolaire_nombre_autre: 0 })]);

        expect(metricsOf(hash)[0].indicators_updated_at).to.be.null;
        expect(metricsOf(hash)[0].scolaire_updated_at).to.equal(scolaireAt.getTime());
    });

    it('met les deux dates à null quand la ligne n\'a aucune valeur', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildFreshRow({ nombre_personnes: null })]);

        expect(metricsOf(hash)[0].indicators_updated_at).to.be.null;
        expect(metricsOf(hash)[0].scolaire_updated_at).to.be.null;
    });

    it('met à null une nature sans valeur même quand sa colonne de date est renseignée', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildFreshRow({ nombre_personnes: 5, updated_at_scolaire: new Date(2026, 0, 1) })]);

        expect(metricsOf(hash)[0].scolaire_updated_at).to.be.null;
    });

    it('retourne null quand la nature a des valeurs mais que sa date est nulle', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildFreshRow({ nombre_personnes: 5, updated_at_indicators: null })]);

        expect(metricsOf(hash)[0].indicators_updated_at).to.be.null;
    });

    it('détecte chacun des champs scolaires comme nature scolaire (et aucun comme non scolaire)', () => {
        const scolaireKeys = [
            'scolaire_mineurs_moins_de_trois_ans',
            'scolaire_mineurs_trois_ans_et_plus',
            'scolaire_mediation_moins_de_trois_ans',
            'scolaire_mediation_trois_ans_et_plus',
            'scolaire_nombre_maternelle',
            'scolaire_nombre_elementaire',
            'scolaire_nombre_college',
            'scolaire_nombre_lycee',
            'scolaire_nombre_autre',
            'scolaire_mineur_scolarise_dans_annee',
        ];

        scolaireKeys.forEach((key) => {
            const hash = buildHash(1);

            mergeMetrics(hash, [buildFreshRow({ nombre_personnes: null, [key]: 1 })]);

            expect(metricsOf(hash)[0].indicators_updated_at, key).to.be.null;
            expect(metricsOf(hash)[0].scolaire_updated_at, key).to.equal(scolaireAt.getTime());
        });
    });

    it('détecte chacun des champs non scolaires comme nature non scolaire (et aucun comme scolaire)', () => {
        const keys = [
            'nombre_personnes',
            'nombre_menages',
            'nombre_femmes',
            'nombre_mineurs',
            'sante_nombre_personnes',
            'travail_nombre_personnes',
            'travail_nombre_femmes',
            'hebergement_nombre_personnes',
            'hebergement_nombre_menages',
            'logement_nombre_personnes',
            'logement_nombre_menages',
        ];

        keys.forEach((key) => {
            const hash = buildHash(1);

            mergeMetrics(hash, [buildFreshRow({ nombre_personnes: null, [key]: 1 })]);

            expect(metricsOf(hash)[0].indicators_updated_at, key).to.equal(indicatorsAt.getTime());
            expect(metricsOf(hash)[0].scolaire_updated_at, key).to.be.null;
        });
    });

    it('traite chaque ligne (année) avec ses propres dates', () => {
        const hash = buildHash(1);
        const otherAt = new Date(2025, 8, 9, 9, 0, 0);

        mergeMetrics(hash, [
            buildFreshRow({ date: '2025-12-31', nombre_personnes: 10 }),
            buildFreshRow({
                date: '2026-06-01', nombre_personnes: null, scolaire_nombre_college: 3, updated_at_scolaire: otherAt,
            }),
        ]);

        expect(metricsOf(hash).map(metric => metric.year)).to.eql([2025, 2026]);
        expect(metricsOf(hash)[0].indicators_updated_at).to.equal(indicatorsAt.getTime());
        expect(metricsOf(hash)[0].scolaire_updated_at).to.be.null;
        expect(metricsOf(hash)[1].indicators_updated_at).to.be.null;
        expect(metricsOf(hash)[1].scolaire_updated_at).to.equal(otherAt.getTime());
    });

    it('laisse metrics_updated_at inchangé (max de version_at) indépendamment des nouvelles dates', () => {
        const hash = buildHash(1);
        const versionAt = new Date(2025, 5, 1, 12, 0, 0);

        mergeMetrics(hash, [buildFreshRow({ version_at: versionAt, updated_at_indicators: new Date(2026, 0, 1) })]);

        expect(hash[1].metrics_updated_at).to.equal(versionAt.getTime());
    });

    it('ignore toujours les lignes de rang > 1', () => {
        const hash = buildHash(1);

        mergeMetrics(hash, [buildFreshRow({ rank: 2 }), buildFreshRow({ rank: '3' as unknown as number })]);

        expect(hash[1].metrics).to.eql([]);
    });
});
