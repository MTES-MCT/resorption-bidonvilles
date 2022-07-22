const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const geoModel = require('#server/models/geoModel');
const ServiceError = require('#server/errors/ServiceError');
const findDepartementFromCityId = require('./getDepartementFromCityId');

const { expect } = chai;
chai.use(sinonChai);

describe.only('services/geo', () => {
    describe('getDepartementFromCityId()', () => {
        let stubs;
        beforeEach(() => {
            stubs = {
                getDepartementFromCityId: sinon.stub(geoModel, 'getDepartementFromCityId'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('retourne le département', async () => {
            const departement = { code: '', name: '' };
            stubs.getDepartementFromCityId.resolves(departement);
            const response = await findDepartementFromCityId();
            expect(response).to.be.an('object');
            expect(response).to.be.eql(departement);
        });
        it('renvoie une exception ServiceError \'fetch_failed\'  si le departement n\'existe pas en bdd', async () => {
            stubs.getDepartementFromCityId.resolves(null);
            let responseError = null;
            try {
                await findDepartementFromCityId();
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
