import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';

import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

// stubs
const sandbox = sinon.createSandbox();
const userModel = {
    getNationalAdmins: sandbox.stub(),
};
const mails = {
    sendAdminTownReporting: sandbox.stub(),
    sendConfirmationOfTownReporting: sandbox.stub(),
};

rewiremock('#server/models/userModel/index').with(userModel);
rewiremock('#server/mails/mails').with(mails);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import reportService from './report';
rewiremock.disable();

describe('shantytownService.report()', () => {
    afterEach(() => {
        sandbox.reset();
    });

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

    it('envoie les données du site par mail aux admins nationaux', async () => {
        userModel.getNationalAdmins.resolves([fakeUser(), fakeUser(), fakeUser()]);
        await reportService(townData, fakeUser());

        expect(mails.sendAdminTownReporting).to.have.been.calledThrice;
    });

    it('envoie une notification mail à l\'utilisateur à l\'origine du signalement', async () => {
        const user = fakeUser();
        userModel.getNationalAdmins.resolves([]);
        await reportService(townData, user);

        expect(mails.sendConfirmationOfTownReporting).to.have.been.calledOnceWith(user);
    });

    it('ne lève pas d\'exception si l\'accusé de réception du signalement n\'a pas pu être envoyé', async () => {
        userModel.getNationalAdmins.resolves([]);
        mails.sendConfirmationOfTownReporting.rejects(new Error());
        try {
            await reportService(townData, fakeUser());
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);

            expect.fail('should not have thrown an error');
        }
    });

    it('renvoie une exception ServiceError \'sent_failed\' si le  service échoue à collecter les admins nationaux', async () => {
        userModel.getNationalAdmins.rejects(new Error());

        let responseError;
        try {
            await reportService(townData, fakeUser());
            expect.fail('should have thrown an error');
        } catch (error) {
            responseError = error;
        }

        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('sent_failed');
    });

    it('renvoie une exception ServiceError \'sent_failed\' si le  service échoue à envoyer les mails', async () => {
        mails.sendAdminTownReporting.rejects(new Error());

        let responseError;
        try {
            await reportService(townData, fakeUser());
            expect.fail('should have thrown an error');
        } catch (error) {
            responseError = error;
        }

        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('sent_failed');
    });
});
