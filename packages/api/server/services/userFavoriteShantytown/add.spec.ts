import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

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
            it('rejette avec permission_denied si l\'utilisateur a le rôle intervener', async () => {
                const user = fakeUser({ role_id: 'intervener' });
                let error: any;

                try {
                    await add(user, shantytownId);
                } catch (err) {
                    error = err;
                }

                expect(error).to.be.an.instanceOf(ServiceError);
                expect(error.code).to.equal('permission_denied');
            });

            it('rejette avec permission_denied si l\'utilisateur a le rôle external_observator', async () => {
                const user = fakeUser({ role_id: 'external_observator' });
                let error: any;

                try {
                    await add(user, shantytownId);
                } catch (err) {
                    error = err;
                }

                expect(error).to.be.an.instanceOf(ServiceError);
                expect(error.code).to.equal('permission_denied');
            });

            it('n\'appelle pas le modèle si l\'utilisateur a le rôle intervener', async () => {
                const user = fakeUser({ role_id: 'intervener' });

                try {
                    await add(user, shantytownId);
                } catch {
                    // do nothing
                }

                expect(stubs.userFavoriteShantytownModel.addFavorite).to.not.have.been.called;
            });

            it('n\'appelle pas le modèle si l\'utilisateur a le rôle external_observator', async () => {
                const user = fakeUser({ role_id: 'external_observator' });

                try {
                    await add(user, shantytownId);
                } catch {
                    // do nothing
                }

                expect(stubs.userFavoriteShantytownModel.addFavorite).to.not.have.been.called;
            });
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

                const result = await add(user, shantytownId);

                expect(result).to.be.undefined;
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
