import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';
import { creationInput as fakeShantytown } from '#test/utils/shantytown';
import { serialized as fakeUser } from '#test/utils/user';
import { rewiremock } from '#test/rewiremock';

import { AuthUser } from '#server/middlewares/authMiddleware';
import { ParcelOwnerInsert } from '#root/types/resources/ParcelOwner.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    electricityAccessTypesCreate: sandbox.stub(),
    shantytownToiletTypesCreate: sandbox.stub(),
    shantytownParcelOwnerService: {
        create: sandbox.stub(),
    },
    shantytownCreate: sandbox.stub(),
    findOne: sandbox.stub(),
    triggerShantytownCreationAlert: sandbox.stub(),
    getLocationWatchers: sandbox.stub(),
    sendUserShantytownDeclared: sandbox.stub(),
    socialOriginCreate: sandbox.stub(),
    incomingTownsCreate: sandbox.stub(),
    sequelize: {
        transaction: sandbox.stub(),
    },
    transaction: {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
    },
};

rewiremock('#server/models/shantytownModel/create').with(stubs.shantytownCreate);
rewiremock('#server/models/socialOriginModel/create').with(stubs.socialOriginCreate);
rewiremock('#server/models/shantytownModel/findOne').with(stubs.findOne);
rewiremock('#server/models/shantytownToiletTypesModel/create').with(stubs.shantytownToiletTypesCreate);
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/models/electricityAccessTypesModel/create').with(stubs.electricityAccessTypesCreate);
rewiremock('#server/services/shantytownParcelOwner').with(stubs.shantytownParcelOwnerService);
rewiremock('#server/utils/mattermost').with({
    triggerShantytownCreationAlert: stubs.triggerShantytownCreationAlert,
});
rewiremock('#server/models/incomingTownsModel/create').with(stubs.incomingTownsCreate);
rewiremock('#server/models/userModel/getLocationWatchers').with(stubs.getLocationWatchers);
rewiremock('#server/mails/mails').with({ sendUserShantytownDeclared: stubs.sendUserShantytownDeclared });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createService from './create';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('create()', () => {
        let shantytownId: string;
        let user: any;
        let fakeUserData: AuthUser;
        let townData: any;
        let owners: ParcelOwnerInsert[];
        let social_origins: string;
        let town: any;
        let baseTown: any;
        let justice: any;

        beforeEach(() => {
            shantytownId = global.generate('string');
            user = {
                id: global.generate('string'),
                isAllowedTo: sinon.stub(),
            };
            fakeUserData = fakeUser();
            stubs.getLocationWatchers.returns([{
                user_id: fakeUserData.id,
                email: fakeUserData.email,
                first_name: fakeUserData.first_name,
                last_name: fakeUserData.last_name,
            }]);
            townData = fakeShantytown();
            social_origins = global.generate('string');
            town = {
                shantytownId,
                city: {
                    code: townData.citycode,
                    name: 'Fake City',
                    departement: {
                        code: townData.departement,
                        name: 'Fake Departement',
                    },
                },
            };
            owners = [{
                ownerId: 1,
                name: 'Jean Bon',
                type: 1,
            }, {
                ownerId: 2,
                name: 'Pierre Quiroul',
                type: 2,
            }];
            baseTown = {
                name: townData.name,
                latitude: townData.latitude,
                longitude: townData.longitude,
                address: townData.address,
                addressDetails: townData.detailed_address,
                builtAt: townData.built_at,
                populationTotal: townData.population_total,
                populationTotalFemales: townData.population_total_females,
                populationCouples: townData.population_couples,
                populationMinors: townData.population_minors,
                populationMinorsGirls: townData.population_minors_girls,
                populationMinors0To3: townData.population_minors_0_3,
                populationMinors3To6: townData.population_minors_3_6,
                populationMinors6To12: townData.population_minors_6_12,
                populationMinors12To16: townData.population_minors_12_16,
                populationMinors16To18: townData.population_minors_16_18,
                minorsInSchool: townData.minors_in_school,
                caravans: townData.caravans,
                huts: townData.huts,
                tents: townData.tents,
                cars: townData.cars,
                mattresses: townData.mattresses,
                fieldType: townData.field_type,
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
            };
            justice = {
                ownerComplaint: townData.owner_complaint,
                justiceProcedure: townData.justice_procedure,
                justiceRendered: townData.justice_rendered,
                justiceRenderedBy: townData.justice_rendered_by,
                justiceRenderedAt: townData.justice_rendered_at,
                justiceChallenged: townData.justice_challenged,
                policeStatus: townData.police_status,
                policeRequestedAt: townData.police_requested_at,
                policeGrantedAt: townData.police_granted_at,
                bailiff: townData.bailiff,
            };
            stubs.sequelize.transaction.resolves(stubs.transaction);
        });

        afterEach(() => {
            sandbox.reset();
        });

        it('créer un site en bdd avec les données fournies par l\'utilisateur', async () => {
            user.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService(townData, user);
            expect(stubs.shantytownCreate).to.have.been.calledOnceWith(
                {
                    ...baseTown,
                    ...justice,
                },
                stubs.transaction,
            );
        });

        it('n\'enregistre pas les données judiciaires et du propriétaire si l\'utilisateur n\'y a pas accès', async () => {
            user.isAllowedTo.returns(false);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService(townData, user);
            expect(stubs.electricityAccessTypesCreate).to.have.been.calledOnceWith(
                shantytownId,
                townData.electricity_access_types,
            );
            expect(stubs.shantytownToiletTypesCreate).to.have.been.calledOnceWith(
                shantytownId,
                townData.sanitary_toilet_types,
            );
            expect(stubs.shantytownCreate).to.have.been.calledOnceWith(
                baseTown, stubs.transaction,
            );
            expect(stubs.incomingTownsCreate).to.have.been.calledOnceWith(shantytownId, [1, 2, 3]);
        });

        it('enregistre les origines sociales en bdd si elles sont indiquées par l\'utilisateur', async () => {
            user.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService({
                ...townData, social_origins,
            }, user);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.socialOriginCreate).to.have.been.calledOnceWith(shantytownId, social_origins);
        });

        it('enregistre les propriétaires de parcelles en bdd si elles sont indiquées par l\'utilisateur', async () => {
            user.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            // townData.owner = owners;
            await createService({
                ...townData,
                owner: { owners },
            }, user);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.shantytownParcelOwnerService.create).to.have.been.calledOnceWith(user, shantytownId, owners, stubs.transaction);
        });

        it('si la connexion à mattermost est établie, envoie une alerte', async () => {
            user.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService(townData, user);

            // eslint-disable-next-line no-unused-expressions
            expect(stubs.triggerShantytownCreationAlert).to.have.been.calledOnceWith(town, user);
        });

        it('envoie une alerte mail à tous les utilisateurs du département', async () => {
            townData.city = { code: townData.citycode, departement: townData.departement };
            const watchers = [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }];
            stubs.getLocationWatchers.resolves(watchers);
            user.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves({ ...town, city: { code: townData.citycode, departement: townData.departement } });
            await createService(townData, user);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.getLocationWatchers).to.have.been.calledOnce;
            expect(stubs.sendUserShantytownDeclared).to.have.callCount(watchers.length);
        });
    });
});
