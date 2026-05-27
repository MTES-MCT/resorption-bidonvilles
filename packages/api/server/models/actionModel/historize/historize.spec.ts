import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    historizeAction: sandbox.stub(),
    historizeAddresses: sandbox.stub(),
    historizeFinances: sandbox.stub(),
    historizeManagers: sandbox.stub(),
    historizeMetrics: sandbox.stub(),
    historizeOperators: sandbox.stub(),
    historizeShantytowns: sandbox.stub(),
    historizeTopics: sandbox.stub(),
};

rewiremock('./historizeAction').with(stubs.historizeAction);
rewiremock('./historizeAddresses').with(stubs.historizeAddresses);
rewiremock('./historizeFinances').with(stubs.historizeFinances);
rewiremock('./historizeManagers').with(stubs.historizeManagers);
rewiremock('./historizeMetrics').with(stubs.historizeMetrics);
rewiremock('./historizeOperators').with(stubs.historizeOperators);
rewiremock('./historizeShantytowns').with(stubs.historizeShantytowns);
rewiremock('./historizeTopics').with(stubs.historizeTopics);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import historize from './historize';
rewiremock.disable();

describe('models/actionModel/historize/historize()', () => {
    const id = 7;
    const hid = 42;
    const transaction = {} as any;

    beforeEach(() => {
        stubs.historizeAction.resolves(hid);
        stubs.historizeAddresses.resolves();
        stubs.historizeFinances.resolves();
        stubs.historizeManagers.resolves();
        stubs.historizeMetrics.resolves();
        stubs.historizeOperators.resolves();
        stubs.historizeShantytowns.resolves();
        stubs.historizeTopics.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    describe('appels inconditionnels', () => {
        it('appelle historizeAction avec id et transaction', async () => {
            await historize(id, false, transaction);

            expect(stubs.historizeAction).to.have.been.calledOnceWithExactly(id, transaction);
        });

        it('appelle historizeAddresses, historizeManagers, historizeMetrics, historizeOperators, historizeShantytowns et historizeTopics avec id, hid et transaction', async () => {
            await historize(id, false, transaction);

            expect(stubs.historizeAddresses).to.have.been.calledOnceWithExactly(id, hid, transaction);
            expect(stubs.historizeManagers).to.have.been.calledOnceWithExactly(id, hid, transaction);
            expect(stubs.historizeMetrics).to.have.been.calledOnceWithExactly(id, hid, transaction);
            expect(stubs.historizeOperators).to.have.been.calledOnceWithExactly(id, hid, transaction);
            expect(stubs.historizeShantytowns).to.have.been.calledOnceWithExactly(id, hid, transaction);
            expect(stubs.historizeTopics).to.have.been.calledOnceWithExactly(id, hid, transaction);
        });
    });

    describe('historisation conditionnelle des finances', () => {
        it('appelle historizeFinances quand canWriteFinances est true', async () => {
            await historize(id, true, transaction);

            expect(stubs.historizeFinances).to.have.been.calledOnceWithExactly(id, hid, transaction);
        });

        it('n\'appelle pas historizeFinances quand canWriteFinances est false', async () => {
            await historize(id, false, transaction);

            expect(stubs.historizeFinances).not.to.have.been.called;
        });
    });
});
