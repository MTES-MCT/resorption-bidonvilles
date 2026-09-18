import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

// ─── stubs ────────────────────────────────────────────────────────────────────

const sandbox = sinon.createSandbox();
const bulkInsertStub = sandbox.stub();
const getQueryInterfaceStub = sandbox.stub();

const fakeSequelize = {
    getQueryInterface: getQueryInterfaceStub,
};

rewiremock('#db/sequelize').with({ sequelize: fakeSequelize });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import { insertCommentTargets } from './insertCommentTargets';
rewiremock.disable();

// ─── tests ────────────────────────────────────────────────────────────────────

describe('utils/comment/insertCommentTargets()', () => {
    const COMMENT_ID = 12;
    const fakeTransaction = { id: 'tx-fake' } as any;
    const tables = {
        userTargetsTable: 'action_comment_user_targets',
        organizationTargetsTable: 'action_comment_organization_targets',
    };

    beforeEach(() => {
        getQueryInterfaceStub.returns({ bulkInsert: bulkInsertStub });
        bulkInsertStub.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    it(' insère les utilisateurs ciblés dans la table dédiée avec les colonnes fk_user / fk_comment', async () => {
        await insertCommentTargets(
            COMMENT_ID,
            { users: [{ id: 1 }, { id: 2 }] },
            tables,
            fakeTransaction,
        );

        expect(bulkInsertStub).to.have.been.calledOnceWith(
            tables.userTargetsTable,
            [
                { fk_user: 1, fk_comment: COMMENT_ID },
                { fk_user: 2, fk_comment: COMMENT_ID },
            ],
            { transaction: fakeTransaction },
        );
    });

    it(' insère les organisations ciblées dans la table dédiée avec les colonnes fk_organization / fk_comment', async () => {
        await insertCommentTargets(
            COMMENT_ID,
            { organizations: [{ id: 10 }, { id: 20 }] },
            tables,
            fakeTransaction,
        );

        expect(bulkInsertStub).to.have.been.calledOnceWith(
            tables.organizationTargetsTable,
            [
                { fk_organization: 10, fk_comment: COMMENT_ID },
                { fk_organization: 20, fk_comment: COMMENT_ID },
            ],
            { transaction: fakeTransaction },
        );
    });

    it(' n\'appelle pas bulkInsert quand targets.users et targets.organizations sont des tableaux vides', async () => {
        await insertCommentTargets(
            COMMENT_ID,
            { users: [], organizations: [] },
            tables,
            fakeTransaction,
        );

        expect(bulkInsertStub).to.not.have.been.called;
    });

    it(' n\'appelle pas bulkInsert quand targets.users et targets.organizations sont absents', async () => {
        await insertCommentTargets(
            COMMENT_ID,
            {},
            tables,
            fakeTransaction,
        );

        expect(bulkInsertStub).to.not.have.been.called;
    });

    it(' transmet la transaction reçue à bulkInsert', async () => {
        await insertCommentTargets(
            COMMENT_ID,
            { users: [{ id: 1 }] },
            tables,
            fakeTransaction,
        );

        const options = bulkInsertStub.firstCall.args[2];
        expect(options).to.have.property('transaction', fakeTransaction);
    });

    it(' insère à la fois les utilisateurs et les organisations quand les deux tableaux sont non vides', async () => {
        await insertCommentTargets(
            COMMENT_ID,
            { users: [{ id: 1 }], organizations: [{ id: 10 }] },
            tables,
            fakeTransaction,
        );

        expect(bulkInsertStub).to.have.been.calledTwice;
        expect(bulkInsertStub).to.have.been.calledWith(
            tables.userTargetsTable,
            [{ fk_user: 1, fk_comment: COMMENT_ID }],
            { transaction: fakeTransaction },
        );
        expect(bulkInsertStub).to.have.been.calledWith(
            tables.organizationTargetsTable,
            [{ fk_organization: 10, fk_comment: COMMENT_ID }],
            { transaction: fakeTransaction },
        );
    });
});
