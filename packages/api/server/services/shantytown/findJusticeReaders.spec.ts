import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import organizationModel from '#server/models/organizationModel';
import ServiceError from '#server/errors/ServiceError';
import fakeJusticeReader from '#root/test/utils/justiceReader';

import findService from './findJusticeReaders';

const { expect } = chai;
chai.use(sinonChai);

describe('services/shantytown.findJusticeReaders()', () => {
    let stubs;
    beforeEach(() => {
        stubs = {
            findJusticeReaders: sinon.stub(organizationModel, 'findJusticeReaders'),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('retourne la liste des utilisateurs ayant la permission d\'accéder aux PJ', async () => {
        const permissions = [fakeJusticeReader(), fakeJusticeReader()];
        stubs.findJusticeReaders.resolves(permissions);
        const response = await findService(1);
        expect(response).to.be.an('array');
        expect(response).to.be.eql(permissions);
    });

    it('renvoie une exception ServiceError \'fetch_failed\' si aucune permission n\'existe pas en bdd', async () => {
        stubs.findJusticeReaders.rejects(new Error('une erreur'));
        let responseError = null;
        try {
            await findService(1);
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('fetch_failed');
    });
});
