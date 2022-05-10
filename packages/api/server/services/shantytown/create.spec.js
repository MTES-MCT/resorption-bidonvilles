const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const shantytownModel = require('#server/models/shantytownModel');
const socialOriginModel = require('#server/models/socialOriginModel');
const electricityTypeModel = require('#server/models/electricityTypeModel');
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
                electricityFindOneByUid: sinon.stub(electricityTypeModel, 'findOneByUid'),
                shantytownCreate: sinon.stub(shantytownModel, 'create'),
                findOne: sinon.stub(shantytownModel, 'findOne'),
                triggerShantytownCreationAlert: sinon.stub(mattermostUtils, 'triggerShantytownCreationAlert'),
                getLocationWatchers: sinon.stub(userModel, 'getLocationWatchers'),
                sendUserShantytownDeclared: sinon.stub(mails, 'sendUserShantytownDeclared'),
                socialOriginCreate: sinon.stub(socialOriginModel, 'create'),
            };

            stubs.electricityFindOneByUid.resolves({
                id: 1,
            });
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
                        electricityType: 1,
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
                });
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
                        caravans: townData.caravans,
                        huts: townData.huts,
                        electricityType: 1,
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
