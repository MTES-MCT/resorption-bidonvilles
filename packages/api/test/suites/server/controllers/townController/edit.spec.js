/* eslint-disable global-require */

/* **************************************************************************************************
 * TOOLS
 * *********************************************************************************************** */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewiremock = require('rewiremock/node');
const { sequelize } = require('sequelize-test-helpers');

const { mockReq, mockRes } = require('sinon-express-mock');

const { expect } = chai;
chai.use(sinonChai);


/* **************************************************************************************************
 * FIXTURES
 * *********************************************************************************************** */

const otherModels = {
    ownerType: require('#server/models/ownerTypeModel')({}),
    geo: require('#server/models/geoModel')({}),
};
const queryStub = sinon.stub();
const rewiredStubs = {
    '#db/models': {
        sequelize: Object.assign({}, sequelize, {
            transaction: (cb => cb()),
            query: queryStub,
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
    let now;
    let clock;
    beforeEach(() => {
        // stub time
        now = new Date();
        clock = sinon.useFakeTimers(now.getTime());

        queryStub.onCall(0).returns([[{ hid: 1 }]]);

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
                minors_in_school: null,
                social_origins: [],
                electricity_type: 1,
                electricity_comments: null,
                access_to_water: null,
                access_to_sanitary: null,
                sanitary_comments: null,
                sanitary_insalubrious: null,
                sanitary_number: null,
                sanitary_on_site: null,
                water_comments: null,
                water_continuous_access: null,
                water_distance: null,
                water_everyone_has_access: null,
                water_hand_wash_access: null,
                water_hand_wash_access_number: null,
                water_potable: null,
                water_public_point: null,
                water_roads_to_cross: null,
                water_stagnant_water: null,
                trash_evacuation: null,
                trash_evacuation_regular: null,
                trash_accumulation: null,
                trash_cans_on_site: null,
                vermin: null,
                vermin_comments: null,
                fire_prevention_comments: null,
                fire_prevention_devices: null,
                fire_prevention_diagnostic: null,
                fire_prevention_measures: null,
                fire_prevention_site_accessible: null,
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
        clock.restore();
        queryStub.reset();
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
            const mock = {
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
            rewiredStubs['#db/models'].Shantytown.findOne.withArgs({
                where: {
                    shantytown_id: reqArg.params.id,
                },
            }).resolves(mock);
            const req = mockReq(reqArg);
            const res = mockRes();

            // execute
            await edit(req, res, sinon.stub());
            expect(queryStub).to.have.been.calledWith(
                sinon.match.any,
                {
                    transaction: undefined,
                    replacements: {
                        id: req.params.id,
                        built_at: new Date(625273200000),
                        declared_at: null,
                        latitude: 49.414964,
                        longitude: 2.817893,
                        fk_city: '60159',
                        address: 'Rue Roger Couttolenc 60200 Compiègne, 60, Oise, Hauts-de-France',
                        name: null,
                        address_details: null,
                        fk_field_type: 1,
                        fk_owner_type: 1,
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
                        minors_in_school: null,
                        fk_electricity_type: 1,
                        electricity_comments: null,
                        access_to_water: null,
                        access_to_sanitary: null,
                        sanitary_comments: null,
                        sanitary_insalubrious: null,
                        sanitary_number: null,
                        sanitary_on_site: null,
                        water_comments: null,
                        water_continuous_access: null,
                        water_distance: null,
                        water_everyone_has_access: null,
                        water_hand_wash_access: null,
                        water_hand_wash_access_number: null,
                        water_potable: null,
                        water_public_point: null,
                        water_roads_to_cross: null,
                        water_stagnant_water: null,
                        trash_evacuation: null,
                        trash_evacuation_regular: null,
                        trash_accumulation: null,
                        trash_cans_on_site: null,
                        vermin: null,
                        vermin_comments: null,
                        fire_prevention_comments: null,
                        fire_prevention_devices: null,
                        fire_prevention_diagnostic: null,
                        fire_prevention_measures: null,
                        fire_prevention_site_accessible: null,
                        owner_complaint: mock.ownerComplaint,
                        justice_procedure: mock.justiceProcedure,
                        justice_rendered: mock.justiceRendered,
                        justice_rendered_by: mock.justiceRenderedBy,
                        justice_rendered_at: mock.justiceRenderedAt,
                        justice_challenged: mock.justiceChallenged,
                        police_status: mock.policeStatus,
                        police_requested_at: mock.policeRequestedAt,
                        police_granted_at: mock.policeGrantedAt,
                        bailiff: mock.bailiff,
                        updated_by: reqArg.user.id,
                        updated_at: now,
                    },
                },
            );
        });
    });

    describe('Access to sanitary', () => {
        it('Should update correctly accessToSanitary and sanitaryComments fields', async () => {
            rewiredStubs['#db/models'].Shantytown.findOne.withArgs({
                where: {
                    shantytown_id: reqArg.params.id,
                },
            }).resolves({});
            reqArg.body = { ...reqArg.body, access_to_sanitary: true, sanitary_comments: 'test' };
            const req = mockReq(reqArg);
            const res = mockRes();

            // execute
            await edit(req, res, sinon.stub());

            expect(queryStub).to.have.been.calledWith(
                sinon.match.any,
                {
                    transaction: undefined,
                    replacements: {
                        id: req.params.id,
                        built_at: new Date(625273200000),
                        declared_at: null,
                        latitude: 49.414964,
                        longitude: 2.817893,
                        fk_city: '60159',
                        address: 'Rue Roger Couttolenc 60200 Compiègne, 60, Oise, Hauts-de-France',
                        name: null,
                        address_details: null,
                        fk_field_type: 1,
                        fk_owner_type: 1,
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
                        minors_in_school: null,
                        fk_electricity_type: 1,
                        electricity_comments: null,
                        access_to_water: null,
                        access_to_sanitary: true,
                        sanitary_comments: 'test',
                        sanitary_insalubrious: null,
                        sanitary_number: null,
                        sanitary_on_site: null,
                        water_comments: null,
                        water_continuous_access: null,
                        water_distance: null,
                        water_everyone_has_access: null,
                        water_hand_wash_access: null,
                        water_hand_wash_access_number: null,
                        water_potable: null,
                        water_public_point: null,
                        water_roads_to_cross: null,
                        water_stagnant_water: null,
                        trash_evacuation: null,
                        trash_evacuation_regular: null,
                        trash_accumulation: null,
                        trash_cans_on_site: null,
                        vermin: null,
                        vermin_comments: null,
                        fire_prevention_comments: null,
                        fire_prevention_devices: null,
                        fire_prevention_diagnostic: null,
                        fire_prevention_measures: null,
                        fire_prevention_site_accessible: null,
                        owner_complaint: undefined,
                        justice_procedure: undefined,
                        justice_rendered: undefined,
                        justice_rendered_by: undefined,
                        justice_rendered_at: undefined,
                        justice_challenged: undefined,
                        police_status: undefined,
                        police_requested_at: undefined,
                        police_granted_at: undefined,
                        bailiff: undefined,
                        updated_by: reqArg.user.id,
                        updated_at: now,
                    },
                },
            );
        });
    });
});
