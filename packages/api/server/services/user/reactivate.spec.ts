import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { rewiremock } from '#test/rewiremock';
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
const reactivate = sandbox.stub();
const findOneUser = sandbox.stub();
const sendActivationLink = sandbox.stub();
const mails = {
    sendUserReactivationAlert: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/models/userModel/reactivate').with(reactivate);
rewiremock('#server/models/userModel/findOne').with(findOneUser);
rewiremock('#server/services/user/sendActivationLink').with(sendActivationLink);
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
        findOneUser.resolves(fakeUser());
        await reactivateUser(fakeUser(), 42);
        expect(reactivate).to.have.been.calledOnce;
        expect(reactivate).to.have.been.calledWith(42);
    });

    it('retourne le compte réactivé', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        findOneUser.withArgs(42).resolves(user);

        const response = await reactivateUser(fakeUser(), 42);
        expect(response).to.be.eql(user);
    });

    it('exécute l\'ensemble des requêtes dans une transaction', async () => {
        findOneUser.resolves(fakeUser());
        await reactivateUser(fakeUser(), 42);
        expect(reactivate).to.have.been.calledWith(42, transaction);
        expect(findOneUser).to.have.been.calledWith(42, { extended: true }, null, 'read', transaction);
        expect(transaction.commit).to.have.been.calledOnce;
    });

    it('si l\'utilisateur est passé en statut \'active\', envoie un mail spécifique', async () => {
        const user = fakeUser({ status: 'active' });
        findOneUser.withArgs(42).resolves(user);

        await reactivateUser(fakeUser(), 42);
        expect(mails.sendUserReactivationAlert).to.have.been.calledOnce;
        expect(mails.sendUserReactivationAlert).to.have.been.calledWith(user);
        expect(sendActivationLink).to.not.have.been.called;
    });

    it('si l\'utilisateur est passé en statut \'new\', envoie un accès à l\'utilisateur', async () => {
        const activator = fakeUser({ id: 1 });
        const user = fakeUser({ status: 'new', permission_options: ['access_justice'] });
        findOneUser.withArgs(42).resolves(user);

        await reactivateUser(activator, 42);
        expect(mails.sendUserReactivationAlert).to.not.have.been.called;
        expect(sendActivationLink).to.have.been.calledOnceWith(
            activator,
            user,
            ['access_justice'],
            transaction,
        );
    });

    it('si l\'utilisateur est passé en statut \'new\', retourne l\'utilisateur mis à jour', async () => {
        const activator = fakeUser({ id: 1 });
        const user = fakeUser({ id: 42, status: 'new', permission_options: ['access_justice'] });
        const updatedUser = fakeUser({ id: 423, status: 'new', permission_options: ['access_justice'] });
        findOneUser.withArgs(42).onFirstCall().resolves(user);
        findOneUser.withArgs(42).onSecondCall().resolves(updatedUser);

        expect(await reactivateUser(activator, 42)).to.be.eql(updatedUser);
    });

    it('ignore les erreurs de l\'envoi du mail d\'alerte', async () => {
        const user = fakeUser({ status: 'active' });
        findOneUser.withArgs(42).resolves(user);
        mails.sendUserReactivationAlert.rejects(new Error('test'));

        await reactivateUser(fakeUser(), 42);
    });

    it('en cas d\'erreur de l\'envoi d\'un accès, lance une ServiceError', async () => {
        findOneUser.resolves(fakeUser({
            status: 'new',
        }));

        const error = new Error('test');
        sendActivationLink.rejects(error);

        try {
            await reactivateUser(fakeUser(), 42);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('send_access_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de l\'envoi d\'un accès, rollback', async () => {
        findOneUser.resolves(fakeUser({
            status: 'new',
        }));

        const error = new Error('test');
        sendActivationLink.rejects(error);

        try {
            await reactivateUser(fakeUser(), 42);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('test');
        reactivate.rejects(error);

        try {
            await reactivateUser(fakeUser(), 42);
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
        reactivate.rejects(error);

        try {
            await reactivateUser(fakeUser(), 42);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la recherche de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('test');
        findOneUser.rejects(error);

        try {
            await reactivateUser(fakeUser(), 42);
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
        findOneUser.rejects(error);

        try {
            await reactivateUser(fakeUser(), 42);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la transaction, lance une ServiceError', async () => {
        findOneUser.resolves(fakeUser());

        const error = new Error('test');
        transaction.commit.rejects(error);

        try {
            await reactivateUser(fakeUser(), 42);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('transaction_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la transaction, rollback', async () => {
        findOneUser.resolves(fakeUser());

        const error = new Error('test');
        transaction.commit.rejects(error);

        try {
            await reactivateUser(fakeUser(), 42);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });
});
