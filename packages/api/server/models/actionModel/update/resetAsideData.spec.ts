import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    resetAddresses: sandbox.stub(),
    resetFinances: sandbox.stub(),
    resetManagers: sandbox.stub(),
    resetMetrics: sandbox.stub(),
    resetOperators: sandbox.stub(),
    resetShantytowns: sandbox.stub(),
    resetTopics: sandbox.stub(),
};

rewiremock('./resetAddresses').with(stubs.resetAddresses);
rewiremock('./resetFinances').with(stubs.resetFinances);
rewiremock('./resetManagers').with(stubs.resetManagers);
rewiremock('./resetMetrics').with(stubs.resetMetrics);
rewiremock('./resetOperators').with(stubs.resetOperators);
rewiremock('./resetShantytowns').with(stubs.resetShantytowns);
rewiremock('./resetTopics').with(stubs.resetTopics);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import resetAsideData from './resetAsideData';
rewiremock.disable();

describe('models/actionModel/update/resetAsideData()', () => {
    const id = 7;
    const transaction = {} as any;

    beforeEach(() => {
        stubs.resetAddresses.resolves();
        stubs.resetFinances.resolves();
        stubs.resetManagers.resolves();
        stubs.resetMetrics.resolves();
        stubs.resetOperators.resolves();
        stubs.resetShantytowns.resolves();
        stubs.resetTopics.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    describe('appels inconditionnels', () => {
        it('appelle resetAddresses, resetManagers, resetMetrics, resetOperators, resetShantytowns et resetTopics avec id et transaction', async () => {
            await resetAsideData(id, false, transaction);

            expect(stubs.resetAddresses).to.have.been.calledOnceWithExactly(id, transaction);
            expect(stubs.resetManagers).to.have.been.calledOnceWithExactly(id, transaction);
            expect(stubs.resetMetrics).to.have.been.calledOnceWithExactly(id, transaction);
            expect(stubs.resetOperators).to.have.been.calledOnceWithExactly(id, transaction);
            expect(stubs.resetShantytowns).to.have.been.calledOnceWithExactly(id, transaction);
            expect(stubs.resetTopics).to.have.been.calledOnceWithExactly(id, transaction);
        });
    });

    describe('reset conditionnel des finances', () => {
        it('appelle resetFinances quand canWriteFinances est true', async () => {
            await resetAsideData(id, true, transaction);

            expect(stubs.resetFinances).to.have.been.calledOnceWithExactly(id, transaction);
        });

        it('n\'appelle pas resetFinances quand canWriteFinances est false', async () => {
            await resetAsideData(id, false, transaction);

            expect(stubs.resetFinances).not.to.have.been.called;
        });
    });
});
