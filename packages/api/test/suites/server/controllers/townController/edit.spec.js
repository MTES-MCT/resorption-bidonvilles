/* eslint-disable global-require */

/* **************************************************************************************************
 * TOOLS
 * *********************************************************************************************** */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewiremock = require('rewiremock/node');
const { sequelize, dataTypes } = require('sequelize-test-helpers');

const { mockReq, mockRes } = require('sinon-express-mock');

const { expect } = chai;
chai.use(sinonChai);


/* **************************************************************************************************
 * FIXTURES
 * *********************************************************************************************** */

const models = {
    Shantytown: rewiremock.proxy('#db/models/shantytowns', {
        'sequelize-temporal': model => model,
    })(sequelize, dataTypes),
};
const otherModels = {
    ownerType: require('#server/models/ownerTypeModel')({}),
    geo: require('#server/models/geoModel')({}),
};
const rewiredStubs = {
    '#db/models': {
        sequelize: Object.assign({}, sequelize, {
            transaction: (cb => cb()),
        }),
        Shantytown: {
            findOne: sinon.stub(),
        },
    },
};
const diStubs = {};
const edit = rewiremock.proxy('#server/controllers/townController/edit', rewiredStubs)(diStubs);


/* **************************************************************************************************
 * TESTS
 * *********************************************************************************************** */

describe.only('townController.edit()', () => {
    /* *******************
     * Common resources
     * **************** */

    let reqArg = {};
    beforeEach(() => {
        reqArg = {
            user: {
                id: 42,
                permissions: {
                    shantytown: {
                        update: {
                            allowed: true,
                            geographic_level: 'nation',
                            data_justice: false,
                        },
                    },
                },
            },
            params: {
                id: 42,
            },

            body: {
                built_at: new Date(625273200000),
                declared_at: null,
                latitude: 49.414964,
                longitude: 2.817893,
                citycode: '60159',
                address: 'Rue Roger Couttolenc 60200 Compiègne, 60, Oise, Hauts-de-France',
                name: null,
                detailed_address: null,
                field_type: 1,
                owner_type: 1,
                owner: null,
                census_status: null,
                census_conducted_at: null,
                census_conducted_by: null,
                population_total: null,
                population_couples: null,
                population_minors: null,
                population_minors_0_3: null,
                population_minors_3_6: null,
                population_minors_6_12: null,
                population_minors_12_16: null,
                population_minors_16_18: null,
                social_origins: [],
                electricity_type: 1,
                electricity_comments: null,
                access_to_water: null,
                access_to_sanitary: null,
                sanitary_comments: null,
                water_comments: null,
                trash_evacuation: null,
                owner_complaint: null,
                justice_rendered_at: null,
                justice_rendered_by: null,
                police_status: null,
                police_requested_at: null,
                police_granted_at: null,
                bailiff: null,
                closed_at: null,
            },
        };

        diStubs.ownerType = sinon.stub(otherModels.ownerType);
        diStubs.ownerType.findOne.withArgs(1).resolves({
            id: 1,
            label: 'Inconnu',
        });

        diStubs.geo = sinon.stub(otherModels.geo);
        diStubs.geo.getLocation.withArgs('city', '60159').resolves({
            type: 'city',
            region: {
                code: '32',
                name: 'Hauts-de-France',
            },
            departement: {
                code: '60',
                name: 'Oise',
            },
            epci: {
                code: '200067965',
                name: 'CA de la Région de Compiègne et de la Basse Automne',
            },
            city: {
                code: '60159',
                name: 'Compiègne',
            },
        });
    });

    afterEach(() => {
        Object.keys(diStubs).forEach((key) => {
            Object.keys(diStubs[key]).forEach((method) => {
                diStubs[key][method].restore();
            });
        });
    });


    /* *******************
     * Success case
     * **************** */
    describe('if the user does not have justice permission', () => {
        it('maintains the previous value of justice entries', async () => {
            // setup (overly complicated, as expected...)
            const values = {
                ownerComplaint: true,
                justiceProcedure: true,
                justiceRendered: true,
                justiceRenderedBy: 'TGI de Versailles',
                justiceRenderedAt: (new Date()).getTime(),
                justiceChallenged: true,
                policeStatus: 'granted',
                policeRequestedAt: (new Date()).getTime(),
                policeGrantedAt: (new Date()).getTime(),
                bailiff: 'Huissier',
            };
            const mock = new models.Shantytown();
            Object.keys(values).forEach((key) => {
                mock[key] = values[key];
            });
            rewiredStubs['#db/models'].Shantytown.findOne.withArgs({
                where: {
                    shantytown_id: reqArg.params.id,
                },
            }).resolves(mock);
            const req = mockReq(reqArg);
            const res = mockRes();

            // execute
            await edit(req, res, sinon.stub());
            expect(mock.update).to.have.been.calledWithMatch(
                {
                    builtAt: new Date(625273200000),
                    declaredAt: null,
                    latitude: 49.414964,
                    longitude: 2.817893,
                    city: '60159',
                    address: 'Rue Roger Couttolenc 60200 Compiègne, 60, Oise, Hauts-de-France',
                    name: null,
                    addressDetails: null,
                    fieldType: 1,
                    ownerType: 1,
                    owner: null,
                    censusStatus: null,
                    censusConductedAt: null,
                    censusConductedBy: null,
                    populationTotal: null,
                    populationCouples: null,
                    populationMinors: null,
                    populationMinors0To3: null,
                    populationMinors3To6: null,
                    populationMinors6To12: null,
                    populationMinors12To16: null,
                    populationMinors16To18: null,
                    electricityType: 1,
                    electricityComments: null,
                    accessToWater: null,
                    accessToSanitary: null,
                    sanitaryComments: null,
                    waterComments: null,
                    trashEvacuation: null,

                    ownerComplaint: mock.ownerComplaint,
                    justiceProcedure: mock.justiceProcedure,
                    justiceRendered: mock.justiceRendered,
                    justiceRenderedBy: mock.justiceRenderedBy,
                    justiceRenderedAt: mock.justiceRenderedAt,
                    justiceChallenged: mock.justiceChallenged,
                    policeStatus: mock.policeStatus,
                    policeRequestedAt: mock.policeRequestedAt,
                    policeGrantedAt: mock.policeGrantedAt,
                    bailiff: mock.bailiff,

                    updatedBy: reqArg.user.id,
                },
            );
        });
    });

    describe('Access to sanitary', () => {
        it('Should update correctly accessToSanitary and sanitaryComments fields', async () => {
            const mock = new models.Shantytown();
            rewiredStubs['#db/models'].Shantytown.findOne.withArgs({
                where: {
                    shantytown_id: reqArg.params.id,
                },
            }).resolves(mock);
            reqArg.body = { ...reqArg.body, access_to_sanitary: true, sanitary_comments: 'test' };
            const req = mockReq(reqArg);
            const res = mockRes();

            // execute
            await edit(req, res, sinon.stub());

            expect(mock.update).to.have.been.calledWithMatch(
                {
                    builtAt: new Date(625273200000),
                    declaredAt: null,
                    latitude: 49.414964,
                    longitude: 2.817893,
                    city: '60159',
                    address: 'Rue Roger Couttolenc 60200 Compiègne, 60, Oise, Hauts-de-France',
                    name: null,
                    addressDetails: null,
                    fieldType: 1,
                    ownerType: 1,
                    owner: null,
                    censusStatus: null,
                    censusConductedAt: null,
                    censusConductedBy: null,
                    populationTotal: null,
                    populationCouples: null,
                    populationMinors: null,
                    populationMinors0To3: null,
                    populationMinors3To6: null,
                    populationMinors6To12: null,
                    populationMinors12To16: null,
                    populationMinors16To18: null,
                    electricityType: 1,
                    electricityComments: null,
                    accessToWater: null,
                    sanitaryComments: 'test',
                    accessToSanitary: true,
                    waterComments: null,
                    trashEvacuation: null,
                },
            );
        });
    });
});
