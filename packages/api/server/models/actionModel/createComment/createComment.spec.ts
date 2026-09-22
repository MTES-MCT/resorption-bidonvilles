import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

// ─── stubs ────────────────────────────────────────────────────────────────────

const sandbox = sinon.createSandbox();
const queryStub = sandbox.stub();
const insertCommentTargetsStub = sandbox.stub();

const fakeSequelize = {
    query: queryStub,
};

rewiremock('#db/sequelize').with({ sequelize: fakeSequelize });
rewiremock('#server/utils/comment/insertCommentTargets').with({ insertCommentTargets: insertCommentTargetsStub });
// La déclaration `import { type Transaction } from 'sequelize'` est purement un import de type,
// effacé à la compilation : aucun stub du module `sequelize` n'est donc requis ici.

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createActionComment from './createComment';
rewiremock.disable();

// ─── tests ────────────────────────────────────────────────────────────────────

describe('models/actionModel/createComment/createComment()', () => {
    const ACTION_ID = 7;
    const ACTION_COMMENT_ID = 21;
    const fakeTransaction = { id: 'tx-fake' } as any;

    beforeEach(() => {
        queryStub.resolves([[{ action_comment_id: ACTION_COMMENT_ID }]]);
        insertCommentTargetsStub.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    it(' insère le commentaire en base de données et retourne son identifiant', async () => {
        const comment = {
            description: 'Un commentaire',
            created_by: 2,
        };

        const result = await createActionComment(ACTION_ID, comment, fakeTransaction);

        expect(queryStub).to.have.been.calledOnce;
        const options = queryStub.firstCall.args[1];
        expect(options).to.have.nested.property('replacements.actionId', ACTION_ID);
        expect(options).to.have.nested.property('replacements.description', comment.description);
        expect(options).to.have.nested.property('replacements.created_by', comment.created_by);
        expect(options).to.have.property('transaction', fakeTransaction);
        expect(result).to.equal(ACTION_COMMENT_ID);
    });

    it(' appelle insertCommentTargets avec l\'id inséré, les targets transmis, les tables du domaine action et la transaction quand comment.targets est défini', async () => {
        const targets = {
            mode: 'custom' as const,
            users: [{ id: 1 }],
            organizations: [{ id: 2 }],
        };
        const comment = {
            description: 'Un commentaire',
            created_by: 2,
            targets,
        };

        await createActionComment(ACTION_ID, comment, fakeTransaction);

        expect(insertCommentTargetsStub).to.have.been.calledOnceWith(
            ACTION_COMMENT_ID,
            targets,
            {
                userTargetsTable: 'action_comment_user_targets',
                organizationTargetsTable: 'action_comment_organization_targets',
            },
            fakeTransaction,
        );
    });

    it(' n\'appelle pas insertCommentTargets quand comment.targets est undefined', async () => {
        const comment = {
            description: 'Un commentaire',
            created_by: 2,
        };

        await createActionComment(ACTION_ID, comment, fakeTransaction);

        expect(insertCommentTargetsStub).to.not.have.been.called;
    });
});
