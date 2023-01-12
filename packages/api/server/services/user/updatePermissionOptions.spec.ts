import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import ServiceError from '#server/errors/ServiceError';
import userModel from '#server/models/userModel';

import { serialized as fakeUser } from '#test/utils/user';

import updatePermissionOptionsService from './updatePermissionOptions';

const { expect } = chai;
chai.use(sinonChai);

describe('services/user', () => {
    describe('updatePermissionOptions()', () => {
        const stubs = {
            setPermissionOptions: null,
        };

        beforeEach(() => {
            stubs.setPermissionOptions = sinon.stub(userModel, 'setPermissionOptions');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('modifie les options de l\'utilisateur en base de données', async () => {
            const user = fakeUser();
            const options = ['access_justice'];
            await updatePermissionOptionsService(user.id, options);
            expect(stubs.setPermissionOptions).to.have.been.calledOnceWith(user.id, options);
        });

        it('renvoie le user mis à jour', async () => {
            const updatedUser = fakeUser({ first_name: 'updated' });
            stubs.setPermissionOptions.resolves(updatedUser);

            const response = await updatePermissionOptionsService(1, []);
            expect(response).to.be.eql(updatedUser);
        });

        it('renvoie une exception ServiceError \'insert_failed\' si le service échoue à modifier les options en base de données', async () => {
            const originalError = new Error('une erreur');
            stubs.setPermissionOptions.rejects(originalError);

            let responseError;
            try {
                await updatePermissionOptionsService(1, []);
            } catch (error) {
                responseError = error;
            }

            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('insert_failed');
            expect(responseError.nativeError).to.be.eql(originalError);
        });
    });
});
