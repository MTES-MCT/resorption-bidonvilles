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
    deactivate: sandbox.stub(),
    findOne: sandbox.stub(),
};
const mails = {
    sendUserDeactivationConfirmation: sandbox.stub(),
    sendUserDeactivationByAdminAlert: sandbox.stub(),
};
const mattermost = {
    triggerNotifyNewUserSelfDeactivation: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/models/userModel/index').with(userModel);
rewiremock('#server/mails/mails').with(mails);
rewiremock('#server/utils/mattermost').with(mattermost);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deactivateUser from './deactivate';
rewiremock.disable();

describe('userService.deactivate()', () => {
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

    it('change le statut du compte à inactif en base de données', async () => {
        await deactivateUser(42, true);
        expect(userModel.deactivate).to.have.been.calledOnce;
        expect(userModel.deactivate).to.have.been.calledWith([42]);
    });

    it('retourne le compte désactivé', async () => {
        const user = fakeUser({ id: 42, status: 'inactive' });
        userModel.findOne.withArgs(42).resolves(user);

        const response = await deactivateUser(42, true);
        expect(response).to.be.eql(user);
    });

    it('exécute l\'ensemble des requêtes dans une transaction', async () => {
        // ([id], 'admin', anonymizationRequested, transaction)
        await deactivateUser(42, true);
        expect(userModel.deactivate).to.have.been.calledWith([42], 'admin', false, transaction);
        expect(userModel.findOne).to.have.been.calledWith(42, {}, null, 'deactivate', transaction);
        expect(transaction.commit).to.have.been.calledOnce;
    });

    it('s\'il s\'agit d\'une auto-désactivation, envoie un mail de confirmation', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);

        await deactivateUser(42, true);
        expect(mails.sendUserDeactivationConfirmation).to.have.been.calledOnce;
        expect(mails.sendUserDeactivationConfirmation).to.have.been.calledWith(user);
    });

    it('s\'il s\'agit d\'une auto-désactivation, n\'envoie pas un mail d\'alerte', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);

        await deactivateUser(42, true);
        expect(mails.sendUserDeactivationByAdminAlert).to.not.have.been.called;
    });

    it('s\'il s\'agit d\'une auto-désactivation, envoie une notification mattermost', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);

        await deactivateUser(42, true);
        expect(mattermost.triggerNotifyNewUserSelfDeactivation).to.have.been.calledOnce;
        expect(mattermost.triggerNotifyNewUserSelfDeactivation).to.have.been.calledWith(user);
    });

    it('s\'il ne s\'agit PAS d\'une auto-désactivation, envoie un mail avec la raison de la désactivation', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);

        await deactivateUser(42, false, 'raison de désactivation');
        expect(mails.sendUserDeactivationByAdminAlert).to.have.been.calledOnce;
        expect(mails.sendUserDeactivationByAdminAlert).to.have.been.calledWith(user, {
            variables: {
                reason: 'raison de désactivation',
            },
        });
    });

    it('envoie le mail d\'alerte de désactivation avec une raison par défaut si la raison est manquante', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);

        await deactivateUser(42, false);
        expect(mails.sendUserDeactivationByAdminAlert).to.have.been.calledOnce;
        expect(mails.sendUserDeactivationByAdminAlert).to.have.been.calledWith(user, {
            variables: {
                reason: 'Aucune raison mentionnée',
            },
        });
    });

    it('s\'il ne s\'agit PAS d\'une auto-désactivation, n\'envoie pas un mail de confirmation', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);

        await deactivateUser(42, false, 'raison de désactivation');
        expect(mails.sendUserDeactivationConfirmation).to.not.have.been.called;
    });

    it('s\'il ne s\'agit PAS d\'une auto-désactivation, n\'envoie pas de notification mattermost', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);

        await deactivateUser(42, false);
        expect(mattermost.triggerNotifyNewUserSelfDeactivation).to.not.have.been.called;
    });

    it('ignore les erreurs de l\'envoi du mail de confirmation', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);
        mails.sendUserDeactivationConfirmation.rejects(new Error('test'));

        await deactivateUser(42, true);
    });

    it('ignore les erreurs de l\'envoi de la notification mattermost', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);
        mattermost.triggerNotifyNewUserSelfDeactivation.rejects(new Error('test'));

        await deactivateUser(42, true);
    });

    it('ignore les erreurs de l\'envoi du mail d\'alerte', async () => {
        const user = fakeUser();
        userModel.findOne.withArgs(42).resolves(user);
        mails.sendUserDeactivationByAdminAlert.rejects(new Error('test'));

        await deactivateUser(42, false);
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('test');
        userModel.deactivate.rejects(error);

        try {
            await deactivateUser(42, true);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('deactivation_failure');
            expect(e.nativeError).to.be.equal(error);
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, rollback la transaction', async () => {
        const error = new Error('test');
        userModel.deactivate.rejects(error);

        try {
            await deactivateUser(42, true);
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
            await deactivateUser(42, true);
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
            await deactivateUser(42, true);
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
            await deactivateUser(42, true);
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
            await deactivateUser(42, true);
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });
});
