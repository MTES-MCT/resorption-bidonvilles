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
    userModel: {
        findOne: sandbox.stub(),
        deactivate: sandbox.stub(),
    },
    mails: {
        sendUserDeactivationConfirmation: sandbox.stub().resolves(),
        sendUserDeactivationByAdminAlert: sandbox.stub().resolves(),
    },
    mattermost: {
        triggerNotifyNewUserSelfDeactivation: sandbox.stub(),
    },
    agenda: {
        jobs: sandbox.stub().resolves([]),
        cancel: sandbox.stub().resolves(0),
    },
    sequelize: {
        transaction: sandbox.stub().callsFake(async (callback) => {
            const transaction = {
                commit: sandbox.stub().resolves(),
                rollback: sandbox.stub().resolves(),
            };
            try {
                const result = await callback(transaction);
                await transaction.commit();
                return result;
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        }),
    },
};

rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/models/userModel/index').with(stubs.userModel);
rewiremock('#server/mails/mails').with(stubs.mails);
rewiremock('#server/utils/mattermost').with(stubs.mattermost);
rewiremock('#server/loaders/agendaLoader').with(() => stubs.agenda);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deactivateUser from './deactivate';
rewiremock.disable();

describe('userService.deactivate()', () => {
    let transaction;
    beforeEach(() => {
        sandbox.reset();
        transaction = {
            commit: sandbox.stub().resolves(),
            rollback: sandbox.stub().resolves(),
        };

        stubs.sequelize.transaction = sandbox.stub().resolves(transaction);
    });
    afterEach(() => {
        sandbox.reset();
    });

    it('change le statut du compte à inactif en base de données', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        stubs.userModel.deactivate.withArgs([42], 'admin', false, transaction).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, false, user);

        expect(stubs.sequelize.transaction).to.have.been.calledOnce;
        expect(stubs.userModel.deactivate).to.have.been.calledWith([42], 'admin', false, transaction);
        expect(transaction.commit).to.have.been.calledOnce;
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
        const error = new Error('Échec d\'envoi du mail de confirmation');
        error.stack = undefined; // Supprime la stack trace
        stubs.mails.sendUserDeactivationConfirmation.rejects(error);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, true, user);
    });

    it('ignore les erreurs de l\'envoi de la notification mattermost', async () => {
        const user = fakeUser();
        stubs.userModel.findOne.withArgs(42).resolves(user);
        const error = new Error('Échec d\'envoi de la notification Mattermost');
        error.stack = undefined; // Supprime la stack trace
        stubs.mattermost.triggerNotifyNewUserSelfDeactivation.rejects(error);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, true, user);
    });

    it('ignore les erreurs de l\'envoi du mail d\'alerte', async () => {
        const user = fakeUser();
        stubs.userModel.findOne.withArgs(42).resolves(user);
        const error = new Error('Échec d\'envoi du mail d\'alerte');
        error.stack = undefined; // Supprime la stack trace
        stubs.mails.sendUserDeactivationByAdminAlert.rejects(error);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        await deactivateUser(42, false, user);
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, lance une ServiceError', async () => {
        const error = new Error('Erreur de mise à jour');
        error.stack = undefined; // Supprime la stack trace
        stubs.userModel.deactivate.rejects(error);
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        try {
            await deactivateUser(42, true, user);
            expect.fail('should have thrown an error');
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('deactivation_failure');
            expect(e.nativeError.message).to.equal('Erreur de mise à jour');
        }
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, rollback la transaction', async () => {
        const error = new Error('Erreur lors de la désactivation de l\'utilisateur');
        error.stack = undefined; // Supprime la stack trace
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.resolves(user);
        stubs.userModel.deactivate.rejects(error);

        try {
            await deactivateUser(42, true, user);
            expect.fail('should have thrown an error');
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
        }
    });

    it('en cas d\'erreur de la recherche de l\'utilisateur, ne crée pas de transaction', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        const error = new Error('test');

        // Simuler que findOne échoue
        stubs.userModel.findOne.rejects(error);

        try {
            await deactivateUser(42, true, user);
            expect.fail('should have thrown an error');
        } catch (e) {
            // Vérifier que findOne a été appelé avec le bon ID
            expect(stubs.userModel.findOne).to.have.been.calledWith(42);
            // Vérifier qu'aucune transaction n'a été créée
            expect(stubs.sequelize.transaction).to.not.have.been.called;
        }
    });

    it('en cas d\'erreur de la modification de l\'utilisateur, rollback la transaction', async () => {
        const user = fakeUser({ id: 42, status: 'active' });
        const error = new Error('test');

        // Simulate successful user find
        stubs.userModel.findOne.withArgs(42).resolves(user);

        // Simulate error during deactivation
        stubs.userModel.deactivate.rejects(error);

        try {
            await deactivateUser(42, true, user);
            expect.fail('should have thrown an error');
        } catch (e) {
            // Verify transaction was created
            expect(stubs.sequelize.transaction).to.have.been.calledOnce;
            // Verify rollback was called
            expect(transaction.rollback).to.have.been.calledOnce;
        }
    });

    it('en cas d\'erreur dans la transaction, lance une ServiceError', async () => {
        const error = new Error('Échec de la transaction');
        error.stack = undefined; // Supprime la stack trace
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        transaction.commit.rejects(error);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        try {
            await deactivateUser(42, true, user);
            expect.fail('should have thrown an error');
        } catch (e) {
            expect(e).to.be.an.instanceof(ServiceError);
            expect(e.code).to.be.equal('transaction_failure');
            expect(e.nativeError.message).to.equal('Échec de la transaction');
        }
    });

    it('en cas d\'erreur dans la transaction, rollback', async () => {
        const error = new Error('Échec de la transaction');
        error.stack = undefined; // Supprime la stack trace
        const user = fakeUser({ id: 42, status: 'active' });
        stubs.userModel.findOne.withArgs(42).resolves(user);
        transaction.commit.rejects(error);
        stubs.userModel.deactivate.withArgs([42]).resolves([{ user_id: 42, fk_status: 'inactive' }]);

        try {
            await deactivateUser(42, true, user);
            expect.fail('should have thrown an error');
        } catch (e) {
            expect(transaction.rollback).to.have.been.called;
        }
    });
});
