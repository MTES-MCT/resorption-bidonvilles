import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import { AxiosError } from 'axios';

const { expect } = chai;
chai.use(sinonChai);

// ---------------------------------------------------------------------------
// Stubs des deux instances Axios injectées dans createKeycloakApi
// ---------------------------------------------------------------------------
const sandbox = sinon.createSandbox();

const authenticatedInstance = {
    get: sandbox.stub(),
    post: sandbox.stub(),
    put: sandbox.stub(),
    delete: sandbox.stub(),
    interceptors: {
        request: { use: sandbox.stub() },
        response: { use: sandbox.stub() },
    },
};

const publicInstance = {
    get: sandbox.stub(),
    post: sandbox.stub(),
    interceptors: {
        request: { use: sandbox.stub() },
        response: { use: sandbox.stub() },
    },
};

// ---------------------------------------------------------------------------
// Aucun module tiers à réécrire ici : createKeycloakApi est une fonction pure
// qui reçoit ses dépendances en paramètre — pas besoin de rewiremock.module().
// On importe directement après avoir configuré les stubs.
// ---------------------------------------------------------------------------
rewiremock('axios').with({ AxiosError });

describe('keycloak.api-client / createKeycloakApi()', () => {
    let keycloakApi: ReturnType<typeof import('./keycloak.api-client').createKeycloakApi>;

    beforeEach(async () => {
        rewiremock.enable();
        const { createKeycloakApi } = await rewiremock.module(
            () => import('./keycloak.api-client'),
        );
        keycloakApi = createKeycloakApi(
            authenticatedInstance as any,
            publicInstance as any,
        );
    });

    afterEach(() => {
        rewiremock.disable();
        sandbox.reset();
    });

    // -----------------------------------------------------------------------
    // getAdminPublicKey
    // -----------------------------------------------------------------------
    describe('getAdminPublicKey()', () => {
        it('appelle la bonne URL sur le realm master', async () => {
            publicInstance.get.resolves({ data: { keys: [] } });

            const result = await keycloakApi.getAdminPublicKey();

            expect(publicInstance.get).to.have.been.calledOnce;
            const [url] = publicInstance.get.firstCall.args;
            expect(url).to.equal('/realms/master/protocol/openid-connect/certs');
            expect(result).to.deep.equal({ keys: [] });
        });
    });

    // -----------------------------------------------------------------------
    // getRealmPublicKey
    // -----------------------------------------------------------------------
    describe('getRealmPublicKey()', () => {
        it('appelle la bonne URL sur le realm configuré', async () => {
            publicInstance.get.resolves({ data: { keys: [{ kid: 'abc' }] } });

            const result = await keycloakApi.getRealmPublicKey();

            expect(publicInstance.get).to.have.been.calledOnce;
            const [url] = publicInstance.get.firstCall.args;
            expect(url).to.include('/protocol/openid-connect/certs');
            expect(url).not.to.include('master'); // realm applicatif, pas master
            expect(result).to.deep.equal({ keys: [{ kid: 'abc' }] });
        });
    });

    // -----------------------------------------------------------------------
    // getAdminToken
    // -----------------------------------------------------------------------
    describe('getAdminToken()', () => {
        it('renvoie l\'access_token reçu', async () => {
            publicInstance.post.resolves({ data: { access_token: 'tok-admin' } });

            const token = await keycloakApi.getAdminToken({ username: 'admin', password: 'secret' });

            expect(token).to.equal('tok-admin');
            expect(publicInstance.post).to.have.been.calledOnce;
            const [url] = publicInstance.post.firstCall.args;
            expect(url).to.equal('/realms/master/protocol/openid-connect/token');
        });
    });

    // -----------------------------------------------------------------------
    // getUserToken
    // -----------------------------------------------------------------------
    describe('getUserToken()', () => {
        it('renvoie l\'access_token reçu', async () => {
            publicInstance.post.resolves({ data: { access_token: 'tok-user' } });

            const token = await keycloakApi.getUserToken({ username: 'user', password: 'pass' });

            expect(token).to.equal('tok-user');
        });
    });

    // -----------------------------------------------------------------------
    // getClientToken
    // -----------------------------------------------------------------------
    describe('getClientToken()', () => {
        it('renvoie l\'access_token reçu', async () => {
            publicInstance.post.resolves({ data: { access_token: 'tok-client' } });

            const token = await keycloakApi.getClientToken('my-client', 'my-secret');

            expect(token).to.equal('tok-client');
        });
    });

    // -----------------------------------------------------------------------
    // getUsers
    // -----------------------------------------------------------------------
    describe('getUsers()', () => {
        it('agrège les pages et renvoie tous les utilisateurs', async () => {
            const page1 = Array.from({ length: 100 }, (_, i) => ({ id: `user-${i}` }));
            const page2 = [{ id: 'user-100' }];

            authenticatedInstance.get
                .onFirstCall().resolves({ data: page1 })
                .onSecondCall().resolves({ data: page2 });

            const users = await keycloakApi.getUsers();

            expect(authenticatedInstance.get).to.have.been.calledTwice;
            expect(users).to.have.length(101);
        });

        it('renvoie un tableau vide si la première page est vide', async () => {
            authenticatedInstance.get.resolves({ data: [] });

            const users = await keycloakApi.getUsers();

            expect(users).to.deep.equal([]);
        });
    });

    // -----------------------------------------------------------------------
    // createUser
    // -----------------------------------------------------------------------
    describe('createUser()', () => {
        it('extrait l\'id de l\'en-tête Location', async () => {
            authenticatedInstance.post.resolves({
                headers: { location: 'https://keycloak/admin/realms/myrealm/users/new-uuid-123' },
            });

            const id = await keycloakApi.createUser({
                username: 'newuser',
                email: 'new@example.com',
            });

            expect(id).to.equal('new-uuid-123');
        });
    });

    // -----------------------------------------------------------------------
    // getUserByEmail
    // -----------------------------------------------------------------------
    describe('getUserByEmail()', () => {
        it('renvoie le premier utilisateur trouvé', async () => {
            const fakeUser = { id: 'u1', email: 'test@example.com' };
            authenticatedInstance.get.resolves({ data: [fakeUser] });

            const result = await keycloakApi.getUserByEmail('test@example.com');

            expect(result).to.deep.equal(fakeUser);
        });

        it('renvoie undefined si aucun utilisateur trouvé', async () => {
            authenticatedInstance.get.resolves({ data: [] });

            const result = await keycloakApi.getUserByEmail('nobody@example.com');

            expect(result).to.be.undefined;
        });
    });

    // -----------------------------------------------------------------------
    // getUserById – retourne undefined sur 404
    // -----------------------------------------------------------------------
    describe('getUserById()', () => {
        it('renvoie undefined si l\'utilisateur est introuvable (404)', async () => {
            const notFound = new AxiosError('Not Found');
            notFound.response = { status: 404 } as any;
            authenticatedInstance.get.rejects(notFound);

            const result = await keycloakApi.getUserById('inexistant-id');

            expect(result).to.be.undefined;
        });

        it('lève une erreur wrappée si le statut n\'est pas 404', async () => {
            const serverError = new AxiosError('Internal Server Error');
            serverError.response = { status: 500, statusText: 'Internal Server Error', data: {} } as any;
            authenticatedInstance.get.rejects(serverError);

            try {
                await keycloakApi.getUserById('some-id');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect((err as Error).message).to.include('GET');
                return;
            }
            expect.fail('Une exception était attendue');
        });
    });

    // -----------------------------------------------------------------------
    // deleteUser
    // -----------------------------------------------------------------------
    describe('deleteUser()', () => {
        it('appelle authenticatedInstance.delete avec le bon URL', async () => {
            authenticatedInstance.delete.resolves({ data: null });

            await keycloakApi.deleteUser('some-user-id');

            expect(authenticatedInstance.delete).to.have.been.calledOnce;
            const [url] = authenticatedInstance.delete.firstCall.args;
            expect(url).to.include('/users/some-user-id');
        });
    });

    // -----------------------------------------------------------------------
    // Gestion des erreurs HTTP – wrapping avec buildMessage
    // -----------------------------------------------------------------------
    describe('gestion des erreurs Axios', () => {
        it('lève une Error avec des infos de contexte (méthode + url) en cas d\'échec POST', async () => {
            const axiosErr = new AxiosError('Bad Request');
            axiosErr.response = { status: 400, statusText: 'Bad Request', data: { errorMessage: 'invalid' } } as any;
            authenticatedInstance.post.rejects(axiosErr);

            try {
                await keycloakApi.logoutUser('user-id');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                const msg = (err as Error).message;
                expect(msg).to.include('POST');
                expect(msg).to.include('/users/user-id/logout');
                return;
            }
            expect.fail('Une exception était attendue');
        });

        it('lève une Error avec des infos de contexte (méthode + url) en cas d\'échec GET', async () => {
            const axiosErr = new AxiosError('Unauthorized');
            axiosErr.response = { status: 401, statusText: 'Unauthorized', data: {} } as any;
            authenticatedInstance.get.rejects(axiosErr);

            try {
                await keycloakApi.getUserByEmail('nobody@example.com');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                const msg = (err as Error).message;
                expect(msg).to.include('GET');
                return;
            }
            expect.fail('Une exception était attendue');
        });
    });
});
