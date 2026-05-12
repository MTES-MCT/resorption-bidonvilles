import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
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
rewiremock('./operatorValidation').callThrough();

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import create from './create';
rewiremock.disable();

type ActionInputOperator = {
    id: number,
    organization_id: number,
    is_principal?: boolean,
};

function buildActionData(operators: ActionInputOperator[]) {
    return {
        name: 'Action test',
        started_at: new Date(2024, 0, 1),
        ended_at: null,
        topics: ['health'],
        goals: 'Objectif test',
        location: {
            type: 'departement' as const,
            city: null,
            epci: null,
            departement: { code: '78', name: 'Yvelines' },
            region: { code: '11', name: 'Île-De-France' },
        },
        location_departement: '78',
        location_type: 'logement' as const,
        location_eti_addresses: null,
        location_shantytowns: null,
        location_autre: null,
        managers: [{ id: 1, organization_id: 10 }],
        operators,
        indicateurs: {},
    };
}

describe('services/action.create()', () => {
    let user: ReturnType<typeof fakeUser>;

    beforeEach(() => {
        user = fakeUser();
        stubs.sequelize.transaction.resolves(stubs.transaction);
        stubs.createActionModel.resolves(42);
        stubs.fetchAction.resolves({ id: 42, name: 'Action test' });
        stubs.transaction.commit.resolves();
        stubs.transaction.rollback.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    describe('logique is_principal sur les operators', () => {
        it('force is_principal=true sur l\'unique opérateur si la liste contient un seul élément sans is_principal', async () => {
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10 }];
            await create(user, buildActionData(operators));

            expect(stubs.createActionModel).to.have.been.calledOnce;
            const calledData = stubs.createActionModel.firstCall.args[0];
            expect(calledData.operators[0].is_principal).to.equal(true);
        });

        it('passe la liste telle quelle au model en cas de multi-opérateurs avec principals explicites', async () => {
            const operators: ActionInputOperator[] = [
                { id: 1, organization_id: 10, is_principal: true },
                { id: 2, organization_id: 20, is_principal: false },
            ];
            await create(user, buildActionData(operators));

            expect(stubs.createActionModel).to.have.been.calledOnce;
            const calledData = stubs.createActionModel.firstCall.args[0];
            expect(calledData.operators).to.deep.equal(operators);
        });

        it('lève ServiceError no_principal_operator si aucun opérateur n\'est principal sur une liste de taille ≥ 2', async () => {
            const operators: ActionInputOperator[] = [
                { id: 1, organization_id: 10, is_principal: false },
                { id: 2, organization_id: 20, is_principal: false },
            ];

            let caughtError: ServiceError | null = null;
            try {
                await create(user, buildActionData(operators));
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('no_principal_operator');
            expect(caughtError?.nativeError).to.be.instanceOf(Error);
        });

        it('n\'appelle pas le model create si aucun opérateur n\'est principal sur une liste de taille ≥ 2', async () => {
            const operators: ActionInputOperator[] = [
                { id: 1, organization_id: 10, is_principal: false },
                { id: 2, organization_id: 20, is_principal: false },
            ];

            try {
                await create(user, buildActionData(operators));
            } catch (_err) {
                // erreur attendue
            }

            expect(stubs.createActionModel).not.to.have.been.called;
        });

        it('ne démarre pas de transaction si aucun opérateur n\'est principal sur une liste de taille ≥ 2', async () => {
            const operators: ActionInputOperator[] = [
                { id: 1, organization_id: 10, is_principal: false },
                { id: 2, organization_id: 20, is_principal: false },
            ];

            try {
                await create(user, buildActionData(operators));
            } catch (_err) {
                // erreur attendue
            }

            expect(stubs.transaction.commit).not.to.have.been.called;
            expect(stubs.transaction.rollback).not.to.have.been.called;
        });

        it('lève ServiceError multiple_principal_operators si plus d\'un opérateur est principal', async () => {
            const operators: ActionInputOperator[] = [
                { id: 1, organization_id: 10, is_principal: true },
                { id: 2, organization_id: 20, is_principal: true },
            ];

            let caughtError: ServiceError | null = null;
            try {
                await create(user, buildActionData(operators));
            } catch (err) {
                caughtError = err as ServiceError;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError?.code).to.equal('multiple_principal_operators');
            expect(caughtError?.nativeError).to.be.instanceOf(Error);
        });

        it('n\'appelle pas le model create si plus d\'un opérateur est principal', async () => {
            const operators: ActionInputOperator[] = [
                { id: 1, organization_id: 10, is_principal: true },
                { id: 2, organization_id: 20, is_principal: true },
            ];

            try {
                await create(user, buildActionData(operators));
            } catch (_err) {
                // erreur attendue
            }

            expect(stubs.createActionModel).not.to.have.been.called;
        });

        it('ne commit pas et ne rollback pas si plus d\'un opérateur est principal (aucune transaction ouverte)', async () => {
            const operators: ActionInputOperator[] = [
                { id: 1, organization_id: 10, is_principal: true },
                { id: 2, organization_id: 20, is_principal: true },
            ];

            try {
                await create(user, buildActionData(operators));
            } catch (_err) {
                // erreur attendue
            }

            expect(stubs.transaction.commit).not.to.have.been.called;
            expect(stubs.transaction.rollback).not.to.have.been.called;
        });

        it('passe la liste vide telle quelle au model sans erreur', async () => {
            const operators: ActionInputOperator[] = [];
            await create(user, buildActionData(operators));

            expect(stubs.createActionModel).to.have.been.calledOnce;
            const calledData = stubs.createActionModel.firstCall.args[0];
            expect(calledData.operators).to.deep.equal([]);
        });
    });

    describe('comportement nominal', () => {
        it('appelle le model createAction avec les données enrichies du created_by', async () => {
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];
            await create(user, buildActionData(operators));

            expect(stubs.createActionModel).to.have.been.calledOnce;
            const calledData = stubs.createActionModel.firstCall.args[0];
            expect(calledData.created_by).to.equal(user.id);
        });

        it('commit la transaction après l\'insertion', async () => {
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];
            await create(user, buildActionData(operators));

            expect(stubs.transaction.commit).to.have.been.calledOnce;
        });

        it('retourne l\'action récupérée après insertion', async () => {
            const fakeCreatedAction = { id: 42, name: 'Action test' };
            stubs.fetchAction.resolves(fakeCreatedAction);
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];

            const result = await create(user, buildActionData(operators));

            expect(result).to.deep.equal(fakeCreatedAction);
        });

        it('rollback la transaction et lève ServiceError insert_action_error si le model échoue', async () => {
            const nativeError = new Error('db error');
            stubs.createActionModel.rejects(nativeError);
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];

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
            const operators: ActionInputOperator[] = [{ id: 1, organization_id: 10, is_principal: true }];

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
