const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');
const findAllByActorService = require('./findAllByActor');

const { expect } = chai;
chai.use(sinonChai);

describe.only('services/shantytown', () => {
    describe('findAllByActor()', () => {
        let stubs;
        beforeEach(() => {
            stubs = {
                findAllByActor: sinon.stub(shantytownModel, 'findAllByActor'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('retourne les site sur lesquelles l\'utilisateur intervient', async () => {
            const towns = [{ id: 0, address: 'addresse test 1' }, { id: 1, address: 'addresse test 2' }];
            stubs.findAllByActor.resolves(towns);
            const response = await findAllByActorService();
            expect(response).to.be.an('array');
            expect(response).to.be.eql(towns);
        });
        it('renvoie une exception ServiceError \'fetch_failed\'  si le modèle échoue', async () => {
            stubs.findAllByActor.rejects(new Error());
            let responseError = null;
            try {
                await findAllByActorService();
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
