import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { ActionUpdateInput } from '#server/services/action/ActionInput.d';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    historize: sandbox.stub(),
    resetAsideData: sandbox.stub(),
    insertAsideData: sandbox.stub(),
    updateAction: sandbox.stub(),
    updateMetrics: sandbox.stub(),
};

rewiremock('../historize/historize').with(stubs.historize);
rewiremock('./resetAsideData').with(stubs.resetAsideData);
rewiremock('../create/insertAsideData').with(stubs.insertAsideData);
rewiremock('./updateAction').with(stubs.updateAction);
rewiremock('./updateMetrics').with(stubs.updateMetrics);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import updateActionModel from './update';
rewiremock.disable();

describe('models/actionModel/update/update()', () => {
    const id = 7;
    const transaction = {} as any;
    const data = { updated_by: 12, indicateurs: {} } as unknown as ActionUpdateInput;

    beforeEach(() => {
        stubs.historize.resolves();
        stubs.resetAsideData.resolves();
        stubs.insertAsideData.resolves();
        stubs.updateAction.resolves();
        stubs.updateMetrics.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    [true, false].forEach((canWriteFinances) => {
        it(`enchaîne historize, resetAsideData, updateAction, insertAsideData puis updateMetrics dans cet ordre (canWriteFinances = ${canWriteFinances})`, async () => {
            await updateActionModel(id, data, canWriteFinances, transaction);

            sinon.assert.callOrder(
                stubs.historize,
                stubs.resetAsideData,
                stubs.updateAction,
                stubs.insertAsideData,
                stubs.updateMetrics,
            );
        });
    });

    it('historise l\'état courant avant toute modification', async () => {
        await updateActionModel(id, data, true, transaction);

        expect(stubs.historize).to.have.been.calledOnceWithExactly(id, true, transaction);
        expect(stubs.historize).to.have.been.calledBefore(stubs.resetAsideData);
    });

    it('réinitialise les données annexes avec canWriteFinances', async () => {
        await updateActionModel(id, data, false, transaction);

        expect(stubs.resetAsideData).to.have.been.calledOnceWithExactly(id, false, transaction);
    });

    it('met à jour l\'action puis réinsère les données annexes avec l\'auteur de la mise à jour', async () => {
        await updateActionModel(id, data, true, transaction);

        expect(stubs.updateAction).to.have.been.calledOnceWithExactly(id, data, transaction);
        expect(stubs.insertAsideData).to.have.been.calledOnce;
        expect(stubs.insertAsideData.firstCall.args.slice(0, 4)).to.eql([id, data.updated_by, data, transaction]);
    });

    it('demande à insertAsideData de NE PAS réinsérer les indicateurs (5e argument { skipMetrics: true })', async () => {
        await updateActionModel(id, data, true, transaction);

        expect(stubs.insertAsideData.firstCall.args[4]).to.eql({ skipMetrics: true });
    });

    it('synchronise les indicateurs via updateMetrics avec l\'auteur de la mise à jour, quelle que soit la valeur de canWriteFinances', async () => {
        await updateActionModel(id, data, false, transaction);
        await updateActionModel(id, data, true, transaction);

        expect(stubs.updateMetrics).to.have.been.calledTwice;
        stubs.updateMetrics.getCalls().forEach((call) => {
            expect(call.args).to.eql([id, data.updated_by, data, transaction]);
        });
    });

    it('propage l\'erreur de updateMetrics', async () => {
        stubs.updateMetrics.rejects(new Error('boom'));

        try {
            await updateActionModel(id, data, true, transaction);
            expect.fail('aurait dû lever une erreur');
        } catch (error) {
            expect((error as Error).message).to.equal('boom');
        }
    });

    [
        { name: 'historize', stub: () => stubs.historize, following: [() => stubs.resetAsideData, () => stubs.updateAction, () => stubs.insertAsideData, () => stubs.updateMetrics] },
        { name: 'resetAsideData', stub: () => stubs.resetAsideData, following: [() => stubs.updateAction, () => stubs.insertAsideData, () => stubs.updateMetrics] },
        { name: 'updateAction', stub: () => stubs.updateAction, following: [() => stubs.insertAsideData, () => stubs.updateMetrics] },
        { name: 'insertAsideData', stub: () => stubs.insertAsideData, following: [() => stubs.updateMetrics] },
    ].forEach(({ name, stub, following }) => {
        it(`propage l'erreur de ${name} sans exécuter les étapes suivantes (dont updateMetrics)`, async () => {
            stub().rejects(new Error(`boom ${name}`));

            try {
                await updateActionModel(id, data, true, transaction);
                expect.fail('aurait dû lever une erreur');
            } catch (error) {
                expect((error as Error).message).to.equal(`boom ${name}`);
            }

            following.forEach(next => expect(next()).not.to.have.been.called);
        });
    });
});
