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

// stubs
const sandbox = sinon.createSandbox();
const sequelize = {
    transaction: sandbox.stub(),
};
const userModel = {
    reactivate: sandbox.stub(),
    findOne: sandbox.stub(),
};
const mails = {
    sendUserReactivationAlert: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/models/userModel/index').with(userModel);
rewiremock('#server/mails/mails').with(mails);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import reactivateUser from './reactivate';
rewiremock.disable();

describe('userService.reactivate()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    let transaction;
    beforeEach(() => {
        transaction = {
            commit: sandbox.stub(),
            rollback: sandbox.stub(),
        };
        sequelize.transaction.withArgs().resolves(transaction);
    });

    it('change le statut du compte à \'active\' ou \'new\' en base de données', async () => {
        userModel.findOne.resolves(fakeUser());
        await reactivateUser(42);
        expect(userModel.reactivate).to.have.been.calledOnce;
        expect(userModel.reactivate).to.have.been.calledWith(42);
    });

    it('retourne le compte réactivé', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        userModel.findOne.withArgs(42).resolves(user);

        const response = await reactivateUser(42);
        expect(response).to.be.eql(user);
    });

    it('exécute l\'ensemble des requêtes dans une transaction', async () => {
        userModel.findOne.resolves(fakeUser());
        await reactivateUser(42);
        expect(userModel.reactivate).to.have.been.calledWith(42, transaction);
        expect(userModel.findOne).to.have.been.calledWith(42, {}, null, 'read', transaction);
        expect(transaction.commit).to.have.been.calledOnce;
    });

    it('si l\'utilisateur est passé en statut \'active\', envoie un mail spécifique', async () => {
        const user = fakeUser({ status: 'active' });
        userModel.findOne.withArgs(42).resolves(user);

        await reactivateUser(42);
        expect(mails.sendUserReactivationAlert).to.have.been.calledOnce;
        expect(mails.sendUserReactivationAlert).to.have.been.calledWith(user);
    });

    it('si l\'utilisateur est passé en statut \'new\', n\'envoie PAS de mail', async () => {
        const user = fakeUser({ status: 'new' });
        userModel.findOne.withArgs(42).resolves(user);

        await reactivateUser(42);
        expect(mails.sendUserReactivationAlert).to.not.have.been.called;
    });

    it('ignore les erreurs de l\'envoi du mail d\'alerte', async () => {
        const user = fakeUser({ status: 'active' });
        userModel.findOne.withArgs(42).resolves(user);
        mails.sendUserReactivationAlert.rejects(new Error('test'));

        await reactivateUser(42);
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('test');
        userModel.reactivate.rejects(error);

        try {
            await reactivateUser(42);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('reactivation_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, rollback', async () => {
        const error = new Error('test');
        userModel.reactivate.rejects(error);

        try {
            await reactivateUser(42);
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la recherche de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('test');
        userModel.findOne.rejects(error);

        try {
            await reactivateUser(42);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('refresh_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la recherche de l\'utilisateur, rollback la transaction', async () => {
        const error = new Error('test');
        userModel.findOne.rejects(error);

        try {
            await reactivateUser(42);
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la transaction, lance une ServiceError', async () => {
        const error = new Error('test');
        transaction.commit.rejects(error);

        try {
            await reactivateUser(42);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('transaction_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la transaction, rollback', async () => {
        const error = new Error('test');
        transaction.commit.rejects(error);

        try {
            await reactivateUser(42);
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });
});