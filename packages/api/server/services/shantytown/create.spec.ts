import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';
import { creationInput as fakeShantytown } from '#test/utils/shantytown';
import { serialized as fakeUser } from '#test/utils/user';
import { rewiremock } from '#test/rewiremock';
import baseShantytown from '#server/services/shantytown/_common/baseShantytown';
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
rewiremock('#server/services/shantytown/_common/baseShantytown').callThrough();

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createService from './create';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('create()', () => {
        let shantytownId: string;
        let fakeUserData: any;
        let townData: any;
        let owners: ParcelOwnerInsert[];
        let social_origins: string;
        let town: any;
        let baseTown: any;
        let justice: any;
        const watchers = [{ user_id: 10 }, { user_id: 11 }, { user_id: 12 }];

        beforeEach(() => {
            shantytownId = global.generate('string');
            fakeUserData = fakeUser();
            fakeUserData.isAllowedTo = sandbox.stub();
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
            baseTown = baseShantytown(townData, fakeUserData);
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
            stubs.getLocationWatchers.resolves([]);
        });

        afterEach(() => {
            sandbox.reset();
        });

        it('créer un site en bdd avec les données fournies par l\'utilisateur', async () => {
            fakeUserData.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService(townData, fakeUserData);
            expect(stubs.shantytownCreate).to.have.been.calledOnceWith(
                {
                    ...baseTown,
                    ...justice,
                },
                stubs.transaction,
            );
        });

        it('n\'enregistre pas les données judiciaires et du propriétaire si l\'utilisateur n\'y a pas accès', async () => {
            fakeUserData.isAllowedTo.returns(false);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService(townData, fakeUserData);
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
            fakeUserData.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService({
                ...townData, social_origins,
            }, fakeUserData);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.socialOriginCreate).to.have.been.calledOnceWith(shantytownId, social_origins);
        });

        it('enregistre les propriétaires de parcelles en bdd si elles sont indiquées par l\'utilisateur', async () => {
            fakeUserData.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService({
                ...townData,
                owners,
            }, fakeUserData);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.shantytownParcelOwnerService.create).to.have.been.calledOnceWith(fakeUserData, shantytownId, owners, stubs.transaction);
        });

        it('si la connexion à mattermost est établie, envoie une alerte', async () => {
            fakeUserData.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves(town);
            await createService(townData, fakeUserData);

            // eslint-disable-next-line no-unused-expressions
            expect(stubs.triggerShantytownCreationAlert).to.have.been.calledOnceWith(town, fakeUserData);
        });

        it('envoie une alerte mail à tous les utilisateurs du département', async () => {
            townData.city = { code: townData.citycode, departement: townData.departement };
            stubs.getLocationWatchers.resolves(watchers);
            fakeUserData.isAllowedTo.returns(true);
            stubs.shantytownCreate.resolves(shantytownId);
            stubs.findOne.resolves({ ...town, city: { code: townData.citycode, departement: townData.departement } });
            await createService(townData, fakeUserData);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.getLocationWatchers).to.have.been.calledOnce;
            expect(stubs.sendUserShantytownDeclared).to.have.callCount(watchers.length);
        });
    });
});
