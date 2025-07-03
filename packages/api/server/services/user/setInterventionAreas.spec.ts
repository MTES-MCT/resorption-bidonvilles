import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();
const sequelize = {
    transaction: sandbox.stub(),
};
const transaction = {
    commit: sandbox.stub(),
    rollback: sandbox.stub(),
};
const findOneUser = sandbox.stub();
const setOrganizationInterventionAreas = sandbox.stub();
const setUserInterventionAreas = sandbox.stub();

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/models/userModel/findOne').withDefault(findOneUser);
rewiremock('#server/models/organizationModel/setInterventionAreas').withDefault(setOrganizationInterventionAreas);
rewiremock('#server/models/userModel/setInterventionAreas').withDefault(setUserInterventionAreas);

rewiremock.enable();
// eslint-disable-next-line import/first, import/newline-after-import
import setInterventionAreas from './setInterventionAreas';
rewiremock.disable();

describe('services/user/setInterventionAreas', () => {
    beforeEach(() => {
        sequelize.transaction.resolves(transaction);
    });
    afterEach(() => {
        sandbox.reset();
    });

    it('change le territoire d\'intervention de la structure et de l\'utilisateur', async () => {
        await setInterventionAreas(
            fakeUser({ id: 1 }),
            fakeUser({ id: 42 }),
            [{ type: 'departement', code: '78' }],
            [{ type: 'city', code: '78000' }],
        );
        expect(setOrganizationInterventionAreas).to.have.been.calledOnce;
        expect(setUserInterventionAreas).to.have.been.calledOnce;
        expect(setOrganizationInterventionAreas).to.have.been.calledOnceWith(
            2, [{ type: 'departement', code: '78' }], transaction,
        );
        expect(setUserInterventionAreas).to.have.been.calledOnceWith(
            42, [{ type: 'city', code: '78000' }], transaction,
        );
    });

    it('retourne l\'utilisateur mis à jour', async () => {
        const user = fakeUser({ id: 1 });
        const userToUpdate = fakeUser({ id: 42 });
        const userUpdated = fakeUser({ id: 42000 });

        findOneUser.withArgs(42, { extended: true }, user, undefined, transaction).resolves(userUpdated);

        const response = await setInterventionAreas(
            user,
            userToUpdate,
            [{ type: 'nation', code: null }],
            [],
        );

        expect(response).to.be.eql(response);
    });

    it('exécute l\'ensemble des requêtes dans une transaction', async () => {
        await setInterventionAreas(
            fakeUser({ id: 1 }),
            fakeUser({ id: 42 }),
            [{ type: 'nation', code: null }],
            [],
        );

        expect(transaction.commit).to.have.been.calledOnce;
        expect(transaction.commit).to.have.been.calledAfter(findOneUser);
    });

    it('en cas d\'erreur, rollback la transaction', async () => {
        setOrganizationInterventionAreas.rejects(new Error('Test'));

        try {
            await setInterventionAreas(
                fakeUser({ id: 1 }),
                fakeUser({ id: 42 }),
                [{ type: 'nation', code: null }],
                [],
            );
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        expect(transaction.rollback).to.have.been.calledOnce;
    });

    it('en cas d\'erreur, lance un ServiceError', async () => {
        const originalError = new Error('test');
        setOrganizationInterventionAreas.rejects(originalError);

        let caughtError;
        try {
            await setInterventionAreas(
                fakeUser({ id: 1 }),
                fakeUser({ id: 42 }),
                [{ type: 'nation', code: null }],
                [],
            );
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.instanceOf(ServiceError);
        expect(caughtError.code).to.be.eql('database_error');
        expect(caughtError.nativeError).to.be.eql(originalError);
    });
});
