import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import listService from './list';

const { expect } = chai;
chai.use(sinonChai);

describe('services/shantytown', () => {
    describe('list()', () => {
        const user = {};
        const towns = [global.generate('string'), global.generate('string'), global.generate('string')];
        let stubs;
        beforeEach(() => {
            stubs = {
                findAll: sinon.stub(shantytownModel, 'findAll'),
            };
        });
        afterEach(() => {
            sinon.restore();
        });
        it('retourne la liste de tous les sites', async () => {
            stubs.findAll.resolves(towns);
            let shantytownsResponse;
            try {
                shantytownsResponse = await listService(user);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
            expect(shantytownsResponse).to.be.eql(towns);
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si le modèle échoue à renvoyer les sites', async () => {
            stubs.findAll.rejects(new Error());
            let responseError;
            try {
                await listService(user);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
