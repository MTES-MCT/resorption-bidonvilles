const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { mockReq, mockRes } = require('sinon-express-mock');

const mockModels = {
    fieldType: {
        findAll: sinon.stub(),
    },
    ownerType: {
        findAll: sinon.stub(),
    },
    socialOrigin: {
        findAll: sinon.stub(),
    },
    departement: {
        findAll: sinon.stub(),
    },
    region: {
        findAll: sinon.stub(),
    },
    closingSolution: {
        findAll: sinon.stub(),
    },
    role: {
        findAll: sinon.stub(),
    },
    fundingType: {
        findAll: sinon.stub(),
    },
    planType: {
        findAll: sinon.stub(),
    },
    electricityType: {
        findAll: sinon.stub(),
    },
    user: {
        findOne: sinon.stub(),
    },
    changelog: {
        getChangelogFor: sinon.stub(),
    },
};

const { list } = require('#server/controllers/configController')(mockModels);

const { expect } = chai;
chai.use(sinonChai);

describe('[server/controllers] configController', () => {
    let httpRes;
    let httpReq;
    let response;

    describe('.list()', () => {
        describe('if all queries succeed', () => {
            let fieldTypes;
            let ownerTypes;
            let socialOrigins;
            let departements;
            let regions;
            let closingSolutions;
            let user;
            let roles;
            let fundingTypes;
            let planTypes;
            let electricityTypes;
            beforeEach(async () => {
                user = {
                    [global.generate('string')]: global.generate('string'),
                };
                httpReq = mockReq({
                    user,
                });
                httpRes = mockRes();

                fieldTypes = [global.generate('string'), global.generate('string')];
                ownerTypes = [global.generate('string'), global.generate('string')];
                socialOrigins = [global.generate('string'), global.generate('string')];
                departements = [global.generate('string'), global.generate('string')];
                regions = [global.generate('string'), global.generate('string')];
                closingSolutions = [global.generate('string'), global.generate('string')];
                roles = [global.generate('string'), global.generate('string')];
                fundingTypes = [global.generate('string'), global.generate('string')];
                planTypes = [global.generate('string'), global.generate('string')];
                electricityTypes = [global.generate('string'), global.generate('string')];

                mockModels.fieldType.findAll.resolves(fieldTypes);
                mockModels.ownerType.findAll.resolves(ownerTypes);
                mockModels.socialOrigin.findAll.resolves(socialOrigins);
                mockModels.departement.findAll.resolves(departements);
                mockModels.region.findAll.resolves(regions);
                mockModels.closingSolution.findAll.resolves(closingSolutions);
                mockModels.role.findAll.resolves(roles);
                mockModels.fundingType.findAll.resolves(fundingTypes);
                mockModels.planType.findAll.resolves(planTypes);
                mockModels.electricityType.findAll.resolves(electricityTypes);

                await list(httpReq, httpRes);
                [response] = httpRes.send.getCalls()[0].args;
            });

            it('it responds with a 200', () => {
                expect(httpRes.status).to.have.been.calledWith(200);
            });

            it('it responds with the proper config', () => {
                expect(response).to.be.eql({
                    user,
                    field_types: fieldTypes,
                    owner_types: ownerTypes,
                    social_origins: socialOrigins,
                    departements,
                    regions,
                    closing_solutions: closingSolutions,
                    roles,
                    funding_types: fundingTypes,
                    plan_types: planTypes,
                    electricity_types: electricityTypes,
                });
            });
        });

        const dataSets = Object.keys(mockModels);
        dataSets.forEach((failingModel) => {
            describe(`if the query for ${failingModel}s fail`, () => {
                let error;
                beforeEach(async () => {
                    httpReq = mockReq({});
                    httpRes = mockRes();

                    error = global.generate('string');
                    Object.keys(mockModels).forEach((modelName) => {
                        if (modelName === failingModel) {
                            mockModels[modelName].findAll.rejects(new Error(error));
                        } else {
                            mockModels[modelName].findAll.resolves([global.generate('string')]);
                        }
                    });

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
        });
    });
});
