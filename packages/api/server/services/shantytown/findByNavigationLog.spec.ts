const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');
const findByNavigationLogService = require('./findByNavigationLog');

const { expect } = chai;
chai.use(sinonChai);

describe.only('services/shantytown', () => {
    describe('findByNavigationLog()', () => {
        let stubs;
        beforeEach(() => {
            stubs = {
                findByNavigationLog: sinon.stub(shantytownModel, 'findByNavigationLog'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('retourne les site récemment consultés par l\'utilisateur', async () => {
            const towns = [{ id: 0, address: 'addresse test 1' }, { id: 1, address: 'addresse test 2' }];
            stubs.findByNavigationLog.resolves(towns);
            const response = await findByNavigationLogService();
            expect(response).to.be.an('array');
            expect(response).to.be.eql(towns);
        });
        it('renvoie une exception ServiceError \'fetch_failed\'  si le modèle échoue', async () => {
            stubs.findByNavigationLog.rejects(new Error());
            let responseError = null;
            try {
                await findByNavigationLogService();
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
