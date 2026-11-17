import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const queryStub = sandbox.stub();

rewiremock('./_common/query').with(queryStub);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import findByIds from './findByIds';
rewiremock.disable();

describe('models/userModel/findByIds()', () => {
    beforeEach(() => {
        queryStub.resolves([]);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('exclut les comptes anonymisés de la recherche (traités comme des utilisateurs inexistants)', async () => {
        await findByIds(null, [1, 2, 3]);

        expect(queryStub).to.have.been.calledOnce;
        const [where] = queryStub.firstCall.args;
        expect(where).to.deep.include({ anonymized_at: { value: null } });
    });

    it('filtre toujours sur les ids demandés', async () => {
        await findByIds(null, [1, 2, 3]);

        const [where] = queryStub.firstCall.args;
        expect(where).to.deep.include({ user_id: [1, 2, 3] });
    });
});
