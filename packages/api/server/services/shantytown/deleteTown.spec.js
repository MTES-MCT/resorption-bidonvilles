const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const shantytownModel = require('#server/models/shantytownModel');
const ServiceError = require('#server/errors/ServiceError');
const deleteTownService = require('./deleteTown');


describe.only('services/shantytown', () => {
    describe('deleteTown()', () => {
        let stubs;
        beforeEach(() => {
            stubs = {
                findOne: sinon.stub(shantytownModel, 'findOne'),
                deleteShantytown: sinon.stub(shantytownModel, 'deleteShantytown'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('supprime le site', async () => {
            const town = { id: 0 };
            stubs.findOne.resolves(town);
            try {
                await deleteTownService();
            } catch (error) {
                // ignore
            }

            expect(stubs.deleteShantytown).to.have.been.calledOnceWith(town.id);
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si le modèle échoue', async () => {
            stubs.findOne.rejects(new Error());
            let responseError;
            try {
                await deleteTownService();
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
        it('renvoie une exception ServiceError \'shantytown_unfound\' si le site à supprimer n\'existe pas en bdd', async () => {
            stubs.findOne.resolves(null);
            let responseError;
            try {
                await deleteTownService();
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('shantytown_unfound');
        });
    });
});
