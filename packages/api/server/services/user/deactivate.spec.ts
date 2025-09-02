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
const stubs = {
    sequelize: {
        transaction: sandbox.stub(),
    },
    userModel: {
        deactivate: sandbox.stub(),
        findOne: sandbox.stub(),
    },
    mails: {
        sendUserDeactivationConfirmation: sandbox.stub(),
        sendUserDeactivationByAdminAlert: sandbox.stub(),
    },
    mattermost: {
        triggerNotifyNewUserSelfDeactivation: sandbox.stub(),
    },

};

rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/models/userModel/index').with(stubs.userModel);
rewiremock('#server/mails/mails').with(stubs.mails);
rewiremock('#server/utils/mattermost').with(stubs.mattermost);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deactivateUser from './deactivate';
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

    it('change le statut du compte à inactif en base de données', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, true, user);
        expect(stubs.userModel.deactivate).to.have.been.calledOnce;
        expect(stubs.userModel.deactivate).to.have.been.calledWith([42]);
    });

    it('retourne le compte désactivé', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);
        const expectedUser = { ...user, status: 'inactive' };

        const response = await deactivateUser(42, true, user);
        expect(response).to.be.eql(expectedUser);
    });

    it('exécute l\'ensemble des requêtes dans une transaction', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, true, user);
        expect(stubs.userModel.deactivate).to.have.been.calledWith([42], 'admin', false, transaction);
        expect(transaction.commit).to.have.been.calledOnce;
    });

    it('s\'il s\'agit d\'une auto-désactivation, envoie un mail de confirmation', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);
        const expectedUser = { ...user, status: 'inactive' };

        await deactivateUser(42, true, user);
        expect(stubs.mails.sendUserDeactivationConfirmation).to.have.been.calledOnce;
        expect(stubs.mails.sendUserDeactivationConfirmation).to.have.been.calledWith(expectedUser);
    });

    it('s\'il s\'agit d\'une auto-désactivation, n\'envoie pas un mail d\'alerte', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, true, user);
        expect(stubs.mails.sendUserDeactivationByAdminAlert).to.not.have.been.called;
    });

    it('s\'il s\'agit d\'une auto-désactivation, envoie une notification mattermost', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);
        const expectedUser = { ...user, status: 'inactive' };

        await deactivateUser(42, true, user);
        expect(stubs.mattermost.triggerNotifyNewUserSelfDeactivation).to.have.been.calledOnce;
        expect(stubs.mattermost.triggerNotifyNewUserSelfDeactivation).to.have.been.calledWith(expectedUser);
    });

    it('s\'il ne s\'agit PAS d\'une auto-désactivation, envoie un mail avec la raison de la désactivation', async () => {
        const user = fakeUser();
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);
        const expectedUser = { ...user, status: 'inactive' };

        await deactivateUser(42, false, user, 'raison de désactivation');
        expect(stubs.mails.sendUserDeactivationByAdminAlert).to.have.been.calledOnce;
        expect(stubs.mails.sendUserDeactivationByAdminAlert).to.have.been.calledWith(expectedUser, {
            variables: {
                reason: 'raison de désactivation',
            },
        });
    });

    it('envoie le mail d\'alerte de désactivation avec une raison par défaut si la raison est manquante', async () => {
        const user = fakeUser();
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);
        const expectedUser = { ...user, status: 'inactive' };

        await deactivateUser(42, false, user);
        expect(stubs.mails.sendUserDeactivationByAdminAlert).to.have.been.calledOnce;
        expect(stubs.mails.sendUserDeactivationByAdminAlert).to.have.been.calledWith(expectedUser, {
            variables: {
                reason: 'Aucune raison mentionnée',
            },
        });
    });

    it('s\'il ne s\'agit PAS d\'une auto-désactivation, n\'envoie pas un mail de confirmation', async () => {
        const user = fakeUser();
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, false, user, 'raison de désactivation');
        expect(stubs.mails.sendUserDeactivationConfirmation).to.not.have.been.called;
    });

    it('s\'il ne s\'agit PAS d\'une auto-désactivation, n\'envoie pas de notification mattermost', async () => {
        const user = fakeUser();
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, false, user);
        expect(stubs.mattermost.triggerNotifyNewUserSelfDeactivation).to.not.have.been.called;
    });

    it('ignore les erreurs de l\'envoi du mail de confirmation', async () => {
        const user = fakeUser();
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.mails.sendUserDeactivationConfirmation.rejects(new Error('test'));
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, true, user);
    });

    it('ignore les erreurs de l\'envoi de la notification mattermost', async () => {
        const user = fakeUser();
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.mattermost.triggerNotifyNewUserSelfDeactivation.rejects(new Error('test'));
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, true, user);
    });

    it('ignore les erreurs de l\'envoi du mail d\'alerte', async () => {
        const user = fakeUser();
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.mails.sendUserDeactivationByAdminAlert.rejects(new Error('test'));
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, false, user);
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('Erreur de mise à jour');
        stubs.userModel.deactivate.rejects(error);
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        try {
            await deactivateUser(42, true, user);
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
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.resolves(user);
        stubs.userModel.deactivate.rejects(error);

        try {
            await deactivateUser(42, true, user);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la recherche de l\'utilisateur, lance ServiceError', async () => {
        const error = new Error('utilisateur non trouvé');
        const user = fakeUser({ id: 42, status: 'inactive' });
        stubs.userModel.findOne.rejects(error);

        try {
            await deactivateUser(42, true, user);
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.message).to.equal('utilisateur non trouvé');
            expect(e.code).to.equal('user_search_failure');
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur de la recherche de l\'utilisateur, rollback la transaction', async () => {
        const error = new Error('test');
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.rejects(error);

        try {
            await deactivateUser(42, true, user);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });

    it('en cas d\'erreur dans la transaction, lance une ServiceError', async () => {
        const error = new Error('test');
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        transaction.commit.rejects(error);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        try {
            await deactivateUser(42, true, user);
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
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        transaction.commit.rejects(error);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        try {
            await deactivateUser(42, true, user);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            expect(transaction.rollback).to.have.been.called;
            return;
        }

        expect.fail('should have thrown an error');
    });
});
