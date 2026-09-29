import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const queryStub = sandbox.stub();

const fakeSequelize = {
    query: queryStub,
};

rewiremock('#db/sequelize').with({ sequelize: fakeSequelize });
rewiremock('sequelize').with({ QueryTypes: { SELECT: 'SELECT' } });
rewiremock('./enrichWhere').callThrough();

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetchManagers from './fetchManagers';
rewiremock.disable();

describe('models/actionModel/fetch/fetchManagers()', () => {
    beforeEach(() => {
        queryStub.resolves([]);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('exclut les pilotes dont le compte est anonymisé (traités comme des utilisateurs inexistants)', async () => {
        await fetchManagers([1]);

        expect(queryStub).to.have.been.calledOnce;
        const sql: string = queryStub.firstCall.args[0];
        expect(sql).to.include('users.anonymized_at IS NULL');
    });
});
