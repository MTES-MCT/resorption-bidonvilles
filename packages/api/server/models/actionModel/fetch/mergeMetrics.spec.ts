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

        expect(hash[1].metrics_updated_at).to.equal(null);
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
        expect(hash[99]).to.equal(undefined);
    });
});
