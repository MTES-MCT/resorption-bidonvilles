import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeTown } from '#test/utils/shantytown';
import findByNavigationLogService from './findByNavigationLog';

const { expect } = chai;
chai.use(sinonChai);

describe('services/shantytown', () => {
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
            const towns = [
                fakeTown(undefined, { id: 0, address: 'addresse test 1' }),
                fakeTown(undefined, { id: 1, address: 'addresse test 2' }),
            ];
            stubs.findByNavigationLog.resolves(towns);
            const response = await findByNavigationLogService(fakeUser());
            expect(response).to.be.an('array');
            expect(response).to.be.eql(towns);
        });
        it('renvoie une exception ServiceError \'fetch_failed\'  si le modèle échoue', async () => {
            stubs.findByNavigationLog.rejects(new Error());
            let responseError = null;
            try {
                await findByNavigationLogService(fakeUser());
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
