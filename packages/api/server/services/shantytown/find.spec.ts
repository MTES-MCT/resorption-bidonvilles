import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import shantytownModelFactory from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import findService from './find';

const { expect } = chai;
chai.use(sinonChai);

const shantytownModel = shantytownModelFactory();

describe.only('services/shantytown', () => {
    describe('find()', () => {
        let stubs;
        beforeEach(() => {
            stubs = {
                findOne: sinon.stub(shantytownModel, 'findOne'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('retourne le site', async () => {
            const town = { id: 0, address: '' };
            stubs.findOne.resolves(town);
            const response = await findService();
            expect(response).to.be.an('object');
            expect(response).to.be.eql(town);
        });
        it('renvoie une exception ServiceError \'fetch_failed\'  si le site n\'existe pas en bdd', async () => {
            stubs.findOne.resolves(null);
            let responseError = null;
            try {
                await findService();
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
