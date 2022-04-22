const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const sequelize = require('#db/sequelize');
const shantytownModel = require('#server/models/shantytownModel');
const socialOriginModel = require('#server/models/socialOriginModel');
const mattermostUtils = require('#server/utils/mattermost');
const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');
const config = require('#server/config');


const createService = require('./create');


describe.only('services/shantytown', () => {
    describe('create()', () => {
        let stubs;
        let transaction;
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
            electricity_type: global.generate('string'),
            electricity_comments: global.generate('string'),
            access_to_sanitary: global.generate('string'),
            sanitary_comments: global.generate('string'),
            access_to_water: global.generate('string'),
            water_comments: global.generate('string'),
            trash_evacuation: global.generate('string'),
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
            // New fields
            // Water
            water_potable: global.generate('string'),
            water_continuous_access: global.generate('string'),
            water_public_point: global.generate('string'),
            water_distance: global.generate('string'),
            water_roads_to_cross: global.generate('string'),
            water_everyone_has_access: global.generate('string'),
            water_stagnant_water: global.generate('string'),
            water_hand_wash_access: global.generate('string'),
            water_hand_wash_access_number: global.generate('string'),
            // Sanitary
            sanitary_number: global.generate('string'),
            sanitary_insalubrious: global.generate('string'),
            sanitary_on_site: global.generate('string'),
            // Trash
            trash_cans_on_site: global.generate('string'),
            trash_accumulation: global.generate('string'),
            trash_evacuation_regular: global.generate('string'),
            // Vermin
            vermin: global.generate('string'),
            vermin_comments: global.generate('string'),
            // Fire prevention
            fire_prevention_measures: global.generate('string'),
            fire_prevention_diagnostic: global.generate('string'),
            fire_prevention_site_accessible: global.generate('string'),
            fire_prevention_devices: global.generate('string'),
            fire_prevention_comments: global.generate('string'),
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
                transaction: sinon.stub(sequelize, 'transaction'),
                shantytownCreate: sinon.stub(shantytownModel, 'create'),
                findOne: sinon.stub(shantytownModel, 'findOne'),
                triggerShantytownCreationAlert: sinon.stub(mattermostUtils, 'triggerShantytownCreationAlert'),
                getLocationWatchers: sinon.stub(userModel, 'getLocationWatchers'),
                sendUserShantytownDeclared: sinon.stub(mails, 'sendUserShantytownDeclared'),
                socialOriginCreate: sinon.stub(socialOriginModel, 'create'),
            };
            transaction = { commit: sinon.stub() };
            stubs.transaction.resolves(transaction);
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
                        electricityType: townData.electricity_type,
                        electricityComments: townData.electricity_comments,
                        accessToSanitary: townData.access_to_sanitary,
                        sanitaryComments: townData.sanitary_comments,
                        accessToWater: townData.access_to_water,
                        waterComments: townData.water_comments,
                        trashEvacuation: townData.trash_evacuation,
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
                        // New fields
                        // Water
                        waterPotable: townData.water_potable,
                        waterContinuousAccess: townData.water_continuous_access,
                        waterPublicPoint: townData.water_public_point,
                        waterDistance: townData.water_distance,
                        waterRoadsToCross: townData.water_roads_to_cross,
                        waterEveryoneHasAccess: townData.water_everyone_has_access,
                        waterStagnantWater: townData.water_stagnant_water,
                        waterHandWashAccess: townData.water_hand_wash_access,
                        waterHandWashAccessNumber: townData.water_hand_wash_access_number,
                        // Sanitary
                        sanitaryNumber: townData.sanitary_number,
                        sanitaryInsalubrious: townData.sanitary_insalubrious,
                        sanitaryOnSite: townData.sanitary_on_site,
                        // Trash
                        trashCansOnSite: townData.trash_cans_on_site,
                        trashAccumulation: townData.trash_accumulation,
                        trashEvacuationRegular: townData.trash_evacuation_regular,
                        // Vermin
                        vermin: townData.vermin,
                        verminComments: townData.vermin_comments,
                        // Fire prevention
                        firePreventionMeasures: townData.fire_prevention_measures,
                        firePreventionDiagnostic: townData.fire_prevention_diagnostic,
                        firePreventionSiteAccessible: townData.fire_prevention_site_accessible,
                        firePreventionDevices: townData.fire_prevention_devices,
                        firePreventionComments: townData.fire_prevention_comments,
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
                    owner,
                }, transaction);
            });
            it('n\'enregistre pas les données judiciaires et du propriétaire si l\'utilisateur n\'y a pas accès', async () => {
                user.isAllowedTo.returns(false);
                stubs.shantytownCreate.resolves(shantytownId);
                stubs.findOne.resolves(town);
                await createService({
                    ...townData, ...justiceData, owner, social_origins,
                }, user);
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
                        electricityType: townData.electricity_type,
                        electricityComments: townData.electricity_comments,
                        accessToSanitary: townData.access_to_sanitary,
                        sanitaryComments: townData.sanitary_comments,
                        accessToWater: townData.access_to_water,
                        waterComments: townData.water_comments,
                        trashEvacuation: townData.trash_evacuation,
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
                        // New fields
                        // Water
                        waterPotable: townData.water_potable,
                        waterContinuousAccess: townData.water_continuous_access,
                        waterPublicPoint: townData.water_public_point,
                        waterDistance: townData.water_distance,
                        waterRoadsToCross: townData.water_roads_to_cross,
                        waterEveryoneHasAccess: townData.water_everyone_has_access,
                        waterStagnantWater: townData.water_stagnant_water,
                        waterHandWashAccess: townData.water_hand_wash_access,
                        waterHandWashAccessNumber: townData.water_hand_wash_access_number,
                        // Sanitary
                        sanitaryNumber: townData.sanitary_number,
                        sanitaryInsalubrious: townData.sanitary_insalubrious,
                        sanitaryOnSite: townData.sanitary_on_site,
                        // Trash
                        trashCansOnSite: townData.trash_cans_on_site,
                        trashAccumulation: townData.trash_accumulation,
                        trashEvacuationRegular: townData.trash_evacuation_regular,
                        // Vermin
                        vermin: townData.vermin,
                        verminComments: townData.vermin_comments,
                        // Fire prevention
                        firePreventionMeasures: townData.fire_prevention_measures,
                        firePreventionDiagnostic: townData.fire_prevention_diagnostic,
                        firePreventionSiteAccessible: townData.fire_prevention_site_accessible,
                        firePreventionDevices: townData.fire_prevention_devices,
                        firePreventionComments: townData.fire_prevention_comments,
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
            expect(stubs.socialOriginCreate).to.have.been.calledOnceWith(shantytownId, social_origins, transaction);
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
