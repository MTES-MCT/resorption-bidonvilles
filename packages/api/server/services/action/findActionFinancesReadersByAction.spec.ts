import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import actionModel from '#server/models/actionModel';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeOrganization } from '#test/utils/organization';

import findService from './findActionFinancesReadersByAction';

const { expect } = chai;
chai.use(sinonChai);

describe('services/action.findActionFinancesReadersByAction()', () => {
    let stubs;
    beforeEach(() => {
        stubs = {
            findActionFinancesReadersByAction: sinon.stub(actionModel, 'findActionFinancesReadersByAction'),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('retourne la liste des utilisateurs ayant la permission d\'accéder aux financements des actions', async () => {
        const permissions = [fakeOrganization(), fakeOrganization()];
        stubs.findActionFinancesReadersByAction.resolves(permissions);
        const response = await findService(1);
        expect(response).to.be.an('array');
        expect(response).to.be.eql(permissions);
    });

    it('renvoie une exception ServiceError \'fetch_failed\' si aucune permission n\'existe pas en bdd', async () => {
        stubs.findActionFinancesReadersByAction.rejects(new Error('une erreur'));
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
