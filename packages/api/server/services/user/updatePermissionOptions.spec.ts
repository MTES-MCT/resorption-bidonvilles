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
        const user = { ...fakeUser(), role_id: 'collaborator' };

        const options = ['access_justice'];
        let stubs;

        beforeEach(() => {
            stubs = {
                findOne: sinon.stub(userModel, 'findOne'),
                updatePermissionOptions: sinon.stub(userModel, 'setPermissionOptions'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('modifie les options en base de données renvoie l\'objet user', async () => {
            stubs.updatePermissionOptions.resolves(user);
            stubs.findOne.resolves(user);

            const response = await updatePermissionOptionsService(user.id, options);
            expect(stubs.updatePermissionOptions).to.have.been.calledOnceWith(user.id, options);
            expect(response).to.be.eql(user);
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si le service échoue à retrouver l\'utilisateur en base de données', async () => {
            stubs.findOne.rejects(new Error());
            let responseError;
            try {
                await updatePermissionOptionsService(user.id, options);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
        it('renvoie une exception ServiceError \'insert_failed\' si le service échoue à modifier les options en base de données', async () => {
            stubs.findOne.resolves(user);
            stubs.updatePermissionOptions.rejects(new Error());
            let responseError;
            try {
                await updatePermissionOptionsService(user.id, options);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('insert_failed');
        });
    });
});
