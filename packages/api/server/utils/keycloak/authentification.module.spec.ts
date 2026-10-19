import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { rewiremock } from '#test/rewiremock';
import { AxiosError } from 'axios';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiAsPromised);

// ---------------------------------------------------------------------------
// Stubs des deux instances Axios injectées dans createKeycloakApi
// ---------------------------------------------------------------------------
const sandbox = sinon.createSandbox();

const authenticatedInstance = {
    get: sandbox.stub(),
    post: sandbox.stub(),
    put: sandbox.stub(),
    delete: sandbox.stub(),
    request: sandbox.stub(),
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
// Mock axios
// ---------------------------------------------------------------------------
rewiremock('axios').with({ AxiosError });

const TEST_REALM = 'test-realm';
const TEST_CLIENT_ID = 'test-client';

describe('keycloak.api-client / createKeycloakApi()', () => {
    let keycloakApi: Awaited<ReturnType<typeof import('./keycloak.api-client').createKeycloakApi>>;
    const originalEnv = { ...process.env };

    beforeEach(async () => {
        process.env.KEYCLOAK_REALM = TEST_REALM;
        process.env.KEYCLOAK_CLIENT_ID = TEST_CLIENT_ID;

        rewiremock.enable();
        const { createKeycloakApi } = await rewiremock.module(
            () => import('./keycloak.api-client'),
        );
        keycloakApi = await createKeycloakApi(
            authenticatedInstance as any,
            publicInstance as any,
        );
    });

    afterEach(() => {
        process.env = { ...originalEnv };
        rewiremock.disable();
        sandbox.reset();
    });

    // -----------------------------------------------------------------------
    // getAdminPublicKey
    // -----------------------------------------------------------------------
    describe('getAdminPublicKey()', () => {
        it('appelle la bonne URL sur le realm configuré', async () => {
            publicInstance.get.resolves({ data: { keys: [] } });

            const result = await keycloakApi.getAdminPublicKey();

            expect(publicInstance.get).to.have.been.calledOnce;
            const [url] = publicInstance.get.firstCall.args;
            expect(url).to.equal(`/auth/realms/${TEST_REALM}/protocol/openid-connect/certs`);
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
            expect(url).to.equal(`/auth/realms/${TEST_REALM}/protocol/openid-connect/certs`);
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
            const [url, body, options] = publicInstance.post.firstCall.args;
            expect(url).to.equal(`/auth/realms/${TEST_REALM}/protocol/openid-connect/token`);
            expect(body.get('grant_type')).to.equal('client_credentials');
            expect(body.get('client_id')).to.equal('rb-admin');
            expect(body.get('username')).to.equal('admin');
            expect(body.get('password')).to.equal('secret');
            expect(options.headers['Content-Type']).to.equal('application/x-www-form-urlencoded');
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
            expect(publicInstance.post).to.have.been.calledOnce;
            const [url, body, options] = publicInstance.post.firstCall.args;
            expect(url).to.equal(`/auth/realms/${TEST_REALM}/protocol/openid-connect/token`);
            expect(body.get('grant_type')).to.equal('password');
            expect(body.get('username')).to.equal('user');
            expect(body.get('password')).to.equal('pass');
            expect(options.headers['Content-Type']).to.equal('application/x-www-form-urlencoded');
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
            expect(publicInstance.post).to.have.been.calledOnce;
            const [url, body, options] = publicInstance.post.firstCall.args;
            expect(url).to.equal(`/auth/realms/${TEST_REALM}/protocol/openid-connect/token`);
            expect(body.get('grant_type')).to.equal('client_credentials');
            expect(body.get('audience')).to.equal('my-client');
            const expectedBasic = Buffer.from('my-client:my-secret').toString('base64');
            expect(options.headers.Authorization).to.equal(`Basic ${expectedBasic}`);
            expect(options.headers['Content-Type']).to.equal('application/x-www-form-urlencoded');
        });
    });

    // -----------------------------------------------------------------------
    // healthcheck
    // -----------------------------------------------------------------------
    describe('healthcheck()', () => {
        it('appelle /healthcheck et retourne les données', async () => {
            const healthData = { status: 'UP' };
            authenticatedInstance.get.resolves({ data: healthData });

            const result = await keycloakApi.healthcheck();

            expect(authenticatedInstance.get).to.have.been.calledOnceWith('/healthcheck');
            expect(result).to.deep.equal(healthData);
        });

        it('propage l\'erreur en cas d\'échec', async () => {
            authenticatedInstance.get.rejects(new Error('Healthcheck failure'));

            await expect(keycloakApi.healthcheck()).to.be.rejectedWith('Healthcheck failure');
        });
    });

    // -----------------------------------------------------------------------
    // getUsers
    // -----------------------------------------------------------------------
    describe('getUsers()', () => {
        it('agrège les pages et renvoie tous les utilisateurs', async () => {
            const page1 = Array.from({ length: 500 }, (_, i) => ({ id: `user-${i}` }));
            const page2 = [{ id: 'user-500' }];

            authenticatedInstance.get
                .onFirstCall().resolves({ data: page1 })
                .onSecondCall().resolves({ data: page2 });

            const users = await keycloakApi.getUsers();

            expect(authenticatedInstance.get).to.have.been.calledTwice;
            expect(users).to.have.length(501);
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
                headers: { location: `https://keycloak/admin/realms/${TEST_REALM}/users/new-uuid-123` },
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
            expect(url).to.equal(`/admin/realms/${TEST_REALM}/users/some-user-id`);
        });
    });

    // -----------------------------------------------------------------------
    // assignRealmRoles
    // -----------------------------------------------------------------------
    describe('assignRealmRoles()', () => {
        it('ne fait rien si la liste des rôles est vide', async () => {
            await keycloakApi.assignRealmRoles('user-123', []);

            expect(authenticatedInstance.get).to.not.have.been.called;
            expect(authenticatedInstance.post).to.not.have.been.called;
        });

        it('résout chaque rôle et les assigne au user', async () => {
            const roleAdmin = { id: 'role-1', name: 'RB_ADMINISTRATEUR' };
            const roleUser = { id: 'role-2', name: 'RB_UTILISATEUR' };

            authenticatedInstance.get
                .withArgs(`/admin/realms/${TEST_REALM}/roles/RB_ADMINISTRATEUR`, undefined)
                .resolves({ data: roleAdmin });
            authenticatedInstance.get
                .withArgs(`/admin/realms/${TEST_REALM}/roles/RB_UTILISATEUR`, undefined)
                .resolves({ data: roleUser });
            authenticatedInstance.post.resolves({ data: null });

            await keycloakApi.assignRealmRoles('user-123', ['RB_ADMINISTRATEUR', 'RB_UTILISATEUR']);

            expect(authenticatedInstance.get).to.have.been.calledTwice;
            expect(authenticatedInstance.post).to.have.been.calledOnceWith(
                `/admin/realms/${TEST_REALM}/users/user-123/role-mappings/realm`,
                [roleAdmin, roleUser],
                undefined,
            );
        });
    });

    // -----------------------------------------------------------------------
    // assignClientRoles
    // -----------------------------------------------------------------------
    describe('assignClientRoles()', () => {
        it('lève une erreur si clientId n\'est pas fourni et absent de l\'environnement', async () => {
            delete process.env.KEYCLOAK_CLIENT_ID;

            await expect(
                keycloakApi.assignClientRoles('user-123', ['ROLE_A'], ''),
            ).to.be.rejectedWith('assignClientRoles: KEYCLOAK_CLIENT_ID is not set.');
        });

        it('ne fait rien si la liste des rôles est vide', async () => {
            await keycloakApi.assignClientRoles('user-123', []);

            expect(authenticatedInstance.get).to.not.have.been.called;
            expect(authenticatedInstance.post).to.not.have.been.called;
        });

        it('lève une erreur si le client n\'est pas trouvé dans le realm', async () => {
            authenticatedInstance.get
                .withArgs(`/admin/realms/${TEST_REALM}/clients?clientId=unknown-client`, undefined)
                .resolves({ data: [] });

            await expect(
                keycloakApi.assignClientRoles('user-123', ['ROLE_A'], 'unknown-client'),
            ).to.be.rejectedWith("assignClientRoles: client 'unknown-client' not found in realm.");
        });

        it('résout le client UUID, les rôles et les assigne au user', async () => {
            const clientUuid = 'internal-client-uuid';
            const roleRep = { id: 'rep-1', name: 'RB_ADMINISTRATEUR' };

            authenticatedInstance.get
                .withArgs(`/admin/realms/${TEST_REALM}/clients?clientId=my-client`, undefined)
                .resolves({ data: [{ id: clientUuid }] });
            authenticatedInstance.get
                .withArgs(`/admin/realms/${TEST_REALM}/clients/${clientUuid}/roles/RB_ADMINISTRATEUR`, undefined)
                .resolves({ data: roleRep });
            authenticatedInstance.post.resolves({ data: null });

            await keycloakApi.assignClientRoles('user-123', ['RB_ADMINISTRATEUR'], 'my-client');

            expect(authenticatedInstance.post).to.have.been.calledOnceWith(
                `/admin/realms/${TEST_REALM}/users/user-123/role-mappings/clients/${clientUuid}`,
                [roleRep],
                undefined,
            );
        });

        it('utilise KEYCLOAK_CLIENT_ID par défaut si non spécifié', async () => {
            const clientUuid = 'default-client-uuid';
            const roleRep = { id: 'rep-default', name: 'RB_ADMINISTRATEUR' };

            authenticatedInstance.get
                .withArgs(`/admin/realms/${TEST_REALM}/clients?clientId=${TEST_CLIENT_ID}`, undefined)
                .resolves({ data: [{ id: clientUuid }] });
            authenticatedInstance.get
                .withArgs(`/admin/realms/${TEST_REALM}/clients/${clientUuid}/roles/RB_ADMINISTRATEUR`, undefined)
                .resolves({ data: roleRep });
            authenticatedInstance.post.resolves({ data: null });

            await keycloakApi.assignClientRoles('user-123', ['RB_ADMINISTRATEUR']);

            expect(authenticatedInstance.post).to.have.been.calledOnceWith(
                `/admin/realms/${TEST_REALM}/users/user-123/role-mappings/clients/${clientUuid}`,
                [roleRep],
                undefined,
            );
        });
    });

    // -----------------------------------------------------------------------
    // Intercepteurs Axios
    // -----------------------------------------------------------------------
    describe('Intercepteurs Axios', () => {
        it('injecte les en-têtes requis via tokenProviders', async () => {
            const tokenProviders = {
                getAdminToken: sandbox.stub().resolves('admin-token-mock'),
                getPisteToken: sandbox.stub().resolves('piste-token-mock'),
            };

            const { createKeycloakApi } = await rewiremock.module(
                () => import('./keycloak.api-client'),
            );
            await createKeycloakApi(
                authenticatedInstance as any,
                publicInstance as any,
                tokenProviders,
            );

            const requestInterceptor = authenticatedInstance.interceptors.request.use.lastCall.args[0];

            const initialConfig: any = { headers: {} };
            const modifiedConfig = await requestInterceptor(initialConfig);

            expect(modifiedConfig.headers.Authorization).to.equal('Bearer piste-token-mock');
            expect(modifiedConfig.headers['X-Admin-Token']).to.equal('admin-token-mock');
            expect(modifiedConfig.headers.ENVIRONNEMENT).to.equal('PREPROD');
            expect(modifiedConfig.headers['Content-Type']).to.equal('application/json');
            expect(tokenProviders.getAdminToken).to.have.been.calledOnce;
            expect(tokenProviders.getPisteToken).to.have.been.calledOnce;
        });

        it('réessaie la requête en cas de réponse 401', async () => {
            const { createKeycloakApi } = await rewiremock.module(
                () => import('./keycloak.api-client'),
            );
            await createKeycloakApi(
                authenticatedInstance as any,
                publicInstance as any,
            );

            const responseInterceptorSuccess = authenticatedInstance.interceptors.response.use.lastCall.args[0];
            const responseInterceptorError = authenticatedInstance.interceptors.response.use.lastCall.args[1];

            const fakeResponse = { status: 200, data: 'ok' };
            expect(responseInterceptorSuccess(fakeResponse)).to.equal(fakeResponse);

            const axios401Err = new AxiosError('Unauthorized');
            const originalConfig: any = { url: '/some/url', headers: {} };
            axios401Err.response = { status: 401 } as any;
            axios401Err.config = originalConfig;

            authenticatedInstance.request.resolves({ data: 'retried-ok' });

            const retryResult = await responseInterceptorError(axios401Err);
            expect(authenticatedInstance.request).to.have.been.calledOnceWith(sinon.match({
                url: '/some/url',
                retried: true,
            }));
            expect(retryResult).to.deep.equal({ data: 'retried-ok' });
        });

        it('ne réessaie pas si la requête a déjà été retentée', async () => {
            const { createKeycloakApi } = await rewiremock.module(
                () => import('./keycloak.api-client'),
            );
            await createKeycloakApi(
                authenticatedInstance as any,
                publicInstance as any,
            );

            const responseInterceptorError = authenticatedInstance.interceptors.response.use.lastCall.args[1];

            const axios401Err = new AxiosError('Unauthorized');
            axios401Err.response = { status: 401 } as any;
            axios401Err.config = { retried: true } as any;

            await expect(responseInterceptorError(axios401Err)).to.be.rejectedWith(axios401Err);
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
