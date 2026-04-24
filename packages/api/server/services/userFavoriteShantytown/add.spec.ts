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
        addFavorite: sandbox.stub(),
    },
};

rewiremock('../../models/userFavoriteShantytownModel').with(stubs.userFavoriteShantytownModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import add from './add';
rewiremock.disable();

describe('services/userFavoriteShantytown', () => {
    describe('add()', () => {
        const shantytownId = 42;

        afterEach(() => {
            sandbox.reset();
        });

        describe('contrôle des permissions', () => {
            testForbiddenRolesPermissions(add, stubs.userFavoriteShantytownModel.addFavorite, shantytownId);
        });

        describe('cas nominal', () => {
            it('appelle addFavorite avec l\'id de l\'utilisateur et l\'id du site si le rôle est autorisé', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                stubs.userFavoriteShantytownModel.addFavorite.resolves();

                await add(user, shantytownId);

                expect(stubs.userFavoriteShantytownModel.addFavorite).to.have.been.calledOnceWith(user.id, shantytownId);
            });

            it('retourne void si l\'appel au modèle réussit', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                stubs.userFavoriteShantytownModel.addFavorite.resolves();

                await expectVoidReturn(() => add(user, shantytownId));
            });
        });

        describe('gestion des erreurs du modèle', () => {
            it('propage une ServiceError avec le code write_failed si le modèle throw', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                stubs.userFavoriteShantytownModel.addFavorite.rejects(new Error('Erreur base de données'));
                let error: any;

                try {
                    await add(user, shantytownId);
                } catch (err) {
                    error = err;
                }

                expect(error).to.be.an.instanceOf(ServiceError);
                expect(error.code).to.equal('write_failed');
            });
        });
    });
});
