const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { mockReq, mockRes } = require('sinon-express-mock');

const mockModels = {
    plan: {
        findAll: sinon.stub(),
    },
};

const { list } = require('#server/controllers/planController')(mockModels);

const { expect } = chai;
chai.use(sinonChai);

describe('[server/controllers] planController.list()', () => {
    let httpRes;
    let httpReq;
    let response;

    describe('if all queries succeed', () => {
        let plans;
        beforeEach(async () => {
            httpReq = mockReq({});
            httpRes = mockRes();

            plans = [global.generate('string'), global.generate('string')];
            mockModels.plan.findAll.resolves(plans);

            await list(httpReq, httpRes);
            [response] = httpRes.send.getCalls()[0].args;
        });

        it('it responds with a 200', () => {
            expect(httpRes.status).to.have.been.calledWith(200);
        });

        it('it responds with the proper list of plans', () => {
            expect(response).to.be.eql(plans);
        });
    });

    describe('if the query for plans fail', () => {
        let error;
        beforeEach(async () => {
            httpReq = mockReq({});
            httpRes = mockRes();

            error = global.generate('string');
            mockModels.plan.findAll.rejects(new Error(error));

            await list(httpReq, httpRes);
            [response] = httpRes.send.getCalls()[0].args;
        });

        it('it responds with a 500', () => {
            expect(httpRes.status).to.have.been.calledWith(500);
        });

        it('it responds with the proper error messages', () => {
            expect(response).to.be.eql({
                error: {
                    user_message: 'Une erreur est survenue lors de la récupération des données en base',
                    developer_message: error,
                },
            });
        });
    });
});
