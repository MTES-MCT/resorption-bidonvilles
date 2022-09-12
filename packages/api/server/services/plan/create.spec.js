const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const departementModel = require('#server/models/departementModel');
const financeTypeModel = require('#server/models/financeTypeModel');
const topicModel = require('#server/models/topicModel');

const planModel = require('#server/models/planModel');
const financeRowModel = require('#server/models/financeRowModel');
const planManagerModel = require('#server/models/planManagerModel');
const locationModel = require('#server/models/locationModel');
const planDepartementModel = require('#server/models/planDepartementModel');
const planTopicsModel = require('#server/models/planTopicsModel');
const planShantytownModel = require('#server/models/planShantytownModel');
const planOperatorModel = require('#server/models/planOperatorModel');
const userModel = require('#server/models/userModel');
const createService = require('./create');


describe.only('services/plan', () => {
    describe('create()', () => {
        let stubs;
        const departement = global.generate('string');
        const financeTypes = [
            { uid: global.generate('number'), name: global.generate('string') },
            { uid: global.generate('number'), name: global.generate('string') },
            { uid: global.generate('number'), name: global.generate('string') },
        ];

        console.log(`financeTypes: ${JSON.stringify(financeTypes)}`);

        const topics = [
            { uid: global.generate('number'), name: global.generate('string') },
            { uid: global.generate('number'), name: global.generate('string') },
            { uid: global.generate('number'), name: global.generate('string') },
        ];

        console.log(`topics: ${JSON.stringify(topics)}`);

        const planId = global.generate('number');
        const user = {
            id: global.generate('number'),
            isAllowedTo: sinon.stub(),
        };
        const manager = {
            id: global.generate('number'),
        };

        const planData = {
            name: global.generate('string'),
            startedAt: global.generate('stringdate'),
            expectedToEnd_at: null,
            in_and_out: true,
            topics: topics.slice(0, 2).map(topic => topic.uid),
            goals: global.generate('string'),
            category_id: global.generate('string'),
            locationType: 'housing',
            location_details: global.generate('string'),
            location_id: global.generate('string'),
            created_by: user.id,
            final_comment: global.generate('string'),
            departement,
            association: [global.generate('string')],
            government: [manager],
            contact: global.generate('string'),
            finances: [
                {
                    year: global.generate('string'),
                    data: [
                        {
                            type: global.generate('string'),
                            amount: global.generate('string'),
                            realAmount: global.generate('string'),
                            details: global.generate('string'),
                        },
                    ],
                },
            ],
        };
        console.log(JSON.stringify(planData));

        const plan = { planId };


        beforeEach(() => {
            stubs = {
                departementModelFindOne: sinon.stub(departementModel, 'findOne'),
                financeTypeFindAll: sinon.stub(financeTypeModel, 'findAll'),
                topicModelFindAll: sinon.stub(topicModel, 'findAll'),

                planDepartementCreate: sinon.stub(planDepartementModel, 'create'),
                locationCreate: sinon.stub(locationModel, 'create'),
                planCreate: sinon.stub(planModel, 'create'),
                planTopicsCreate: sinon.stub(planTopicsModel, 'create'),
                planShantytownCreate: sinon.stub(planShantytownModel, 'create'),
                financeRowCreate: sinon.stub(financeRowModel, 'create'),
                planManagerCreate: sinon.stub(planManagerModel, 'create'),
                planOperatorCreate: sinon.stub(planOperatorModel, 'create'),
                findOne: sinon.stub(planModel, 'findOne'),
                getUser: sinon.stub(userModel, 'findOne'),
                getManagers: sinon.stub(userModel, 'findByIds'),
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

                stubs.planCreate.resolves(planId);
                stubs.findOne.resolves(plan);
                stubs.getUser.resolves(user);
                stubs.getManagers.resolves(manager);
                await createService(planData, user);
                expect(stubs.planCreate).to.have.been.calledOnceWith({
                    ...{
                        name: planData.name,
                        startedAt: planData.startedAt,
                        expectedToEndAt: planData.expectedToEndAt,
                        inAndOut: planData.in_and_out,
                        topics: planData.topics,
                        goals: planData.goals,
                        fk_category: planData.category_id,
                        locationType: planData.locationType,
                        locationDetails: planData.location_details,
                        fk_location: planData.location_id,
                        createdBy: user.id,
                    },
                });
            });
        });
    });
});
