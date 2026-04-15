import { expect } from 'chai';
import { ActionHash } from './hashActions';
import mergeFinances from './mergeFinances';
import ActionFinanceRow from './ActionFinanceRow.d';

function makeAction(id: number): ActionHash[number] {
    return {
        type: 'action',
        id,
        displayId: `ID${String(id).padStart(4, '0')}`,
        name: `Action ${id}`,
        started_at: new Date('2024-01-01').getTime(),
        ended_at: null,
        goals: null,
        topics: [],
        location: {
            type: 'departement',
            city: null,
            epci: null,
            departement: { code: '75', name: 'Paris' },
            region: { code: '11', name: 'Île-de-France' },
        },
        location_type: 'departement',
        eti: null,
        location_other: null,
        location_shantytowns: [],
        managers: [],
        operators: [],
        finances: {},
        hasDihalFinancing: false,
        dihalFinancingYear: null,
        metrics: [],
        metrics_updated_at: null,
        comments: [],
        created_at: new Date('2024-01-01').getTime(),
        created_by: {
            id: 1,
            first_name: 'Jean',
            last_name: 'Dupont',
            organization: { id: 1, name: 'Org', abbreviation: null },
        },
        updated_at: null,
        updated_by: null,
    } as unknown as ActionHash[number];
}

function makeFinanceRow(overrides: Partial<ActionFinanceRow> = {}): ActionFinanceRow {
    return {
        action_id: 1,
        year: 2024,
        amount: 10000,
        real_amount: null,
        comments: '',
        action_finance_type_uid: 'etatique',
        action_finance_type_name: 'Financement étatique',
        ...overrides,
    };
}

describe('models/actionModel/fetch/mergeFinances()', () => {
    describe('hasDihalFinancing', () => {
        it('une action sans aucun financement conserve hasDihalFinancing à false', () => {
            const hash: ActionHash = { 1: makeAction(1) };
            mergeFinances(hash, []);
            expect(hash[1].hasDihalFinancing).to.equal(false);
        });

        it('une action avec un financement de type dedie passe hasDihalFinancing à true', () => {
            const hash: ActionHash = { 1: makeAction(1) };
            const finances: ActionFinanceRow[] = [
                makeFinanceRow({ action_id: 1, action_finance_type_uid: 'dedie', action_finance_type_name: 'Financement dédié DIHAL' }),
            ];
            mergeFinances(hash, finances);
            expect(hash[1].hasDihalFinancing).to.equal(true);
        });

        it('une action avec uniquement un financement de type etatique conserve hasDihalFinancing à false', () => {
            const hash: ActionHash = { 1: makeAction(1) };
            const finances: ActionFinanceRow[] = [
                makeFinanceRow({ action_id: 1, action_finance_type_uid: 'etatique', action_finance_type_name: 'Financement étatique' }),
            ];
            mergeFinances(hash, finances);
            expect(hash[1].hasDihalFinancing).to.equal(false);
        });
    });

    describe('dihalFinancingYear', () => {
        it('une action sans financement dedie conserve dihalFinancingYear à null', () => {
            const hash: ActionHash = { 1: makeAction(1) };
            mergeFinances(hash, []);
            expect(hash[1].dihalFinancingYear).to.equal(null);
        });

        it('une action avec un seul financement dedie en 2024 positionne dihalFinancingYear à 2024', () => {
            const hash: ActionHash = { 1: makeAction(1) };
            const finances: ActionFinanceRow[] = [
                makeFinanceRow({
                    action_id: 1, year: 2024, action_finance_type_uid: 'dedie', action_finance_type_name: 'Financement dédié DIHAL',
                }),
            ];
            mergeFinances(hash, finances);
            expect(hash[1].dihalFinancingYear).to.equal(2024);
        });

        it('une action avec des financements dedie en 2023 et 2025 positionne dihalFinancingYear à 2025 (max)', () => {
            const hash: ActionHash = { 1: makeAction(1) };
            const finances: ActionFinanceRow[] = [
                makeFinanceRow({
                    action_id: 1, year: 2023, action_finance_type_uid: 'dedie', action_finance_type_name: 'Financement dédié DIHAL',
                }),
                makeFinanceRow({
                    action_id: 1, year: 2025, action_finance_type_uid: 'dedie', action_finance_type_name: 'Financement dédié DIHAL',
                }),
            ];
            mergeFinances(hash, finances);
            expect(hash[1].dihalFinancingYear).to.equal(2025);
        });

        it('une action avec uniquement un financement etatique conserve dihalFinancingYear à null', () => {
            const hash: ActionHash = { 1: makeAction(1) };
            const finances: ActionFinanceRow[] = [
                makeFinanceRow({
                    action_id: 1, year: 2024, action_finance_type_uid: 'etatique', action_finance_type_name: 'Financement étatique',
                }),
            ];
            mergeFinances(hash, finances);
            expect(hash[1].dihalFinancingYear).to.equal(null);
        });

        it('deux actions distinctes calculent chacune leur propre dihalFinancingYear indépendamment', () => {
            const hash: ActionHash = {
                1: makeAction(1),
                2: makeAction(2),
            };
            const finances: ActionFinanceRow[] = [
                makeFinanceRow({
                    action_id: 1, year: 2024, action_finance_type_uid: 'dedie', action_finance_type_name: 'Financement dédié DIHAL',
                }),
                makeFinanceRow({
                    action_id: 2, year: 2022, action_finance_type_uid: 'dedie', action_finance_type_name: 'Financement dédié DIHAL',
                }),
            ];
            mergeFinances(hash, finances);
            expect(hash[1].dihalFinancingYear).to.equal(2024);
            expect(hash[2].dihalFinancingYear).to.equal(2022);
        });
    });
});
