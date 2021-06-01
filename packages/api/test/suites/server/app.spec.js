const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
// const appConstructor = require('#server/app');

const { expect } = chai;
chai.use(chaiHttp);

function mockController() {
    return sinon.stub().callsFake((req, res) => res.status(200).send({}));
}

function getFakeMiddlewares() {
    return {
        auth: {
            authenticate: sinon.stub().callsFake((req, res, next) => {
                next();
            }),
            checkPermissions: sinon.stub().callsFake((permissions, req, res, next) => {
                next();
            }),
        },
    };
}

function getFakeControllers() {
    return {
        user: {
            list: mockController(),
            edit: mockController(),
            me: mockController(),
            renewToken: mockController(),
            signin: mockController(),
            create: mockController(),
            setDefaultExport: mockController(),
            getActivationLink: mockController(),
            checkActivationToken: mockController(),
            activate: mockController(),
        },
        config: {
            list: mockController(),
        },
        town: {
            add: mockController(),
            addComment: mockController(),
            close: mockController(),
            delete: mockController(),
            edit: mockController(),
            find: mockController(),
            list: mockController(),
            updateComment: mockController(),
            deleteComment: mockController(),
        },
        geo: {
            search: mockController(),
            searchCities: mockController(),
            searchEpci: mockController(),
        },
        plan: {
            list: mockController(),
            create: mockController(),
            find: mockController(),
            delete: mockController(),
            link: mockController(),
            updateDetails: mockController(),
        },
    };
}

function getFakeApp(middlewares, controllers) {
    return appConstructor(
        middlewares,
        controllers,
    );
}

describe('app', () => {
    let app;
    let middlewares;
    let controllers;

    describe('GET /users', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).get('/users');
        });

        it('it should require a token', () => {
            expect(middlewares.auth.authenticate).to.have.been.calledOnce;
            expect(middlewares.auth.checkPermissions).to.have.been.calledOnceWith([
                {
                    type: 'feature',
                    name: 'readUser',
                },
            ]);
        });

        it('it should map to userController.list', () => {
            expect(controllers.user.list).to.have.been.calledOnce;
        });
    });

    describe('POST /users', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).post('/users');
        });

        it('it should require a token', () => {
            expect(middlewares.auth.authenticate).to.have.been.calledOnce;
            expect(middlewares.auth.checkPermissions).to.have.been.calledOnceWith([
                {
                    type: 'feature',
                    name: 'createUser',
                },
            ]);
        });

        it('it should map to userController.create', () => {
            expect(controllers.user.create).to.have.been.calledOnce;
        });
    });

    describe('GET /users/:id/activate', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).get('/users/123/activate');
        });

        it('it should require a token', () => {
            expect(middlewares.auth.authenticate).to.have.been.calledOnce;
            expect(middlewares.auth.checkPermissions).to.have.been.calledOnceWith([
                {
                    type: 'feature',
                    name: 'createUser',
                },
            ]);
        });

        it('it should map to userController.getActivationLink', () => {
            expect(controllers.user.getActivationLink).to.have.been.calledOnce;
        });
    });

    describe('POST /users/:id/activate', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).post('/users/123/activate');
        });

        it('it should require to be anonymous', () => {
            expect(middlewares.auth.authenticate).not.to.have.been.called;
            expect(middlewares.auth.checkPermissions).not.to.have.been.called;
        });

        it('it should map to userController.activate', () => {
            expect(controllers.user.activate).to.have.been.calledOnce;
        });
    });

    describe('GET /activation-tokens/:token/check', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).get('/activation-tokens/whatever/check');
        });

        it('it should require to be anonymous', () => {
            expect(middlewares.auth.authenticate).not.to.have.been.called;
            expect(middlewares.auth.checkPermissions).not.to.have.been.called;
        });

        it('it should map to userController.checkActivationToken', () => {
            expect(controllers.user.checkActivationToken).to.have.been.calledOnce;
        });
    });

    describe('POST /towns', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).post('/towns');
        });

        it('it should require a token', () => {
            expect(middlewares.auth.authenticate).to.have.been.calledOnce;
            expect(middlewares.auth.checkPermissions).to.have.been.calledOnce;
        });

        it('it should map to townController.create', () => {
            expect(controllers.town.create).to.have.been.calledOnce;
        });
    });

    describe('POST /towns/:id', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).post('/towns/123');
        });

        it('it should require a token', () => {
            expect(middlewares.auth.authenticate).to.have.been.calledOnce;
            expect(middlewares.auth.checkPermissions).to.have.been.calledOnceWith([
                {
                    type: 'feature',
                    name: 'updateTown',
                },
            ]);
        });

        it('it should map to townController.edit', () => {
            expect(controllers.town.edit).to.have.been.calledOnce;
        });
    });

    describe('POST /towns/:id/close', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).post('/towns/123/close');
        });

        it('it should require a token', () => {
            expect(middlewares.auth.authenticate).to.have.been.calledOnce;
            expect(middlewares.auth.checkPermissions).to.have.been.calledOnceWith([
                {
                    type: 'feature',
                    name: 'closeTown',
                },
            ]);
        });

        it('it should map to townController.close', () => {
            expect(controllers.town.close).to.have.been.calledOnce;
        });
    });

    describe('DELETE /towns/:id', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).delete('/towns/123');
        });

        it('it should require a token', () => {
            expect(middlewares.auth.authenticate).to.have.been.calledOnce;
            expect(middlewares.auth.checkPermissions).to.have.been.calledOnceWith([
                {
                    type: 'feature',
                    name: 'deleteTown',
                },
            ]);
        });

        it('it should map to townController.delete', () => {
            expect(controllers.town.delete).to.have.been.calledOnce;
        });
    });

    describe('POST /towns/:id/comments', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).post('/towns/123/comments');
        });

        it('it should require a token', () => {
            expect(middlewares.auth.authenticate).to.have.been.calledOnce;
            expect(middlewares.auth.checkPermissions).to.have.been.calledOnceWith([
                {
                    type: 'feature',
                    name: 'createComment',
                },
            ]);
        });

        it('it should map to townController.addComment', () => {
            expect(controllers.town.addComment).to.have.been.calledOnce;
        });
    });

    describe('POST /me/default-export', () => {
        beforeEach(async () => {
            middlewares = getFakeMiddlewares();
            controllers = getFakeControllers();
            app = getFakeApp(middlewares, controllers);

            await chai.request(app).post('/me/default-export');
        });

        it('it should require a token', () => {
            expect(middlewares.auth.authenticate).to.have.been.calledOnce;
        });

        it('it should map to userController.setDefaultExport', () => {
            expect(controllers.user.setDefaultExport).to.have.been.calledOnce;
        });
    });
});
