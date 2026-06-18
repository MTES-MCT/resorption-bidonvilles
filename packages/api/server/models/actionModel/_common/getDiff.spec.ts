import chai from 'chai';
import { rewiremock } from '#test/rewiremock';
import { serialized as fakeAction } from '#test/utils/action';
import type Action from '#root/types/resources/Action.d';

const { expect } = chai;

// getDiff n'a pas de dépendances à stubber, mais la config rewiremock du projet
// est en mode strict (noAutoPassBy). On laisse explicitement passer son seul import.
rewiremock('#server/utils/date').callThrough();
rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import getDiff from './getDiff';
rewiremock.disable();

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Construit une Action minimale pour les tests getDiff en surchargeant
 * uniquement operators (et managers si besoin).
 */
const buildAction = (overrides: Partial<Action>): Action => fakeAction(overrides);

const makeOrg = (id: number, name: string, isPrincipal: boolean) => ({
    id,
    name,
    abbreviation: null,
    is_principal: isPrincipal,
    users: [
        {
            id,
            email: `user${id}@test.fr`,
            first_name: 'User',
            last_name: String(id),
            position: '',
            phone: null,
            role: 'collaborator',
            is_admin: false,
            is_principal: isPrincipal,
            organization: { id, name, abbreviation: null },
        },
    ],
});

const makeOrgWithUsers = (
    orgId: number,
    orgName: string,
    users: Array<{ id: number; isPrincipal: boolean }>,
) => ({
    id: orgId,
    name: orgName,
    abbreviation: null,
    is_principal: users.some(u => u.isPrincipal),
    users: users.map(u => ({
        id: u.id,
        email: `user${u.id}@test.fr`,
        first_name: 'User',
        last_name: String(u.id),
        position: '',
        phone: null,
        role: 'collaborator',
        is_admin: false,
        is_principal: u.isPrincipal,
        organization: { id: orgId, name: orgName, abbreviation: null },
    })),
});

// ─── tests ────────────────────────────────────────────────────────────────────

describe('models/actionModel/_common/getDiff()', () => {
    // ── Cas 1 : ajout d'un opérateur (sans changement de principal) ────────────
    describe("ajout d'un opérateur", () => {
        it('produit un diff quand un opérateur est ajouté à la liste', () => {
            const oldAction = buildAction({
                operators: [makeOrg(1, 'ATD', false)],
            });
            const newAction = buildAction({
                operators: [makeOrg(1, 'ATD', false), makeOrg(2, 'FNARS', false)],
            });

            const diffs = getDiff(oldAction, newAction);
            const operatorsDiff = diffs.find(d => d.fieldKey === 'operators');

            expect(operatorsDiff).to.exist;
            expect(operatorsDiff.oldValue).to.include('ATD');
            expect(operatorsDiff.newValue).to.include('ATD');
            expect(operatorsDiff.newValue).to.include('FNARS');
        });
    });

    // ── Cas 2 : aucun changement ───────────────────────────────────────────────
    describe('liste identique sans changement de principal', () => {
        it('ne produit aucun diff quand les opérateurs et is_principal sont inchangés', () => {
            const operators = [makeOrg(1, 'ATD', false), makeOrg(2, 'FNARS', false)];
            const oldAction = buildAction({ operators });
            const newAction = buildAction({ operators });

            const diffs = getDiff(oldAction, newAction);
            const operatorsDiff = diffs.find(d => d.fieldKey === 'operators');

            expect(operatorsDiff).to.be.undefined;
        });

        it('ne produit aucun diff quand is_principal est identique dans les deux versions', () => {
            const oldAction = buildAction({
                operators: [makeOrg(1, 'ATD', true), makeOrg(2, 'FNARS', false)],
            });
            const newAction = buildAction({
                operators: [makeOrg(1, 'ATD', true), makeOrg(2, 'FNARS', false)],
            });

            const diffs = getDiff(oldAction, newAction);
            const operatorsDiff = diffs.find(d => d.fieldKey === 'operators');

            expect(operatorsDiff).to.be.undefined;
        });
    });

    // ── Cas 3 : le principal bascule entre deux organisations ─────────────────
    describe('changement de principal entre organisations', () => {
        it('produit un diff quand le principal bascule de ATD vers FNARS', () => {
            const oldAction = buildAction({
                operators: [makeOrg(1, 'ATD', true), makeOrg(2, 'FNARS', false)],
            });
            const newAction = buildAction({
                operators: [makeOrg(1, 'ATD', false), makeOrg(2, 'FNARS', true)],
            });

            const diffs = getDiff(oldAction, newAction);
            const operatorsDiff = diffs.find(d => d.fieldKey === 'operators');

            expect(operatorsDiff, 'un diff operators doit être produit').to.exist;
        });

        it('marque ATD comme principal dans oldValue et FNARS comme principal dans newValue', () => {
            const oldAction = buildAction({
                operators: [makeOrg(1, 'ATD', true), makeOrg(2, 'FNARS', false)],
            });
            const newAction = buildAction({
                operators: [makeOrg(1, 'ATD', false), makeOrg(2, 'FNARS', true)],
            });

            const diffs = getDiff(oldAction, newAction);
            const operatorsDiff = diffs.find(d => d.fieldKey === 'operators');

            expect(operatorsDiff.oldValue).to.include('ATD (principal)');
            expect(operatorsDiff.oldValue).not.to.include('FNARS (principal)');
            expect(operatorsDiff.newValue).to.include('FNARS (principal)');
            expect(operatorsDiff.newValue).not.to.include('ATD (principal)');
        });
    });

    // ── Cas 4 : suppression du statut principal ───────────────────────────────
    describe('suppression du statut principal', () => {
        it('produit un diff quand is_principal passe de true à false sur la seule organisation', () => {
            const oldAction = buildAction({
                operators: [makeOrg(1, 'ATD', true)],
            });
            const newAction = buildAction({
                operators: [makeOrg(1, 'ATD', false)],
            });

            const diffs = getDiff(oldAction, newAction);
            const operatorsDiff = diffs.find(d => d.fieldKey === 'operators');

            expect(operatorsDiff, 'un diff operators doit être produit').to.exist;
        });

        it('formate oldValue avec "(principal)" et newValue sans ce suffixe', () => {
            const oldAction = buildAction({
                operators: [makeOrg(1, 'ATD', true)],
            });
            const newAction = buildAction({
                operators: [makeOrg(1, 'ATD', false)],
            });

            const diffs = getDiff(oldAction, newAction);
            const operatorsDiff = diffs.find(d => d.fieldKey === 'operators');

            expect(operatorsDiff.oldValue).to.equal('ATD (principal)');
            expect(operatorsDiff.newValue).to.equal('ATD');
        });
    });

    // ── Cas 5 : non-régression managers — userList ne doit pas suffixer (principal) ──
    describe('non-régression managers', () => {
        it('le processeur des managers ne suffixe pas "(principal)" même si is_principal est présent', () => {
            // On injecte is_principal dans les users des managers pour simuler
            // une éventuelle régression si userList était modifié.
            const managerOrg = makeOrgWithUsers(10, 'DDETS', [
                { id: 10, isPrincipal: true },
            ]);
            const oldAction = buildAction({
                managers: [managerOrg],
            });
            const newAction = buildAction({
                managers: [managerOrg],
            });

            const diffs = getDiff(oldAction, newAction);
            const managersDiff = diffs.find(d => d.fieldKey === 'managers');

            // Aucun diff attendu (même liste)
            expect(managersDiff).to.be.undefined;
        });

        it('le champ managers produit une valeur sans "(principal)" même si une organisation a is_principal=true', () => {
            const oldAction = buildAction({
                managers: [makeOrg(10, 'DDETS', false)],
            });
            const newAction = buildAction({
                managers: [makeOrg(10, 'DDETS', false), makeOrg(11, 'DREETS', false)],
            });

            const diffs = getDiff(oldAction, newAction);
            const managersDiff = diffs.find(d => d.fieldKey === 'managers');

            // Il y a un diff (ajout d'une organisation)
            expect(managersDiff).to.exist;
            // Mais aucune des valeurs ne contient "(principal)"
            expect(managersDiff.oldValue).not.to.include('(principal)');
            expect(managersDiff.newValue).not.to.include('(principal)');
        });
    });
});
