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
        findByUser: sandbox.stub(),
    },
};

rewiremock('../../models/userFavoriteShantytownModel').with(stubs.userFavoriteShantytownModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import fetch from './fetch';
rewiremock.disable();

describe('services/userFavoriteShantytown', () => {
    describe('fetch()', () => {
        afterEach(() => {
            sandbox.reset();
        });

        describe('contrôle des permissions', () => {
            it('rejette avec permission_denied si l\'utilisateur a le rôle intervener', async () => {
                const user = fakeUser({ role_id: 'intervener' });
                let error: any;

                try {
                    await fetch(user);
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
                    await fetch(user);
                } catch (err) {
                    error = err;
                }

                expect(error).to.be.an.instanceOf(ServiceError);
                expect(error.code).to.equal('permission_denied');
            });

            it('n\'appelle pas le modèle si l\'utilisateur a le rôle intervener', async () => {
                const user = fakeUser({ role_id: 'intervener' });

                try {
                    await fetch(user);
                } catch (err) {
                    // expected
                }

                expect(stubs.userFavoriteShantytownModel.findByUser).to.not.have.been.called;
            });

            it('n\'appelle pas le modèle si l\'utilisateur a le rôle external_observator', async () => {
                const user = fakeUser({ role_id: 'external_observator' });

                try {
                    await fetch(user);
                } catch (err) {
                    // expected
                }

                expect(stubs.userFavoriteShantytownModel.findByUser).to.not.have.been.called;
            });
        });

        describe('cas nominal', () => {
            it('appelle findByUser avec l\'utilisateur si le rôle est autorisé', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                stubs.userFavoriteShantytownModel.findByUser.resolves([]);

                await fetch(user);

                expect(stubs.userFavoriteShantytownModel.findByUser).to.have.been.calledOnceWith(user);
            });

            it('retourne le tableau fourni par le modèle', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                const fakeFavorites = [
                    { id: 1, name: 'Site A' },
                    { id: 2, name: 'Site B' },
                ];
                stubs.userFavoriteShantytownModel.findByUser.resolves(fakeFavorites);

                const result = await fetch(user);

                expect(result).to.deep.equal(fakeFavorites);
            });

            it('retourne un tableau vide si le modèle renvoie un tableau vide', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                stubs.userFavoriteShantytownModel.findByUser.resolves([]);

                const result = await fetch(user);

                expect(result).to.deep.equal([]);
            });
        });

        describe('gestion des erreurs du modèle', () => {
            it('propage une ServiceError avec le code fetch_failed si le modèle throw', async () => {
                const user = fakeUser({ role_id: 'national_admin' });
                stubs.userFavoriteShantytownModel.findByUser.rejects(new Error('Erreur base de données'));
                let error: any;

                try {
                    await fetch(user);
                } catch (err) {
                    error = err;
                }

                expect(error).to.be.an.instanceOf(ServiceError);
                expect(error.code).to.equal('fetch_failed');
            });
        });
    });
});
