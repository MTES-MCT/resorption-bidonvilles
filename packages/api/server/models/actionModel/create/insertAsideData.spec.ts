import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { ActionEnrichedInput } from '#server/services/action/ActionInput.d';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    insertAddresses: sandbox.stub(),
    insertFinances: sandbox.stub(),
    insertManagers: sandbox.stub(),
    insertMetrics: sandbox.stub(),
    insertOperators: sandbox.stub(),
    insertShantytowns: sandbox.stub(),
    insertTopics: sandbox.stub(),
};

rewiremock('./insertAddresses').with(stubs.insertAddresses);
rewiremock('./insertFinances').with(stubs.insertFinances);
rewiremock('./insertManagers').with(stubs.insertManagers);
rewiremock('./insertMetrics').with(stubs.insertMetrics);
rewiremock('./insertOperators').with(stubs.insertOperators);
rewiremock('./insertShantytowns').with(stubs.insertShantytowns);
rewiremock('./insertTopics').with(stubs.insertTopics);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import insertAsideData from './insertAsideData';
rewiremock.disable();

describe('models/actionModel/create/insertAsideData()', () => {
    const actionId = 7;
    const authorId = 12;
    const transaction = {} as any;
    const data = {
        topics: ['health'],
        managers: [{ id: 1 }],
        operators: [{ id: 2, is_principal: true }],
        indicateurs: {},
        finances: {},
        location_shantytowns: null,
    } as unknown as ActionEnrichedInput;

    beforeEach(() => {
        Object.values(stubs).forEach(stub => stub.resolves());
    });

    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    it('insère les indicateurs par défaut (création d\'action), sans versionId', async () => {
        await insertAsideData(actionId, authorId, data, transaction);

        expect(stubs.insertMetrics).to.have.been.calledOnceWithExactly(actionId, authorId, data, transaction);
    });

    it('insère les indicateurs quand les options sont vides ou skipMetrics est false', async () => {
        await insertAsideData(actionId, authorId, data, transaction, {});
        await insertAsideData(actionId, authorId, data, transaction, { skipMetrics: false });

        expect(stubs.insertMetrics).to.have.been.calledTwice;
    });

    it('n\'insère pas les indicateurs avec { skipMetrics: true }', async () => {
        await insertAsideData(actionId, authorId, data, transaction, { skipMetrics: true });

        expect(stubs.insertMetrics).not.to.have.been.called;
    });

    it('insère toujours les autres données avec { skipMetrics: true }', async () => {
        await insertAsideData(actionId, authorId, data, transaction, { skipMetrics: true });

        expect(stubs.insertTopics).to.have.been.calledOnce;
        expect(stubs.insertManagers).to.have.been.calledOnce;
        expect(stubs.insertOperators).to.have.been.calledOnce;
        expect(stubs.insertAddresses).to.have.been.calledOnce;
    });

    it('insère les lieux et les financements facultatifs avec { skipMetrics: true } quand ils sont présents', async () => {
        const fullData = {
            ...data,
            location_shantytowns: [3, 4],
            finances: { 2024: [] },
        } as unknown as ActionEnrichedInput;

        await insertAsideData(actionId, authorId, fullData, transaction, { skipMetrics: true });

        expect(stubs.insertShantytowns).to.have.been.calledOnceWithExactly(actionId, [3, 4], transaction);
        expect(stubs.insertFinances).to.have.been.calledOnceWithExactly(actionId, fullData.finances, transaction);
        expect(stubs.insertMetrics).not.to.have.been.called;
    });

    it('propage l\'erreur d\'une insertion', async () => {
        stubs.insertTopics.rejects(new Error('boom'));

        try {
            await insertAsideData(actionId, authorId, data, transaction, { skipMetrics: true });
            expect.fail('aurait dû lever une erreur');
        } catch (error) {
            expect((error as Error).message).to.equal('boom');
        }
    });
});
