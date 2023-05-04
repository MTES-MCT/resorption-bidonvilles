import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { serialized as fakeUser } from '#test/utils/user';
import mails from '#server/mails/mails';
import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';
import reportService from './report';

const { expect } = chai;
chai.use(sinonChai);

describe('services/shantytown', () => {
    describe('report()', () => {
        const user = fakeUser();
        const admins = [fakeUser(), fakeUser(), fakeUser()];
        const townData = {
            address: 'Adresse test',
            latitude: 47.202436,
            longitude: -1.580545,
            name: 'Appellation test',
            declared_at: new Date(2023, 4, 1),
            census_status: 'non',
            police_status: 'none',
            water_access_type: 'inconnu',
            field_type_full: { id: 'unknown', label: 'Inconnu' },
            owner_type_full: { id: 'unknown', label: 'Inconnu' },
            social_origins_full: [],
            reinstallation_incoming_towns_full: [],
            sanitary_toilet_types: [],
            electricity_access_types: [],
        };
        let stubs;
        beforeEach(() => {
            stubs = {
                getNationalAdmins: sinon.stub(userModel, 'getNationalAdmins'),
                sendAdminTownReporting: sinon.stub(mails, 'sendAdminTownReporting'),
            };
        });
        afterEach(() => {
            sinon.restore();
        });
        it('envoie les données du site par mail aux admins nationaux', async () => {
            stubs.getNationalAdmins.resolves(admins);
            try {
                await reportService(townData, user);
            } catch (error) {
                // ignore
            }
            expect(stubs.sendAdminTownReporting).to.have.been.calledThrice;
        });
        it('renvoie une exception ServiceError \'sent_failed\' si le  service échoue à envoyer les mails', async () => {
            stubs.getNationalAdmins.rejects(new Error());
            let responseError;
            try {
                await reportService(townData, user);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('sent_failed');
        });
    });
});
