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

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createShantytownComment from './create';
rewiremock.disable();

// ─── tests ────────────────────────────────────────────────────────────────────

describe('models/shantytownCommentModel/create()', () => {
    const SHANTYTOWN_COMMENT_ID = 33;
    const fakeTransaction = { id: 'tx-fake' } as any;

    beforeEach(() => {
        queryStub.resolves([[{ shantytown_comment_id: SHANTYTOWN_COMMENT_ID }]]);
        insertCommentTargetsStub.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    it(' insère le commentaire en base de données et retourne son identifiant', async () => {
        const data = {
            description: 'Un commentaire',
            fk_shantytown: 1,
            created_by: 2,
            targets: { users: [], organizations: [] },
        };

        const result = await createShantytownComment(data, fakeTransaction);

        expect(queryStub).to.have.been.calledOnce;
        const options = queryStub.firstCall.args[1];
        expect(options).to.have.property('replacements', data);
        expect(options).to.have.property('transaction', fakeTransaction);
        expect(result).to.equal(SHANTYTOWN_COMMENT_ID);
    });

    it(' appelle insertCommentTargets avec l\'id inséré, les targets transmis, les tables du domaine site et la transaction', async () => {
        const targets = { users: [{ id: 1 }], organizations: [{ id: 2 }] };
        const data = {
            description: 'Un commentaire',
            fk_shantytown: 1,
            created_by: 2,
            targets,
        };

        await createShantytownComment(data, fakeTransaction);

        expect(insertCommentTargetsStub).to.have.been.calledOnceWith(
            SHANTYTOWN_COMMENT_ID,
            targets,
            {
                userTargetsTable: 'shantytown_comment_user_targets',
                organizationTargetsTable: 'shantytown_comment_organization_targets',
            },
            fakeTransaction,
        );
    });
});
