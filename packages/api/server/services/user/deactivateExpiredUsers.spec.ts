import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import rewiremock from 'rewiremock/node';
import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiAsPromised);

const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        transaction: sandbox.stub(),
    },
    userModel: {
        deactivateExpiredUsers: sandbox.stub(),
        findOne: sandbox.stub(),
    },
};

rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/models/userModel/index').with(stubs.userModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deactivateExpiredUsers from './deactivateExpiredUsers';
rewiremock.disable();

describe('userService.deactivate()', () => {
    let transaction;
    beforeEach(() => {
        transaction = {
            commit: sandbox.stub(),
            rollback: sandbox.stub(),
        };
        stubs.sequelize.transaction.withArgs().resolves(transaction);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('désactive les comptes utilisateurs expirés depuis plus de 3 mois', async () => {
        const user = fakeUser({ id: 42, status: 'new' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivateExpiredUsers.withArgs(transaction).resolves(1);

        const result = await deactivateExpiredUsers();

        expect(result).to.be.equal(1);
        expect(stubs.userModel.deactivateExpiredUsers).to.have.been.calledOnceWithExactly(transaction);
        expect(transaction.commit).to.have.been.calledOnce;
        expect(transaction.rollback).to.not.have.been.called;
    });

    it('renvoie 0 quand aucun compte utilisateur expiré depuis plus de 3 mois n\'est à désactiver', async () => {
        const user = fakeUser({ id: 42, status: 'new' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivateExpiredUsers.withArgs(transaction).resolves(0);

        const result = await deactivateExpiredUsers();

        expect(result).to.be.equal(0);
        expect(stubs.userModel.deactivateExpiredUsers).to.have.been.calledOnceWithExactly(transaction);
        expect(transaction.commit).to.have.been.calledOnce;
        expect(transaction.rollback).to.not.have.been.called;
    });

    it('lance une ServiceError en cas de problème lors de la désactivation des comptes utilisateurs expirés', async () => {
        const error = new Error('DB error');
        stubs.userModel.deactivateExpiredUsers.withArgs(transaction).rejects(error);

        try {
            await deactivateExpiredUsers();
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('deactivation_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });
});
