import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { buildActionData } from '#test/utils/actionInput';
import { ActionOperatorInput } from '#server/services/action/ActionInput.d';
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
    createActionModel: sandbox.stub(),
    fetchAction: sandbox.stub(),
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
rewiremock('#server/models/actionModel/create/create').with(stubs.createActionModel);
rewiremock('./write.fetchAction').with(stubs.fetchAction);
rewiremock('./operatorValidation').with(stubs.validateAndNormalizeOperators);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import create from './create';
rewiremock.disable();

describe('services/action.create()', () => {
    let user: ReturnType<typeof fakeUser>;

    beforeEach(() => {
        user = fakeUser();
        stubs.sequelize.transaction.resolves(stubs.transaction);
        stubs.createActionModel.resolves(42);
        stubs.fetchAction.resolves({ id: 42, name: 'Action test' });
        stubs.transaction.commit.resolves();
        stubs.transaction.rollback.resolves();
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
            const operators: ActionOperatorInput[] = [{ id: 1, organization_id: 10, is_principal: true }];
            await create(user, buildActionData(operators));

            expect(stubs.validateAndNormalizeOperators).to.have.been.calledOnce;
            expect(stubs.validateAndNormalizeOperators.firstCall.args[0]).to.equal(operators);
        });

        it('ne démarre pas de transaction si la validation échoue', async () => {
            const operators: ActionOperatorInput[] = [{ id: 1, organization_id: 10, is_principal: false }];
            stubs.validateAndNormalizeOperators.throws(new ServiceError('no_principal_operator', new Error('test')));

            let caughtError: ServiceError | null = null;
            try {
                await create(user, buildActionData(operators));
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(stubs.sequelize.transaction).not.to.have.been.called;
            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('no_principal_operator');
        });
    });

    describe('comportement nominal', () => {
        it('appelle le model createAction avec les données enrichies du created_by', async () => {
            const operators: ActionOperatorInput[] = [{ id: 1, organization_id: 10, is_principal: true }];
            await create(user, buildActionData(operators));

            expect(stubs.createActionModel).to.have.been.calledOnce;
            const calledData = stubs.createActionModel.firstCall.args[0];
            expect(calledData.created_by).to.equal(user.id);
        });

        it('commit la transaction après l\'insertion', async () => {
            const operators: ActionOperatorInput[] = [{ id: 1, organization_id: 10, is_principal: true }];
            await create(user, buildActionData(operators));

            expect(stubs.transaction.commit).to.have.been.calledOnce;
        });

        it('retourne l\'action récupérée après insertion', async () => {
            const fakeCreatedAction = { id: 42, name: 'Action test' };
            stubs.fetchAction.resolves(fakeCreatedAction);
            const operators: ActionOperatorInput[] = [{ id: 1, organization_id: 10, is_principal: true }];

            const result = await create(user, buildActionData(operators));

            expect(result).to.deep.equal(fakeCreatedAction);
        });

        it('rollback la transaction et lève ServiceError insert_action_error si le model échoue', async () => {
            const nativeError = new Error('db error');
            stubs.createActionModel.rejects(nativeError);
            const operators: ActionOperatorInput[] = [{ id: 1, organization_id: 10, is_principal: true }];

            let caughtError: ServiceError | null = null;
            try {
                await create(user, buildActionData(operators));
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(stubs.transaction.rollback).to.have.been.calledOnce;
            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('insert_action_error');
        });

        it('rollback la transaction et lève ServiceError action_fetch_error si le fetchAction échoue', async () => {
            const nativeError = new Error('fetch error');
            stubs.fetchAction.rejects(nativeError);
            const operators: ActionOperatorInput[] = [{ id: 1, organization_id: 10, is_principal: true }];

            let caughtError: ServiceError | null = null;
            try {
                await create(user, buildActionData(operators));
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(stubs.transaction.rollback).to.have.been.calledOnce;
            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('action_fetch_error');
        });
    });
});
