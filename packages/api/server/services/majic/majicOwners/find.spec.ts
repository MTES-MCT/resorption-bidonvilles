import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { serialized as fakeUser } from '#test/utils/user';
import locationUtils from '#test/utils/location';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const { paris } = locationUtils;

// stubs
const sandbox = sinon.createSandbox();
const stubs = {
    majicModel: {
        getMajicYear: sandbox.stub(),
        findParcel: sandbox.stub(),
        findOwners: sandbox.stub(),
    },
    majicLogsService: {
        insert: sandbox.stub(),
    },
    mails: {
        sendParcelOwner: sandbox.stub(),
    },
    mattermostUtils: {
        triggerLandRegistryRequest: sandbox.stub(),
    },
    config: {
        mattermost: false as string | boolean,
    },
};

rewiremock('#server/models/majicModel').with(stubs.majicModel);
rewiremock('#server/services/majicLogs').with(stubs.majicLogsService);
rewiremock('#server/mails/mails').with(stubs.mails);
rewiremock('#server/utils/mattermost').with(stubs.mattermostUtils);
rewiremock('#server/config').withDefault(stubs.config);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import findMajicOwners from './find';
rewiremock.disable();

// utilisateur autorisé à accéder au registre foncier uniquement pour le département 75 (Paris)
const authorizedOnDept75 = () => fakeUser({
    permissions: {
        land_registry: {
            access: {
                allowed: true,
                allowed_on_national: false,
                allowed_on: {
                    regions: [],
                    departements: [paris.departement()],
                    epci: [],
                    cities: [],
                    actions: [],
                },
            },
        },
    },
});

describe('majicService.findMajicOwners()', () => {
    beforeEach(() => {
        sandbox.reset();
        stubs.config.mattermost = false;
    });
    afterEach(() => {
        sandbox.reset();
    });

    describe('si la parcelle appartient à un département hors du périmètre autorisé de l\'utilisateur', () => {
        it('lève une ServiceError "permission_denied" sans jamais accéder aux tables cadastrales', async () => {
            const user = authorizedOnDept75();

            try {
                await findMajicOwners('13055000AB0123', user);
                expect.fail('should have thrown an error');
            } catch (e) {
                expect(e).to.be.an.instanceof(ServiceError);
                expect(e.code).to.equal('permission_denied');
            }

            expect(stubs.majicModel.getMajicYear).to.not.have.been.called;
            expect(stubs.majicModel.findParcel).to.not.have.been.called;
            expect(stubs.majicModel.findOwners).to.not.have.been.called;
            expect(stubs.majicLogsService.insert).to.not.have.been.called;
            expect(stubs.mails.sendParcelOwner).to.not.have.been.called;
        });
    });

    describe('si la parcelle appartient au département autorisé de l\'utilisateur', () => {
        const parcelId = '75001000AB0123';
        const fakeParcel = { idcom: '75001', dnupro: '0001' };
        const fakeOwners = [{ nom: 'Dupont', prenom: 'Jean' }];

        beforeEach(() => {
            stubs.majicModel.getMajicYear.resolves('2023');
            stubs.majicLogsService.insert.resolves();
            stubs.majicModel.findParcel.resolves(fakeParcel);
            stubs.majicModel.findOwners.resolves(fakeOwners);
            stubs.mails.sendParcelOwner.resolves();
        });

        it('n\'échoue pas et accède aux tables cadastrales du bon département', async () => {
            const user = authorizedOnDept75();

            await findMajicOwners(parcelId, user);

            expect(stubs.majicModel.findParcel).to.have.been.calledOnceWith(parcelId, '75', 'ff2023_dep', 'pnb10_parcelle', 'd75_fftp_2023_pnb10_parcelle');
            expect(stubs.majicModel.findOwners).to.have.been.calledOnceWith(fakeParcel.idcom, fakeParcel.dnupro, '75', 'ff2023_dep', 'proprietaire_droit_non_ano', 'd75_fftp_2023_proprietaire_droit_non_ano');
        });

        it('enregistre la demande dans les logs', async () => {
            const user = authorizedOnDept75();

            await findMajicOwners(parcelId, user);

            expect(stubs.majicLogsService.insert).to.have.been.calledOnceWith(user.id, user.organization.id, parcelId);
        });

        it('envoie un mail avec les informations de la parcelle et des propriétaires', async () => {
            const user = authorizedOnDept75();

            await findMajicOwners(parcelId, user);

            expect(stubs.mails.sendParcelOwner).to.have.been.calledOnce;
            expect(stubs.mails.sendParcelOwner).to.have.been.calledWith(
                { email: user.email, first_name: user.first_name, last_name: user.last_name },
                {
                    variables: {
                        parcel: fakeParcel,
                        owners: fakeOwners,
                        majicYear: '2023',
                    },
                },
            );
        });

        it('déclenche une notification mattermost si le webhook est configuré', async () => {
            stubs.config.mattermost = 'https://mattermost.example.com/webhook';
            stubs.mattermostUtils.triggerLandRegistryRequest.resolves();
            const user = authorizedOnDept75();

            await findMajicOwners(parcelId, user);

            expect(stubs.mattermostUtils.triggerLandRegistryRequest).to.have.been.calledOnceWith(user, parcelId, '2023');
        });

        it('ne déclenche pas de notification mattermost si le webhook n\'est pas configuré', async () => {
            const user = authorizedOnDept75();

            await findMajicOwners(parcelId, user);

            expect(stubs.mattermostUtils.triggerLandRegistryRequest).to.not.have.been.called;
        });
    });
});
