const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { mockReq, mockRes } = require('sinon-express-mock');
const { makeMockModels } = require('sequelize-test-helpers');
const proxyquire = require('proxyquire');
const sequelize = require('sequelize');

const mockModels = Object.assign(
    makeMockModels({
        Shantytown: {},
    }),
    {
        sequelize: Object.assign({
            query: sinon.stub(),
        }, sequelize),
    },
);

const mockShantytownModel = {
    findAll: sinon.stub(),
    findOne: sinon.stub(),
};

const { list, find } = proxyquire('#server/controllers/townController', {
    '#db/models': mockModels,
})({
    shantytown: mockShantytownModel,
});

const { expect } = chai;
chai.use(sinonChai);

describe('Controllers/Shantytown', () => {
    let httpRes;
    let httpReq;
    let response;

    describe('.list()', () => {
        describe('if the query succeeds', () => {
            let towns;
            beforeEach(async () => {
                httpReq = mockReq({
                    user: {
                        permissions: {},
                    },
                });
                httpRes = mockRes();
                towns = [global.generate('string'), global.generate('string'), global.generate('string')];
                mockShantytownModel.findAll.resolves(towns);

                await list(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 200', () => {
                expect(httpRes.status).to.have.been.calledWith(200);
            });

            it('it responds with the proper list of towns', () => {
                expect(response).to.be.eql(towns);
            });
        });

        describe('if the query fails', () => {
            let error;
            beforeEach(async () => {
                httpReq = mockReq({
                    user: {
                        permissions: {},
                    },
                });
                httpRes = mockRes();
                error = global.generate('string');
                mockShantytownModel.findAll.rejects(new Error(error));

                await list(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 500', () => {
                expect(httpRes.status).to.have.been.calledWith(500);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql(error);
            });
        });

        it('it responds with data matching the user\'s permissions', async () => {
            const fakePermissions = [global.generate('string'), global.generate('string')];
            httpReq = mockReq({
                user: {
                    permissions: {
                        data: fakePermissions,
                    },
                },
            });
            httpRes = mockRes();
            const towns = [global.generate('string'), global.generate('string'), global.generate('string')];
            mockShantytownModel.findAll.withArgs(fakePermissions).resolves(towns);

            await list(httpReq, httpRes);
            [response] = httpRes.send.getCalls()[0].args;

            expect(response).to.be.eql(towns);
        });
    });

    describe('.find()', () => {
        describe('if the query succeeds', () => {
            describe('if the id does not match a shantytown', () => {
                beforeEach(async () => {
                    const randomId = global.generate('number');
                    httpReq = mockReq({
                        params: {
                            id: randomId,
                        },
                        user: {
                            permissions: {},
                        },
                    });
                    httpRes = mockRes();
                    mockShantytownModel.findOne.withArgs(randomId).resolves(null);

                    await find(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 404', () => {
                    expect(httpRes.status).to.have.been.calledWith(404);
                });

                it('it responds with the proper error messages', () => {
                    expect(response).to.be.eql({
                        error: {
                            developer_message: 'The requested town does not exist',
                            user_message: 'Le site demandé n\'existe pas en base de données',
                        },
                    });
                });
            });

            describe('if the id matches a shantytown', () => {
                let town;
                beforeEach(async () => {
                    const randomId = global.generate('number');
                    town = {
                        id: randomId,
                    };
                    httpReq = mockReq({
                        params: {
                            id: randomId,
                        },
                        user: {
                            permissions: {},
                        },
                    });
                    httpRes = mockRes();
                    mockShantytownModel.findOne.withArgs(randomId).resolves(town);

                    await find(httpReq, httpRes);
                    [response] = httpRes.send.getCalls()[0].args;
                });

                it('it responds with a 200', () => {
                    expect(httpRes.status).to.have.been.calledWith(200);
                });

                it('it responds with the proper town', () => {
                    expect(response).to.be.eql(town);
                });
            });
        });

        describe('if the query fails', () => {
            let error;
            beforeEach(async () => {
                httpReq = mockReq({
                    user: {
                        permissions: {},
                    },
                });
                httpRes = mockRes();
                error = global.generate('string');
                mockShantytownModel.findOne.rejects(new Error(error));

                await find(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 500', () => {
                expect(httpRes.status).to.have.been.calledWith(500);
            });

            it('it responds with the proper error messages', () => {
                expect(response).to.be.eql(error);
            });
        });

        it('it responds with data matching the user\'s permissions', async () => {
            const randomId = global.generate('number');
            const town = {
                id: randomId,
            };
            const fakePermissions = [global.generate('string'), global.generate('string')];
            httpReq = mockReq({
                params: {
                    id: randomId,
                },
                user: {
                    permissions: {
                        data: fakePermissions,
                    },
                },
            });
            httpRes = mockRes();
            mockShantytownModel.findOne.withArgs(randomId, fakePermissions).resolves(town);

            await find(httpReq, httpRes);
            [response] = httpRes.send.getCalls()[0].args;

            expect(response).to.be.eql(town);
        });
    });
});
