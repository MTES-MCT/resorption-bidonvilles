import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import { buildActionData as buildBaseActionData, ActionInputOperator } from '#test/utils/actionInput';
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
    validateAndNormalizeOperators: sandbox.stub(),
};

class FakeUniqueConstraintError extends Error {
    parent: { constraint?: string };

    constructor(message: string, parent: { constraint?: string } = {}) {
        super(message);
        this.parent = parent;
    }
}

rewiremock('sequelize').with({ UniqueConstraintError: FakeUniqueConstraintError });
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/models/actionModel/update/update').with(stubs.updateActionModel);
rewiremock('./write.fetchAction').with(stubs.fetchAction);
rewiremock('#server/utils/permission/can').with(stubs.can);
rewiremock('./operatorValidation').with(stubs.validateAndNormalizeOperators);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import update from './update';
rewiremock.disable();

const buildActionData = (operators: ActionInputOperator[]) => buildBaseActionData(operators, {
    name: 'Action modifiée',
    goals: 'Objectif modifié',
});

describe('services/action.update()', () => {
    let user: ReturnType<typeof fakeUser>;
    const action = fakeAction();

    beforeEach(() => {
        user = fakeUser();
        stubs.sequelize.transaction.resolves(stubs.transaction);
        stubs.updateActionModel.resolves();
        stubs.fetchAction.resolves({ id: action.id, name: 'Action modifiée' });
        stubs.transaction.commit.resolves();
        stubs.transaction.rollback.resolves();
        stubs.can.returns({
            do: () => ({
                on: () => false,
            }),
        });
        stubs.validateAndNormalizeOperators.returns(undefined);
    });

    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    describe('wiring de la validation des opérateurs', () => {
        it('appelle validateAndNormalizeOperators avec les opérateurs reçus', async () => {
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];
            await update(action, user, buildActionData(operators));

            expect(stubs.validateAndNormalizeOperators).to.have.been.calledOnce;
            expect(stubs.validateAndNormalizeOperators.firstCall.args[0]).to.equal(operators);
        });

        it('ne démarre pas de transaction si la validation échoue', async () => {
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: false }];
            stubs.validateAndNormalizeOperators.throws(new ServiceError('no_principal_operator', new Error('test')));

            let caughtError: ServiceError | null = null;
            try {
                await update(action, user, buildActionData(operators));
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(stubs.sequelize.transaction).not.to.have.been.called;
            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('no_principal_operator');
        });
    });

    describe('comportement nominal', () => {
        it('appelle le model update avec l\'id de l\'action et les données enrichies du updated_by', async () => {
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];
            await update(action, user, buildActionData(operators));

            expect(stubs.updateActionModel).to.have.been.calledOnce;
            const [calledId, calledData] = stubs.updateActionModel.firstCall.args;
            expect(calledId).to.equal(action.id);
            expect(calledData.updated_by).to.equal(user.id);
        });

        it('commit la transaction après la mise à jour', async () => {
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];
            await update(action, user, buildActionData(operators));

            expect(stubs.transaction.commit).to.have.been.calledOnce;
        });

        it('retourne l\'action récupérée après mise à jour', async () => {
            const fakeUpdatedAction = { id: action.id, name: 'Action modifiée' };
            stubs.fetchAction.resolves(fakeUpdatedAction);
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];

            const result = await update(action, user, buildActionData(operators));

            expect(result).to.deep.equal(fakeUpdatedAction);
        });

        it('rollback la transaction et lève ServiceError action_insert_error si le model update échoue', async () => {
            const nativeError = new Error('db error');
            stubs.updateActionModel.rejects(nativeError);
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];

            let caughtError: ServiceError | null = null;
            try {
                await update(action, user, buildActionData(operators));
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(stubs.transaction.rollback).to.have.been.calledOnce;
            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('action_insert_error');
        });

        it('rollback la transaction et lève ServiceError action_fetch_error si le fetchAction échoue', async () => {
            const nativeError = new Error('fetch error');
            stubs.fetchAction.rejects(nativeError);
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];

            let caughtError: ServiceError | null = null;
            try {
                await update(action, user, buildActionData(operators));
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(stubs.transaction.rollback).to.have.been.calledOnce;
            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('action_fetch_error');
        });
    });
});
