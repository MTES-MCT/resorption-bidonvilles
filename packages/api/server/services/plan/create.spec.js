const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiSubset = require('chai-subset');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const departementModel = require('#server/models/departementModel');
const financeTypeModel = require('#server/models/financeTypeModel');
const topicModel = require('#server/models/topicModel');
const userModel = require('#server/models/userModel');
const planModel = require('#server/models/planModel');
const financeModel = require('#server/models/financeModel');
const financeRowModel = require('#server/models/financeRowModel');
const planManagerModel = require('#server/models/planManagerModel');
const locationModel = require('#server/models/locationModel');
const planDepartementModel = require('#server/models/planDepartementModel');
const planTopicsModel = require('#server/models/planTopicsModel');
const planShantytownModel = require('#server/models/planShantytownModel');
const planOperatorModel = require('#server/models/planOperatorModel');
const permissionModel = require('#server/models/permissionModel');
const attachmentsObject = require('#server/models/permissionModel/addAttachments');

const createService = require('./create');

function randomIndex(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

describe.only('services/plan', () => {
    describe('create()', () => {
        let stubs;
        const departement = global.generate('string');
        const financeTypes = [
            { uid: global.generate('number'), name: global.generate('string') },
            { uid: global.generate('number'), name: global.generate('string') },
            { uid: global.generate('number'), name: global.generate('string') },
        ];

        const topics = [
            { uid: global.generate('number'), name: global.generate('string') },
            { uid: global.generate('number'), name: global.generate('string') },
            { uid: global.generate('number'), name: global.generate('string') },
        ];

        const locationTypes = ['shantytowns', 'location', 'housing', 'other'];

        const years = ['2017', '2018', '2019', '2020', '2021', '2022'];

        const financeId = global.generate('number');
        const finances = [
            {
                year: years[randomIndex(0, 6)],
                data: [{
                    type: financeTypes[randomIndex(0, 2)].uid,
                    amount: global.generate('number'),
                    realAmount: global.generate('number'),
                    details: global.generate('string'),
                }],
            },
        ];

        const planId = global.generate('number');
        const user = {
            id: global.generate('number'),
            isAllowedTo: sinon.stub(),
        };
        const manager = {
            id: global.generate('number'),
        };

        const operator = {
            id: 10,
            organization: {
                id: global.generate('number'),
                category: {
                    uid: 'association',
                },
            },
        };

        const locationType = locationTypes[randomIndex(1, 3)];
        const locationAddress = (locationType.includes('location'))
            ? {
                address: global.generate('string'),
                location: {
                    coordinates: [global.generate('string'), global.generate('string')],
                },
            } : null;
        const locationId = global.generate('number');
        const locationDetails = (locationType.includes('other')) ? global.generate('string') : null;

        const planData = {
            name: global.generate('string'),
            startedAt: global.generate('date'),
            expectedToEndAt: null,
            in_and_out: 0,
            topics: topics.slice(0, 2).map(topic => topic.uid),
            goals: global.generate('string'),
            category_id: global.generate('string'),
            locationType,
            locationAddress,
            locationDetails,
            location_id: global.generate('string'),
            created_by: user.id,
            final_comment: global.generate('string'),
            departement,
            association: [global.generate('string')],
            government: [manager],
            contact: operator.id,
            finances,
        };
        const plan = { planId };

        beforeEach(() => {
            stubs = {
                departementModelFindOne: sinon.stub(departementModel, 'findOne'),
                financeTypeFindAll: sinon.stub(financeTypeModel, 'findAll'),
                topicModelFindAll: sinon.stub(topicModel, 'findAll'),
                getManagers: sinon.stub(userModel, 'findByIds'),
                planDepartementCreate: sinon.stub(planDepartementModel, 'create'),
                locationCreate: sinon.stub(locationModel, 'create'),
                planCreate: sinon.stub(planModel, 'create'),
                planTopicsCreate: sinon.stub(planTopicsModel, 'create'),
                planShantytownCreate: sinon.stub(planShantytownModel, 'create'),
                financeCreate: sinon.stub(financeModel, 'create'),
                financeRowCreate: sinon.stub(financeRowModel, 'create'),
                planManagerCreate: sinon.stub(planManagerModel, 'create'),
                planOperatorCreate: sinon.stub(planOperatorModel, 'create'),
                permissionCreate: sinon.stub(permissionModel, 'addAttachments'),
                findOne: sinon.stub(planModel, 'findOne'),
                getUser: sinon.stub(userModel, 'findOne'),
                createAttachments: sinon.stub(attachmentsObject, 'addAttachments'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        describe('create()', () => {
            it('créer une action en bdd avec les données fournies par l\'utilisateur', async () => {
                user.isAllowedTo.returns(true);
                stubs.departementModelFindOne.resolves(departement);
                stubs.financeTypeFindAll.resolves(financeTypes);
                stubs.topicModelFindAll.resolves(topics);
                stubs.getManagers.resolves([manager]);
                stubs.getUser.resolves(operator);
                stubs.locationCreate.resolves(locationId);
                stubs.planDepartementCreate.resolves(planId);
                stubs.planCreate.resolves(planId);
                stubs.planTopicsCreate.resolves([]);
                stubs.planShantytownCreate.resolves([]);
                stubs.financeCreate.resolves([financeId]);
                stubs.financeRowCreate.resolves([]);
                stubs.planManagerCreate.resolves([]);
                stubs.planOperatorCreate.resolves([]);
                stubs.planOperatorCreate.resolves([]);
                stubs.createAttachments.resolves([]);
                stubs.findOne.resolves(plan);
                await createService(planData, user);
                expect(stubs.planCreate).to.have.been.calledOnce;
                const args = stubs.planCreate.getCalls()[0].args[0];

                expect(args).to.containSubset({
                    name: planData.name,
                    startedAt: planData.startedAt,
                    expectedToEndAt: planData.expectedToEndAt,
                    inAndOut: !!planData.in_and_out,
                    goals: planData.goals,
                    locationType: planData.locationType,
                    locationDetails: planData.locationDetails,
                    createdBy: user.id,
                });
            });
        });
    });
});
