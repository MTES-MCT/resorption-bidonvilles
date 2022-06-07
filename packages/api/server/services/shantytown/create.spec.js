const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const shantytownModel = require('#server/models/shantytownModel');
const socialOriginModel = require('#server/models/socialOriginModel');
const shantytownToiletTypesModel = require('#server/models/shantytownToiletTypesModel');
const electricityAccessTypesModel = require('#server/models/electricityAccessTypesModel');
const mattermostUtils = require('#server/utils/mattermost');
const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');
const config = require('#server/config');


const createService = require('./create');


describe.only('services/shantytown', () => {
    describe('create()', () => {
        let stubs;
        const shantytownId = global.generate('string');
        const user = {
            id: global.generate('string'),
            isAllowedTo: sinon.stub(),
        };
        const townData = {
            name: global.generate('string'),
            latitude: global.generate('string'),
            longitude: global.generate('string'),
            address: global.generate('string'),
            detailed_address: global.generate('string'),
            built_at: global.generate('string'),
            population_total: global.generate('string'),
            population_couples: global.generate('string'),
            population_minors: global.generate('string'),
            population_minors_0_3: global.generate('string'),
            population_minors_3_6: global.generate('string'),
            population_minors_6_12: global.generate('string'),
            population_minors_12_16: global.generate('string'),
            population_minors_16_18: global.generate('string'),
            minors_in_school: global.generate('string'),
            caravans: global.generate('string'),
            huts: global.generate('string'),
            field_type: global.generate('string'),
            owner_type: global.generate('string'),
            is_reinstallation: global.generate('string'),
            reinstallation_comments: global.generate('string'),
            citycode: global.generate('string'),
            createdBy: user.id,
            declared_at: global.generate('string'),
            census_status: global.generate('string'),
            census_conducted_at: global.generate('string'),
            census_conducted_by: global.generate('string'),
            living_conditions_version: 2,
            water_access_type: 'autre',
            water_access_type_details: 'comment',
            water_access_is_public: false,
            water_access_is_continuous: false,
            water_access_is_continuous_details: 'comment',
            water_access_is_local: true,
            water_access_is_close: true,
            water_access_is_unequal: true,
            water_access_is_unequal_details: 'comment',
            water_access_has_stagnant_water: true,
            water_access_comments: 'comment',

            sanitary_open_air_defecation: true,
            sanitary_toilet_types: ['latrines', 'toilettes_chimiques'],
            sanitary_access_working_toilets: true,
            sanitary_access_toilets_are_inside: true,
            sanitary_access_toilets_are_lighted: true,
            sanitary_access_hand_washing: true,

            electricity_access: true,
            electricity_access_is_unequal: true,
            electricity_access_types: ['electrogene', 'reseau_urbain', 'installation_du_bati'],

            trash_is_piling: true,
            trash_evacuation_is_close: true,
            trash_evacuation_is_safe: true,
            trash_evacuation_is_regular: true,
            trash_bulky_is_piling: true,

            pest_animals: true,
            pest_animals_details: 'comment',

            fire_prevention: true,
        };

        const justiceData = {
            owner_complaint: global.generate('string'),
            justice_procedure: global.generate('string'),
            justice_rendered: global.generate('string'),
            justice_rendered_by: global.generate('string'),
            justice_rendered_at: global.generate('string'),
            justice_challenged: global.generate('string'),
            police_status: global.generate('string'),
            police_requested_at: global.generate('string'),
            police_granted_at: global.generate('string'),
            bailiff: global.generate('string'),
        };
        const owner = global.generate('string');
        const social_origins = global.generate('string');
        const town = { shantytownId };

        beforeEach(() => {
            stubs = {
                electricityAccessTypesCreate: sinon.stub(electricityAccessTypesModel, 'create'),
                shantytownToiletTypesCreate: sinon.stub(shantytownToiletTypesModel, 'create'),
                shantytownCreate: sinon.stub(shantytownModel, 'create'),
                findOne: sinon.stub(shantytownModel, 'findOne'),
                triggerShantytownCreationAlert: sinon.stub(mattermostUtils, 'triggerShantytownCreationAlert'),
                getLocationWatchers: sinon.stub(userModel, 'getLocationWatchers'),
                sendUserShantytownDeclared: sinon.stub(mails, 'sendUserShantytownDeclared'),
                socialOriginCreate: sinon.stub(socialOriginModel, 'create'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        describe('create()', () => {
            it('créer un site en bdd avec les données fournies par l\'utilisateur', async () => {
                user.isAllowedTo.returns(true);
                stubs.shantytownCreate.resolves(shantytownId);
                stubs.findOne.resolves(town);
                await createService({
                    ...townData, ...justiceData, owner, social_origins,
                }, user);
                expect(stubs.shantytownCreate).to.have.been.calledOnceWith({
                    ...{
                        name: townData.name,
                        latitude: townData.latitude,
                        longitude: townData.longitude,
                        address: townData.address,
                        addressDetails: townData.detailed_address,
                        builtAt: townData.built_at,
                        populationTotal: townData.population_total,
                        populationCouples: townData.population_couples,
                        populationMinors: townData.population_minors,
                        populationMinors0To3: townData.population_minors_0_3,
                        populationMinors3To6: townData.population_minors_3_6,
                        populationMinors6To12: townData.population_minors_6_12,
                        populationMinors12To16: townData.population_minors_12_16,
                        populationMinors16To18: townData.population_minors_16_18,
                        minorsInSchool: townData.minors_in_school,
                        caravans: townData.caravans,
                        huts: townData.huts,
                        fieldType: townData.field_type,
                        ownerType: townData.owner_type,
                        owner,
                        isReinstallation: townData.is_reinstallation,
                        reinstallationComments: townData.reinstallation_comments,
                        city: townData.citycode,
                        createdBy: user.id,
                        declaredAt: townData.declared_at,
                        censusStatus: townData.census_status,
                        censusConductedAt: townData.census_conducted_at,
                        censusConductedBy: townData.census_conducted_by,
                    },
                    ...{
                        living_conditions_version: 2,

                        water_access_type: townData.water_access_type,
                        water_access_type_details: townData.water_access_type_details,
                        water_access_is_public: townData.water_access_is_public,
                        water_access_is_continuous: townData.water_access_is_continuous,
                        water_access_is_continuous_details: townData.water_access_is_continuous_details,
                        water_access_is_local: townData.water_access_is_local,
                        water_access_is_close: townData.water_access_is_close,
                        water_access_is_unequal: townData.water_access_is_unequal,
                        water_access_is_unequal_details: townData.water_access_is_unequal_details,
                        water_access_has_stagnant_water: townData.water_access_has_stagnant_water,
                        water_access_comments: townData.water_access_comments,

                        sanitary_open_air_defecation: townData.sanitary_open_air_defecation,
                        sanitary_access_working_toilets: townData.sanitary_working_toilets,
                        sanitary_access_toilets_are_inside: townData.sanitary_toilets_are_inside,
                        sanitary_access_toilets_are_lighted: townData.sanitary_toilets_are_lighted,
                        sanitary_access_hand_washing: townData.sanitary_hand_washing,

                        electricity_access: townData.electricity_access,
                        electricity_access_is_unequal: townData.electricity_access_is_unequal,

                        trash_is_piling: townData.trash_is_piling,
                        trash_evacuation_is_close: townData.trash_evacuation_is_close,
                        trash_evacuation_is_safe: townData.trash_evacuation_is_safe,
                        trash_evacuation_is_regular: townData.trash_evacuation_is_regular,
                        trash_bulky_is_piling: townData.trash_bulky_is_piling,

                        pest_animals: townData.pest_animals_presence,
                        pest_animals_details: townData.pest_animals_details,

                        fire_prevention: townData.fire_prevention_diagnostic,
                    },
                    ...{
                        ownerComplaint: justiceData.owner_complaint,
                        justiceProcedure: justiceData.justice_procedure,
                        justiceRendered: justiceData.justice_rendered,
                        justiceRenderedBy: justiceData.justice_rendered_by,
                        justiceRenderedAt: justiceData.justice_rendered_at,
                        justiceChallenged: justiceData.justice_challenged,
                        policeStatus: justiceData.police_status,
                        policeRequestedAt: justiceData.police_requested_at,
                        policeGrantedAt: justiceData.police_granted_at,
                        bailiff: justiceData.bailiff,
                    },
                });
            });
            it('n\'enregistre pas les données judiciaires et du propriétaire si l\'utilisateur n\'y a pas accès', async () => {
                user.isAllowedTo.returns(false);
                stubs.shantytownCreate.resolves(shantytownId);
                stubs.findOne.resolves(town);
                await createService({
                    ...townData, ...justiceData, owner, social_origins,
                }, user);
                expect(stubs.electricityAccessTypesCreate).to.have.been.calledOnceWith(
                    shantytownId,
                    townData.electricity_access_types,
                );
                expect(stubs.shantytownToiletTypesCreate).to.have.been.calledOnceWith(
                    shantytownId,
                    townData.sanitary_toilet_types,
                );
                expect(stubs.shantytownCreate).to.have.been.calledOnceWith(
                    {
                        name: townData.name,
                        latitude: townData.latitude,
                        longitude: townData.longitude,
                        address: townData.address,
                        addressDetails: townData.detailed_address,
                        builtAt: townData.built_at,
                        populationTotal: townData.population_total,
                        populationCouples: townData.population_couples,
                        populationMinors: townData.population_minors,
                        populationMinors0To3: townData.population_minors_0_3,
                        populationMinors3To6: townData.population_minors_3_6,
                        populationMinors6To12: townData.population_minors_6_12,
                        populationMinors12To16: townData.population_minors_12_16,
                        populationMinors16To18: townData.population_minors_16_18,
                        minorsInSchool: townData.minors_in_school,
                        caravans: townData.caravans,
                        huts: townData.huts,
                        fieldType: townData.field_type,
                        ownerType: townData.owner_type,
                        isReinstallation: townData.is_reinstallation,
                        reinstallationComments: townData.reinstallation_comments,
                        city: townData.citycode,
                        createdBy: user.id,
                        declaredAt: townData.declared_at,
                        censusStatus: townData.census_status,
                        censusConductedAt: townData.census_conducted_at,
                        censusConductedBy: townData.census_conducted_by,
                        living_conditions_version: 2,

                        water_access_type: townData.water_access_type,
                        water_access_type_details: townData.water_access_type_details,
                        water_access_is_public: townData.water_access_is_public,
                        water_access_is_continuous: townData.water_access_is_continuous,
                        water_access_is_continuous_details: townData.water_access_is_continuous_details,
                        water_access_is_local: townData.water_access_is_local,
                        water_access_is_close: townData.water_access_is_close,
                        water_access_is_unequal: townData.water_access_is_unequal,
                        water_access_is_unequal_details: townData.water_access_is_unequal_details,
                        water_access_has_stagnant_water: townData.water_access_has_stagnant_water,
                        water_access_comments: townData.water_access_comments,

                        sanitary_open_air_defecation: townData.sanitary_open_air_defecation,
                        sanitary_access_working_toilets: townData.sanitary_working_toilets,
                        sanitary_access_toilets_are_inside: townData.sanitary_toilets_are_inside,
                        sanitary_access_toilets_are_lighted: townData.sanitary_toilets_are_lighted,
                        sanitary_access_hand_washing: townData.sanitary_hand_washing,

                        electricity_access: townData.electricity_access,
                        electricity_access_is_unequal: townData.electricity_access_is_unequal,

                        trash_is_piling: townData.trash_is_piling,
                        trash_evacuation_is_close: townData.trash_evacuation_is_close,
                        trash_evacuation_is_safe: townData.trash_evacuation_is_safe,
                        trash_evacuation_is_regular: townData.trash_evacuation_is_regular,
                        trash_bulky_is_piling: townData.trash_bulky_is_piling,

                        pest_animals: townData.pest_animals_presence,
                        pest_animals_details: townData.pest_animals_details,

                        fire_prevention: townData.fire_prevention_diagnostic,
                    },
                );
            });
        });

        it('enregistre les origines sociales en bdd si elles sont indiquées par l\'utilisateur', async () => {
            user.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService({
                ...townData, ...justiceData, owner, social_origins,
            }, user);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.socialOriginCreate).to.have.been.calledOnceWith(shantytownId, social_origins);
        });

        it('si la connexion à mattermost est établie, envoie une alerte', async () => {
            config.mattermost = true;
            user.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService({
                ...townData, ...justiceData, owner, social_origins,
            }, user);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.triggerShantytownCreationAlert).to.have.been.calledOnceWith(town, user);
        });

        it('envoie une alerte mail à tous les utilisateurs du département', async () => {
            townData.city = { departement: global.generate('string') };
            const watchers = [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }];
            stubs.getLocationWatchers.resolves(watchers);
            user.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService({
                ...townData, ...justiceData, owner, social_origins,
            }, user);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.getLocationWatchers).to.have.been.calledOnce;
            // expect(stubs.getLocationWatchers).to.have.been.calledOnceWith(townData.citycode, true);
            expect(stubs.sendUserShantytownDeclared).to.have.callCount(watchers.length);
        });
    });
});
