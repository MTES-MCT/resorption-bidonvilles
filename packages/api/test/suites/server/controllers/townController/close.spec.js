const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { mockReq, mockRes } = require('sinon-express-mock');
const { makeMockModels } = require('sequelize-test-helpers');
const proxyquire = require('proxyquire');
const sequelize = require('sequelize');

const mockShantytownModel = {
    findOne: sinon.stub(),
    findAll: sinon.stub(),
};

const mockClosingSolution = {
    findOne: sinon.stub(),
    findAll: sinon.stub(),
};

const mockModels = Object.assign(
    makeMockModels({
        Shantytown: mockShantytownModel,
        ClosingSolution: mockClosingSolution,
    }),
    {
        sequelize: Object.assign({
            query: sinon.stub(),
            transaction: cb => cb(),
        }, sequelize),
    },
);


const { close } = proxyquire('#server/controllers/townController', {
    '#db/models': mockModels,

})({});

const { expect } = chai;
chai.use(sinonChai);
let httpRes;
let httpReq;

describe.only('.close()', () => {
    it('should success if params are valid and closed_with_solutions is false', async () => {
        const randomId = global.generate('number');
        const town = {
            id: randomId,
            update: sinon.stub(),
        };
        const fakePermissions = [global.generate('string'), global.generate('string')];
        httpReq = mockReq({
            params: {
                id: randomId,
            },
            user: {
                id: randomId,
                permissions: {
                    data: fakePermissions,
                },
            },
            body: {
                closed_at: (new Date(2000, 0, 1)).toString(),
                closed_with_solutions: false,
                solutions: [{ id: '1', peopleAffected: 1, households_affected: 1 }],
                status: 'closed_by_admin',
            },
        });
        httpRes = mockRes();
        mockClosingSolution.findAll.resolves([{
            id: 1,
            label: 'Whatever 1',
        },
        {
            id: 2,
            label: 'Whatever 2',
        }]);
        mockShantytownModel.findOne.resolves(town);

        await close(httpReq, httpRes);

        expect(town.update).to.have.been.calledWithMatch({
            status: 'closed_by_admin',
            closedAt: httpReq.body.closed_at,
            closedWithSolutions: 'no',
            updatedBy: httpReq.user.id,
        });
    });
    it('should success if params are valid and closed_with_solutions is true', async () => {
        const randomId = global.generate('number');
        const town = {
            id: randomId,
            update: sinon.stub(),
        };
        const fakePermissions = [global.generate('string'), global.generate('string')];
        httpReq = mockReq({
            params: {
                id: randomId,
            },
            user: {
                id: randomId,
                permissions: {
                    data: fakePermissions,
                },
            },
            body: {
                closed_at: (new Date(2000, 0, 1)).toString(),
                closed_with_solutions: true,
                solutions: [{ id: '1', peopleAffected: 1, households_affected: 1 }],
                status: 'closed_by_admin',
            },
        });
        httpRes = mockRes();
        mockClosingSolution.findAll.resolves([{
            id: 1,
            label: 'Whatever 1',
        },
        {
            id: 2,
            label: 'Whatever 2',
        }]);
        mockShantytownModel.findOne.resolves(town);

        await close(httpReq, httpRes);

        expect(town.update).to.have.been.calledWithMatch({
            status: 'closed_by_admin',
            closedAt: httpReq.body.closed_at,
            closedWithSolutions: 'yes',
            updatedBy: httpReq.user.id,
        });
    });
    it.only('should fails if params is missing closed_with_solutions', async () => {
        const randomId = global.generate('number');
        const town = {
            id: randomId,
            update: sinon.stub(),
        };
        const fakePermissions = [global.generate('string'), global.generate('string')];
        httpReq = mockReq({
            params: {
                id: randomId,
            },
            user: {
                id: randomId,
                permissions: {
                    data: fakePermissions,
                },
            },
            body: {
                closed_at: (new Date(2000, 0, 1)).toString(),
                solutions: [{ id: '1', peopleAffected: 1, households_affected: 1 }],
                status: 'closed_by_admin',
            },
        });
        httpRes = mockRes();
        mockClosingSolution.findAll.resolves([{
            id: 1,
            label: 'Whatever 1',
        },
        {
            id: 2,
            label: 'Whatever 2',
        }]);
        mockShantytownModel.findOne.resolves(town);

        await close(httpReq, httpRes);

        expect(httpRes.status).to.have.been.calledOnceWith(400);
        expect(httpRes.send).to.have.been.calledWithMatch({
            error: {
                developer_message: 'The submitted data contains errors',
                user_message: 'Certaines données sont invalides',
                fields: { closed_with_solutions: ['Ce champ est obligatoire'] },
            },
        });
    });
});
