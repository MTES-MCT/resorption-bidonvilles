import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeTown } from '#test/utils/shantytown';
import findService from './find';

const { expect } = chai;
chai.use(sinonChai);

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
            const town = fakeTown();
            stubs.findOne.resolves(town);
            const response = await findService(fakeUser(), 1);
            expect(response).to.be.an('object');
            expect(response).to.be.eql(town);
        });
        it('renvoie une exception ServiceError \'fetch_failed\'  si le site n\'existe pas en bdd', async () => {
            stubs.findOne.resolves(null);
            let responseError = null;
            try {
                await findService(fakeUser(), 1);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
