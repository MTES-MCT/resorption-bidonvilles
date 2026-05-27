import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        transaction: sandbox.stub(),
    },
    transaction: {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
    },
    updateActionModel: sandbox.stub(),
    fetchAction: sandbox.stub(),
    can: sandbox.stub(),
};

class FakeUniqueConstraintError extends Error {
    parent: { constraint: string };

    constructor(constraint: string) {
        super('Unique constraint error');
        this.name = 'SequelizeUniqueConstraintError';
        this.parent = { constraint };
    }
}

rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('sequelize').with({ UniqueConstraintError: FakeUniqueConstraintError });
rewiremock('#server/models/actionModel/update/update').with(stubs.updateActionModel);
rewiremock('./write.fetchAction').with(stubs.fetchAction);
rewiremock('#server/utils/permission/can').with(stubs.can);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import update from './update';
rewiremock.disable();

describe('services/action.update()', () => {
    const action = fakeAction();
    const user = fakeUser();
    const actionData = {
        name: 'Action mise à jour',
        started_at: new Date(2023, 0, 1),
        ended_at: null,
        topics: ['health'],
        goals: 'Objectifs mis à jour',
        location: {
            type: 'departement' as const,
            region: { code: '11', name: 'Île-De-France' },
            departement: { code: '78', name: 'Yvelines' },
            epci: null,
            city: null,
        },
        location_departement: '78',
        location_type: 'logement' as const,
        location_eti_addresses: null,
        location_shantytowns: null,
        location_autre: null,
        managers: [{ id: 1, organization_id: 1 }],
        operators: [{ id: 2, organization_id: 2 }],
        indicateurs: {},
    };

    beforeEach(() => {
        stubs.sequelize.transaction.resolves(stubs.transaction);
        stubs.fetchAction.resolves(fakeAction());

        // Configuration par défaut du stub can
        const onStub = sandbox.stub().returns(true);
        const doStub = sandbox.stub().returns({ on: onStub });
        stubs.can.returns({ do: doStub });
    });

    afterEach(() => {
        sandbox.reset();
    });

    describe('gestion des permissions finances', () => {
        it('passe canWriteFinances=true au modèle si l\'utilisateur a la permission', async () => {
            stubs.can.returns({
                do: sandbox.stub().returns({
                    on: sandbox.stub().returns(true),
                }),
            });

            await update(action, user, actionData);

            expect(stubs.updateActionModel).to.have.been.calledOnce;
            const callArgs = stubs.updateActionModel.firstCall.args;
            expect(callArgs[2]).to.equal(true);
        });

        it('passe canWriteFinances=false au modèle si l\'utilisateur n\'a pas la permission', async () => {
            stubs.can.returns({
                do: sandbox.stub().returns({
                    on: sandbox.stub().returns(false),
                }),
            });

            await update(action, user, actionData);

            expect(stubs.updateActionModel).to.have.been.calledOnce;
            const callArgs = stubs.updateActionModel.firstCall.args;
            expect(callArgs[2]).to.equal(false);
        });
    });

    describe('gestion de la transaction', () => {
        it('démarre une transaction', async () => {
            await update(action, user, actionData);

            expect(stubs.sequelize.transaction).to.have.been.calledOnce;
        });

        it('commit la transaction en cas de succès', async () => {
            await update(action, user, actionData);

            expect(stubs.transaction.commit).to.have.been.calledOnce;
            expect(stubs.transaction.rollback).not.to.have.been.called;
        });

        it('rollback la transaction en cas d\'erreur lors de l\'update', async () => {
            stubs.updateActionModel.rejects(new Error('fake error'));

            let caughtError: ServiceError | null = null;
            try {
                await update(action, user, actionData);
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(stubs.transaction.rollback).to.have.been.calledOnce;
            expect(stubs.transaction.commit).not.to.have.been.called;
            expect(caughtError).to.be.instanceOf(ServiceError);
        });

        it('rollback la transaction en cas d\'erreur lors du fetch', async () => {
            stubs.fetchAction.rejects(new Error('fake error'));

            let caughtError: ServiceError | null = null;
            try {
                await update(action, user, actionData);
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(stubs.transaction.rollback).to.have.been.calledOnce;
            expect(stubs.transaction.commit).not.to.have.been.called;
            expect(caughtError).to.be.instanceOf(ServiceError);
        });
    });

    describe('mise à jour de l\'action', () => {
        it('appelle le modèle avec les bonnes données', async () => {
            await update(action, user, actionData);

            expect(stubs.updateActionModel).to.have.been.calledOnce;
            const callArgs = stubs.updateActionModel.firstCall.args;
            expect(callArgs[0]).to.equal(action.id);
            expect(callArgs[1]).to.deep.include({
                ...actionData,
                updated_by: user.id,
            });
        });

        it('récupère l\'action mise à jour', async () => {
            await update(action, user, actionData);

            expect(stubs.fetchAction).to.have.been.calledOnce;
            expect(stubs.fetchAction).to.have.been.calledWith(
                user,
                action.id,
                true,
                stubs.transaction,
            );
        });

        it('retourne l\'action mise à jour', async () => {
            const updatedAction = fakeAction({ name: 'Action mise à jour' });
            stubs.fetchAction.resolves(updatedAction);

            const result = await update(action, user, actionData);

            expect(result).to.deep.equal(updatedAction);
        });
    });

    describe('gestion des erreurs', () => {
        it('traduit les erreurs de contrainte unique d\'adresse en ServiceError', async () => {
            const uniqueError = new FakeUniqueConstraintError('uq__action_addresses__unique_address');
            stubs.updateActionModel.rejects(uniqueError);

            let caughtError: ServiceError | null = null;
            try {
                await update(action, user, actionData);
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('duplicate_action_address');
        });

        it('traduit les autres erreurs d\'update en ServiceError action_insert_error', async () => {
            stubs.updateActionModel.rejects(new Error('fake error'));

            let caughtError: ServiceError | null = null;
            try {
                await update(action, user, actionData);
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('action_insert_error');
        });

        it('propage les ServiceError lors du fetch', async () => {
            const serviceError = new ServiceError('custom_error', new Error('test'));
            stubs.fetchAction.rejects(serviceError);

            let caughtError: ServiceError | null = null;
            try {
                await update(action, user, actionData);
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(caughtError).to.equal(serviceError);
        });

        it('traduit les autres erreurs de fetch en ServiceError action_fetch_error', async () => {
            stubs.fetchAction.rejects(new Error('fake error'));

            let caughtError: ServiceError | null = null;
            try {
                await update(action, user, actionData);
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('action_fetch_error');
        });
    });
});
