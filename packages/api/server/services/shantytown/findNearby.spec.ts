import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeTown } from '#test/utils/shantytown';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownModel: { findNearby: sandbox.stub() },
};

rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import findNearbyService from './findNearby';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('findNearby()', () => {
        const user = {} as AuthUser;
        const latitude = 47.2;
        const longitude = -1.5;
        const distance = 0.5;
        let towns = [];

        beforeEach(() => {
            towns = [fakeTown()];
        });
        afterEach(() => {
            sandbox.restore();
        });

        it('retourne la liste des sites à proximité', async () => {
            stubs.shantytownModel.findNearby.resolves(towns);

            const response = await findNearbyService(user, latitude, longitude, distance);

            expect(stubs.shantytownModel.findNearby).to.have.been.calledOnceWith(user, latitude, longitude, distance);
            expect(response).to.be.eql(towns);
        });

        it('renvoie une exception ServiceError \'fetch_failed\' si le modèle échoue', async () => {
            const nativeError = new Error('fetch failed');
            stubs.shantytownModel.findNearby.rejects(nativeError);
            let responseError;

            try {
                await findNearbyService(user, latitude, longitude, distance);
            } catch (error) {
                responseError = error;
            }

            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
            expect(responseError.nativeError).to.be.eql(nativeError);
        });
    });
});
