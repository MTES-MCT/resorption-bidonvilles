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

const userModel = {
    findOne: sandbox.stub(),
    update: sandbox.stub(),
};
const setPassword = sandbox.stub();

rewiremock('#server/models/userModel').with(userModel);
rewiremock('./setPassword').withDefault(setPassword);

rewiremock.enable();
// eslint-disable-next-line import/first, import/newline-after-import
import update from './update';
rewiremock.disable();

describe('services/user/update', () => {
    beforeEach(() => {
        // Par défaut, findOne renvoie un utilisateur valide
        userModel.findOne.resolves(fakeUser({ id: 42 }));
        // Par défaut, update réussit
        userModel.update.resolves();
        // Par défaut, setPassword réussit
        setPassword.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    // -------------------------------------------------------------------------
    // Cas : utilisateur introuvable
    // -------------------------------------------------------------------------
    describe('quand l\'utilisateur n\'existe pas', () => {
        it('lance un ServiceError unknown_user', async () => {
            userModel.findOne.resolves(null);

            let caughtError;
            try {
                await update(99, { first_name: 'Jean' });
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError.code).to.equal('unknown_user');
        });
    });

    // -------------------------------------------------------------------------
    // Update SANS mot de passe
    // -------------------------------------------------------------------------
    describe('update sans mot de passe', () => {
        it('appelle userModel.update avec les données filtrées (sans password)', async () => {
            await update(42, { first_name: 'Jean', last_name: 'Dupont' });

            expect(userModel.update).to.have.been.calledOnce;
            expect(userModel.update).to.have.been.calledWith(42, {
                first_name: 'Jean',
                last_name: 'Dupont',
            });
        });

        it('n\'appelle pas setPassword', async () => {
            await update(42, { first_name: 'Jean' });

            expect(setPassword).to.not.have.been.called;
        });

        it('filtre les valeurs undefined avant la mise à jour', async () => {
            await update(42, { first_name: 'Jean', last_name: undefined, phone: undefined });

            expect(userModel.update).to.have.been.calledWith(42, { first_name: 'Jean' });
        });

        it('retourne les données mises à jour sans le champ password', async () => {
            const result = await update(42, { first_name: 'Marie', last_name: 'Curie' });

            expect(result).to.deep.equal({ first_name: 'Marie', last_name: 'Curie' });
            expect(result).to.not.have.property('password');
        });

        it('retire email_unsubscriptions du résultat retourné', async () => {
            const result = await update(42, {
                first_name: 'Jean',
                email_unsubscriptions: ['newsletter'],
            });

            expect(result).to.not.have.property('email_unsubscriptions');
        });

        it('lance un ServiceError update_failed si userModel.update échoue', async () => {
            userModel.update.rejects(new Error('DB error'));

            let caughtError;
            try {
                await update(42, { first_name: 'Jean' });
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError.code).to.equal('update_failed');
        });
    });

    // -------------------------------------------------------------------------
    // Update AVEC mot de passe
    // -------------------------------------------------------------------------
    describe('update avec mot de passe', () => {
        it('appelle setPassword avec le password en clair, l\'userId et l\'user chargé', async () => {
            const user = fakeUser({ id: 42 });
            userModel.findOne.resolves(user);

            await update(42, { first_name: 'Jean', password: 'MonMotD3Passe!' });

            expect(setPassword).to.have.been.calledOnce;
            expect(setPassword).to.have.been.calledWith('MonMotD3Passe!', 42, user);
        });

        it('ne transmet pas le password à userModel.update', async () => {
            await update(42, { first_name: 'Jean', password: 'MonMotD3Passe!' });

            const callArgs = userModel.update.firstCall.args[1];
            expect(callArgs).to.not.have.property('password');
        });

        it('ne retourne pas le password dans le résultat', async () => {
            const result = await update(42, { first_name: 'Jean', password: 'MonMotD3Passe!' });

            expect(result).to.not.have.property('password');
        });

        it('appelle quand même userModel.update après le changement de mot de passe', async () => {
            await update(42, { first_name: 'Jean', password: 'MonMotD3Passe!' });

            expect(setPassword).to.have.been.calledBefore(userModel.update);
            expect(userModel.update).to.have.been.calledOnce;
        });

        // -----------------------------------------------------------------------
        // Vérification niveau Keycloak (via setPassword)
        // -----------------------------------------------------------------------
        describe('vérification niveau Keycloak', () => {
            it('lance un ServiceError update_failed si setPassword (Keycloak) échoue', async () => {
                setPassword.rejects(new Error('Keycloak unreachable'));

                let caughtError;
                try {
                    await update(42, { password: 'MonMotD3Passe!' });
                } catch (error) {
                    caughtError = error;
                }

                expect(caughtError).to.be.instanceOf(ServiceError);
                expect(caughtError.code).to.equal('update_failed');
            });

            it('le message d\'erreur indique un problème de mise à jour du mot de passe', async () => {
                setPassword.rejects(new Error('Keycloak unreachable'));

                let caughtError;
                try {
                    await update(42, { password: 'MonMotD3Passe!' });
                } catch (error) {
                    caughtError = error;
                }

                expect(caughtError.nativeError.message).to.include('mot de passe');
            });

            it('n\'appelle pas userModel.update si Keycloak échoue', async () => {
                setPassword.rejects(new Error('Keycloak unreachable'));

                try {
                    await update(42, { password: 'MonMotD3Passe!' });
                } catch {
                    // erreur attendue
                }

                expect(userModel.update).to.not.have.been.called;
            });
        });
    });
});
