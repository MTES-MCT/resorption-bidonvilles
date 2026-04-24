import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';
import { expectVoidReturn, testForbiddenRolesPermissions } from './testHelpers.spec';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    userFavoriteShantytownModel: {
        removeFavorite: sandbox.stub(),
    },
};

rewiremock('../../models/userFavoriteShantytownModel').with(stubs.userFavoriteShantytownModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import remove from './remove';
rewiremock.disable();

describe('services/userFavoriteShantytown', () => {
    describe('remove()', () => {
        let consoleErrorStub;
        const shantytownId = 42;

        beforeEach(() => {
            consoleErrorStub = sandbox.stub(console, 'error');
        });

        afterEach(() => {
            consoleErrorStub.restore();
            sandbox.reset();
        });

        describe('contrôle des permissions', () => {
            testForbiddenRolesPermissions(remove, stubs.userFavoriteShantytownModel.removeFavorite, shantytownId);
        });

        describe('cas nominal', () => {
            it('appelle removeFavorite avec l\'id de l\'utilisateur et l\'id du site si le rôle est autorisé', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                stubs.userFavoriteShantytownModel.removeFavorite.resolves();

                await remove(user, shantytownId);

                expect(stubs.userFavoriteShantytownModel.removeFavorite).to.have.been.calledOnceWith(user.id, shantytownId);
            });

            it('retourne void si l\'appel au modèle réussit', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                stubs.userFavoriteShantytownModel.removeFavorite.resolves();

                await expectVoidReturn(() => remove(user, shantytownId));
            });
        });

        describe('gestion des erreurs du modèle', () => {
            it('propage une ServiceError avec le code delete_failed si le modèle throw', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                stubs.userFavoriteShantytownModel.removeFavorite.rejects(new Error('Erreur base de données'));
                let error: any;

                try {
                    await remove(user, shantytownId);
                } catch (err) {
                    error = err;
                }

                expect(error).to.be.an.instanceOf(ServiceError);
                expect(error.code).to.equal('delete_failed');
            });
        });
    });
});
