const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');
const listService = require('./list');


describe.only('services/shantytown', () => {
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
                // ignore
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
            expect(responseError.nativeError.developer_message).to.be.eql('Failed to fetch towns');
        });
    });
});
