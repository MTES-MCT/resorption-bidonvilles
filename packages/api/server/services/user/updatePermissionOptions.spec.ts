import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    userModel: {
        setPermissionOptions: sandbox.stub(),
    },
};

rewiremock('#server/models/userModel').with(stubs.userModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import updatePermissionOptionsService from './updatePermissionOptions';
rewiremock.disable();

describe('services/user', () => {
    describe('updatePermissionOptions()', () => {
        beforeEach(() => {
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('modifie les options de l\'utilisateur en base de données', async () => {
            const user = fakeUser();
            const options = ['access_justice'];
            await updatePermissionOptionsService(user.id, options);
            expect(stubs.userModel.setPermissionOptions).to.have.been.calledOnceWith(user.id, options);
        });

        it('renvoie le user mis à jour', async () => {
            const updatedUser = fakeUser({ first_name: 'updated' });
            stubs.userModel.setPermissionOptions.resolves(updatedUser);

            const response = await updatePermissionOptionsService(1, []);
            expect(response).to.be.eql(updatedUser);
        });

        it('renvoie une exception ServiceError \'insert_failed\' si le service échoue à modifier les options en base de données', async () => {
            const originalError = new Error('une erreur');
            stubs.userModel.setPermissionOptions.rejects(originalError);

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
