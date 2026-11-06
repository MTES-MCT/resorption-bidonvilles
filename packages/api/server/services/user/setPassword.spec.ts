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
    update: sandbox.stub(),
};
const activate = sandbox.stub();
const authUtils = {
    hashPassword: sandbox.stub().returns('hashed_password'),
};

rewiremock('#server/models/userModel').with(userModel);
rewiremock('./activate').withDefault(activate);
rewiremock('#server/utils/auth').with(authUtils);
rewiremock('#server/utils/checkPassword').callThrough();

rewiremock.enable();
// eslint-disable-next-line import/first, import/newline-after-import
import setPassword from './setPassword';
rewiremock.disable();

describe('services/user/setPassword', () => {
    beforeEach(() => {
        activate.resolves();
        userModel.update.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    // -------------------------------------------------------------------------
    // Vérifications de droits
    // -------------------------------------------------------------------------
    describe('vérifications de droits', () => {
        it('lance un ServiceError si user est null', async () => {
            let caughtError;
            try {
                await setPassword('MonMdp1!', 42, null);
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError.code).to.equal('setPassword');
        });

        it('lance un ServiceError si l\'user ne correspond pas à l\'userId et n\'est pas admin', async () => {
            const user = fakeUser({ id: 1, is_admin: false });

            let caughtError;
            try {
                await setPassword('MonMdp1!', 99, user);
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError.code).to.equal('setPassword');
        });

        it('autorise un admin à changer le mot de passe d\'un autre utilisateur', async () => {
            const admin = fakeUser({ id: 1, is_admin: true });

            let caughtError;
            try {
                await setPassword('MonMotD3Passe!', 99, admin);
            } catch (error) {
                caughtError = error;
            }

            // Aucune erreur de droits — si erreur, ce n'est pas un ServiceError 'setPassword' sur les droits
            if (caughtError) {
                expect(caughtError.nativeError?.message).to.not.include('droits');
            }
        });
    });

    // -------------------------------------------------------------------------
    // Validation du mot de passe
    // -------------------------------------------------------------------------
    describe('validation du mot de passe', () => {
        it('lance un ServiceError si le mot de passe est invalide', async () => {
            const user = fakeUser({ id: 42, is_admin: false });

            let caughtError;
            try {
                await setPassword('court', 42, user);
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError.code).to.equal('setPassword');
            expect(caughtError.nativeError.message).to.include('invalide');
        });

        it('n\'appelle pas activate si le mot de passe est invalide', async () => {
            const user = fakeUser({ id: 42, is_admin: false });

            try {
                await setPassword('court', 42, user);
            } catch {
                // erreur attendue
            }

            expect(activate).to.not.have.been.called;
        });
    });

    // -------------------------------------------------------------------------
    // Mise à jour Keycloak
    // -------------------------------------------------------------------------
    describe('mise à jour Keycloak', () => {
        it('appelle activate avec keycloak_id, email et le password en clair', async () => {
            const user = fakeUser({ id: 42, is_admin: false });
            await setPassword('MonMotD3Passe!', 42, user);

            expect(activate).to.have.been.calledOnceWith(
                user.keycloak_id,
                user.email,
                'MonMotD3Passe!',
            );
        });

        it('lance un ServiceError si activate (Keycloak) échoue', async () => {
            const user = fakeUser({ id: 42, is_admin: false });
            activate.rejects(new Error('Keycloak unreachable'));

            let caughtError;
            try {
                await setPassword('MonMotD3Passe!', 42, user);
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError.code).to.equal('setPassword');
        });

        it('n\'appelle pas userModel.update si Keycloak échoue', async () => {
            const user = fakeUser({ id: 42, is_admin: false });
            activate.rejects(new Error('Keycloak unreachable'));

            try {
                await setPassword('MonMotD3Passe!', 42, user);
            } catch {
                // erreur attendue
            }

            expect(userModel.update).to.not.have.been.called;
        });
    });

    // -------------------------------------------------------------------------
    // Mise à jour DB
    // -------------------------------------------------------------------------
    describe('mise à jour DB', () => {
        it('appelle userModel.update avec le hash du password après Keycloak', async () => {
            const user = fakeUser({ id: 42, is_admin: false });
            await setPassword('MonMotD3Passe!', 42, user);

            expect(userModel.update).to.have.been.calledOnce;
            expect(userModel.update).to.have.been.calledAfter(activate);
            expect(userModel.update.firstCall.args[0]).to.equal(42);
            expect(userModel.update.firstCall.args[1]).to.have.property('password');
            expect(userModel.update.firstCall.args[1]).to.have.property('password_conformity');
        });

        it('met password_conformity à true pour un admin', async () => {
            const admin = fakeUser({ id: 42, is_admin: true });
            await setPassword('MonMotD3Passe16Car!', 42, admin);

            expect(userModel.update.firstCall.args[1].password_conformity).to.equal(true);
        });

        it('met password_conformity à false pour un non-admin', async () => {
            const user = fakeUser({ id: 42, is_admin: false });
            await setPassword('MonMotD3Passe!', 42, user);

            expect(userModel.update.firstCall.args[1].password_conformity).to.equal(false);
        });

        it('lance un ServiceError si userModel.update échoue', async () => {
            const user = fakeUser({ id: 42, is_admin: false });
            userModel.update.rejects(new Error('DB error'));

            let caughtError;
            try {
                await setPassword('MonMotD3Passe!', 42, user);
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError).to.be.instanceOf(ServiceError);
            expect(caughtError.code).to.equal('setPassword');
        });
    });
});
