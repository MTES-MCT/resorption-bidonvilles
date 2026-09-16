import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { validationResult } from 'express-validator';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

// ─── stubs ────────────────────────────────────────────────────────────────────

const sandbox = sinon.createSandbox();
const stubs = {
    organizationModel: {
        findByIds: sandbox.stub(),
        findPrefAndDdets: sandbox.stub(),
    },
    userModel: {
        findByIds: sandbox.stub(),
    },
};

rewiremock('#server/models/organizationModel/index').with(stubs.organizationModel);
rewiremock('#server/models/userModel/index').with(stubs.userModel);
rewiremock.passBy('express-validator');

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import { buildCommentTargetsValidatorChain } from './commentTargetsValidatorChain';
rewiremock.disable();

// ─── tests ────────────────────────────────────────────────────────────────────

describe('utils/comment/commentTargetsValidatorChain', () => {
    const buildChain = (getPrefEtDdetsLocation: (req: any) => any | undefined = () => undefined) => buildCommentTargetsValidatorChain(getPrefEtDdetsLocation);

    afterEach(() => {
        sandbox.reset();
    });

    describe('targets.mode (normalisation / valeurs autorisées)', () => {
        it(' remplace une valeur undefined par \'public\' sans lever d\'erreur', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: undefined } } };
            await chain[0].run(req);

            expect(req.body.targets.mode).to.equal('public');
            expect(validationResult(req).isEmpty()).to.equal(true);
        });

        it(' remplace une valeur null par \'public\' sans lever d\'erreur', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: null } } };
            await chain[0].run(req);

            expect(req.body.targets.mode).to.equal('public');
            expect(validationResult(req).isEmpty()).to.equal(true);
        });

        it(' lève une erreur si le mode n\'est pas reconnu', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: 'unknown_mode' } } };
            await chain[0].run(req);

            const result = validationResult(req);
            expect(result.isEmpty()).to.equal(false);
            expect(result.array()[0].msg).to.equal('Le mode choisi pour la publication du message n\'est pas reconnu');
        });
    });

    describe('targets.organizations', () => {
        it(' vide le champ en mode \'public\'', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: 'public', organizations: [{ id: 1 }] } } };
            await chain[1].run(req);

            expect(req.body.targets.organizations).to.deep.equal([]);
            expect(validationResult(req).isEmpty()).to.equal(true);
        });

        it(' lève une erreur si le champ n\'est pas un tableau en mode \'custom\'', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: 'custom', organizations: 'not-an-array' } } };
            await chain[1].run(req);

            const result = validationResult(req);
            expect(result.isEmpty()).to.equal(false);
            expect(result.array()[0].msg).to.equal('Le format des structures ciblées n\'est pas valide');
        });

        it('lève une erreur si une ou plusieurs structures ciblées n\'existent pas en mode \'custom\'', async () => {
            stubs.organizationModel.findByIds.resolves([{ id: 1 }]);

            const chain = buildChain();
            const req: any = {
                body: { targets: { mode: 'custom', organizations: [{ id: 1 }, { id: 2 }] } },
                user: { id: 42 },
            };
            await chain[1].run(req);

            const result = validationResult(req);
            expect(result.isEmpty()).to.equal(false);
            expect(result.array()[0].msg).to.equal('Une ou plusieurs structures ciblées n\'existent pas');
            expect(stubs.organizationModel.findByIds).to.have.been.calledOnceWith([1, 2], false, req.user);
        });

        it(' remplace le champ par le résultat de findPrefAndDdets en mode \'pref_et_ddets\' quand le callback retourne une localisation', async () => {
            const location = { type: 'region', region: { code: '11' } };
            const ddetsOrganizations = [{ id: 5 }];
            stubs.organizationModel.findPrefAndDdets.resolves(ddetsOrganizations);
            stubs.organizationModel.findByIds.resolves(ddetsOrganizations);

            const chain = buildChain(() => location);
            const req: any = { body: { targets: { mode: 'pref_et_ddets', organizations: [] } } };
            await chain[1].run(req);

            expect(stubs.organizationModel.findPrefAndDdets).to.have.been.calledOnceWith(location);
            expect(req.body.targets.organizations).to.deep.equal(ddetsOrganizations);
            expect(validationResult(req).isEmpty()).to.equal(true);
        });

        it(' ne modifie pas le champ en mode \'pref_et_ddets\' quand le callback ne retourne aucune localisation', async () => {
            stubs.organizationModel.findByIds.resolves([{ id: 99 }]);

            const chain = buildChain(() => undefined);
            const req: any = { body: { targets: { mode: 'pref_et_ddets', organizations: [{ id: 99 }] } } };
            await chain[1].run(req);

            expect(stubs.organizationModel.findPrefAndDdets).to.not.have.been.called;
            expect(req.body.targets.organizations).to.deep.equal([{ id: 99 }]);
        });
    });

    describe('targets.users', () => {
        it(' vide le champ quand le mode n\'est pas \'custom\'', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: 'pref_et_ddets', users: [{ id: 1 }] } } };
            await chain[2].run(req);

            expect(req.body.targets.users).to.deep.equal([]);
        });

        it(' lève une erreur si un ou plusieurs utilisateurs ciblés n\'existent pas en mode \'custom\'', async () => {
            stubs.userModel.findByIds.resolves([{ id: 1 }]);

            const chain = buildChain();
            const req: any = { body: { targets: { mode: 'custom', users: [{ id: 1 }, { id: 2 }] } } };
            await chain[2].run(req);

            const result = validationResult(req);
            expect(result.isEmpty()).to.equal(false);
            expect(result.array()[0].msg).to.equal('Un ou plusieurs utilisateurs ciblés n\'existent pas');
            expect(stubs.userModel.findByIds).to.have.been.calledOnceWith(null, [1, 2]);
        });
    });

    describe('targets.mode (validation finale : au moins une cible)', () => {
        it(' lève une erreur en mode \'custom\' sans structure ni utilisateur ciblé', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: 'custom', organizations: [], users: [] } } };
            await chain[3].run(req);

            const result = validationResult(req);
            expect(result.isEmpty()).to.equal(false);
            expect(result.array()[0].msg).to.equal('Vous devez spécifier au moins une structure ou utilisateur cible(s)');
        });

        it(' ne lève pas d\'erreur en mode \'custom\' avec au moins une structure ciblée', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: 'custom', organizations: [{ id: 1 }], users: [] } } };
            await chain[3].run(req);

            expect(validationResult(req).isEmpty()).to.equal(true);
        });

        it(' ne lève pas d\'erreur en mode \'custom\' avec au moins un utilisateur ciblé', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: 'custom', organizations: [], users: [{ id: 1 }] } } };
            await chain[3].run(req);

            expect(validationResult(req).isEmpty()).to.equal(true);
        });

        it(' n\'est pas appliquée en mode \'public\'', async () => {
            const chain = buildChain();
            const req: any = { body: { targets: { mode: 'public', organizations: [], users: [] } } };
            await chain[3].run(req);

            expect(validationResult(req).isEmpty()).to.equal(true);
        });
    });
});
