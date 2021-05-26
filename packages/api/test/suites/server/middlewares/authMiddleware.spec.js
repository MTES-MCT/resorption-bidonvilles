const chai = require('chai');
const chaiSubset = require('chai-subset');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const sinonChai = require('sinon-chai');

const fakeModels = {
    user: {
        findOne: sinon.stub(),
    },
};

const { authenticate, checkPermissions } = require('#server/middlewares/authMiddleware')(fakeModels);
const { mockReq, mockRes } = require('sinon-express-mock');
const { auth: authConfig } = require('#server/config');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

describe('auth', () => {
    let httpRes;
    let httpReq;
    let response;

    it('.autenticate()', () => {
        describe('if there is no token in the request', () => {
            beforeEach(async () => {
                httpReq = mockReq({});
                httpRes = mockRes();

                await authenticate(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        code: 1,
                        user_message: 'Vous devez être connecté pour accéder à ce contenu',
                        developer_message: 'The access token is missing',
                    },
                });
            });
        });

        describe('if the token is not valid', () => {
            beforeEach(async () => {
                httpReq = mockReq({
                    headers: {
                        'x-access-token': global.generate('string'),
                    },
                });
                httpRes = mockRes();

                await authenticate(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        code: 2,
                        user_message: 'Votre session a expiré',
                        developer_message: 'The access token is either invalid or expired',
                    },
                });
            });
        });

        describe('if the token is valid but expired', () => {
            beforeEach(async () => {
                httpReq = mockReq({
                    headers: {
                        'x-access-token': jwt.sign({ what: 'ever' }, authConfig.secret, {
                            expiresIn: '1',
                        }),
                    },
                });
                httpRes = mockRes();

                await authenticate(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        code: 2,
                        user_message: 'Votre session a expiré',
                        developer_message: 'The access token is either invalid or expired',
                    },
                });
            });
        });

        describe('if the token is fully valid', () => {
            describe('if the user related to the token does not actually exist', () => {
                let token;
                beforeEach(async () => {
                    const fakeUserId = global.generate('number');
                    token = {
                        userId: fakeUserId,
                    };

                    fakeModels.user.findOne.withArgs(fakeUserId).returns(null);

                    httpReq = mockReq({
                        headers: {
                            'x-access-token': jwt.sign(token, authConfig.secret, {
                                expiresIn: '1s',
                            }),
                        },
                    });
                    httpRes = mockRes();

                    await authenticate(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 400', () => {
                    expect(httpRes.status).to.have.been.calledWith(400);
                });

                it('it responds with the proper error messages', () => {
                    expect(response).to.be.eql({
                        error: {
                            code: 3,
                            user_message: 'Votre session a expiré',
                            developer_message: 'The access token is either invalid or expired',
                        },
                    });
                });
            });

            describe('if the user related to the token actually exists', () => {
                describe('if that user is not active', () => {
                    beforeEach(async () => {
                        const fakeUser = {
                            id: global.generate('number'),
                            email: global.generate('string'),
                            active: false,
                        };

                        const token = {
                            userId: fakeUser.id,
                        };

                        fakeModels.user.findOne.withArgs(fakeUser.id).returns(fakeUser);

                        const nextRequestHandler = sinon.stub();

                        httpReq = mockReq({
                            headers: {
                                'x-access-token': jwt.sign(token, authConfig.secret, {
                                    expiresIn: '1s',
                                }),
                            },
                        });
                        httpRes = mockRes();

                        await authenticate(httpReq, httpRes, nextRequestHandler);
                        [response] = httpRes.send.getCalls()[0].args;
                    });

                    it('it responds with a 400', () => {
                        expect(httpRes.status).to.have.been.calledWith(400);
                    });

                    it('it responds with the proper error messages', () => {
                        expect(response).to.be.eql({
                            error: {
                                code: 4,
                                user_message: 'Votre session a expiré',
                                developer_message: 'The access token is either invalid or expired',
                            },
                        });
                    });
                });

                describe('if that user is active', () => {
                    let nextRequestHandler;
                    let token;
                    let fakeUser;
                    beforeEach(async () => {
                        fakeUser = {
                            id: global.generate('number'),
                            email: global.generate('string'),
                            active: true,
                        };

                        token = {
                            userId: fakeUser.id,
                        };

                        fakeModels.user.findOne.withArgs(fakeUser.id).returns(fakeUser);

                        httpReq = mockReq({
                            headers: {
                                'x-access-token': jwt.sign(token, authConfig.secret, {
                                    expiresIn: '1s',
                                }),
                            },
                        });
                        httpRes = mockRes();
                        nextRequestHandler = sinon.stub();

                        await authenticate(httpReq, httpRes, nextRequestHandler);
                    });

                    it('it includes the user into the request', () => {
                        expect(httpReq.user).to.containSubset(fakeUser);
                    });

                    it('it triggers the next request handler', () => {
                        expect(nextRequestHandler).to.have.been.calledOnce;
                    });
                });
            });
        });
    });

    describe('.checkPermissions()', () => {
        const dataSets = [
            { name: 'there is no user in the request', req: {}, requiredPermissions: [] },
            { name: 'the user has no permission', req: { user: {} }, requiredPermissions: [] },
            { name: 'the list of required permissions is not defined', req: { user: { permissions: {} } }, requiredPermissions: undefined },
        ];

        dataSets.forEach(({ name, req, requiredPermissions }) => {
            describe(`if ${name}`, () => {
                beforeEach(() => {
                    httpReq = mockReq(req);
                    httpRes = mockRes();
                    checkPermissions(requiredPermissions, httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 500', () => {
                    expect(httpRes.status).to.have.been.calledWith(500);
                });

                it('it responds with the proper error messages', () => {
                    expect(response).to.be.eql({
                        error: {
                            code: 4,
                            user_message: 'Vous n\'avez pas accès à ces données',
                            developer_message: 'Tried to access a secured page without authentication',
                        },
                    });
                });
            });
        });

        describe('if the user does not have all required permissions', () => {
            beforeEach(() => {
                httpReq = mockReq({
                    user: {
                        permissions: {},
                    },
                });
                httpRes = mockRes();
                checkPermissions([
                    {
                        type: 'feature',
                        name: global.generate('string'),
                    }], httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 400', () => {
                expect(httpRes.status).to.have.been.calledWith(400);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql({
                    error: {
                        code: 5,
                        user_message: 'Vous n\'avez pas accès à ces données',
                        developer_message: 'Tried to access a secured page without all required permissions',
                    },
                });
            });
        });

        describe('if the user has all required permissions', () => {
            let nextRequestHandler;
            beforeEach(() => {
                const randomType = global.generate('string');
                const randomName = global.generate('string');
                const randomPermission = {
                    type: randomType,
                    name: randomName,
                };

                httpReq = mockReq({
                    user: {
                        permissions: {
                            [randomType]: [randomName],
                        },
                    },
                });
                httpRes = mockRes();
                nextRequestHandler = sinon.stub();

                checkPermissions([randomPermission], httpReq, httpRes, nextRequestHandler);
            });

            it('it triggers the next request handler', () => {
                expect(nextRequestHandler).to.have.been.calledOnce;
            });
        });
    });
});
