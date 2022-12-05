import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeTown } from '#test/utils/shantytown';
import findAllByActorService from './findAllByActor';

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
            const towns = [
                fakeTown(undefined, { id: 0, address: 'addresse test 1' }),
                fakeTown(undefined, { id: 1, address: 'addresse test 2' }),
            ];
            stubs.findAllByActor.resolves(towns);
            const response = await findAllByActorService(fakeUser());
            expect(response).to.be.an('array');
            expect(response).to.be.eql(towns);
        });
        it('renvoie une exception ServiceError \'fetch_failed\'  si le modèle échoue', async () => {
            stubs.findAllByActor.rejects(new Error());
            let responseError = null;
            try {
                await findAllByActorService(fakeUser());
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
