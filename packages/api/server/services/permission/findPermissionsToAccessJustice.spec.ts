import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import permissionModel from '#server/models/permissionModel';
import ServiceError from '#server/errors/ServiceError';
import locationUtils from '#test/utils/location';
import fakePermissionsToAccessJustice from '#test/utils/permissionsToAccessJustice';

import findService from './findPermissionsToAccessJustice';


const { expect } = chai;
chai.use(sinonChai);

const { marseille } = locationUtils;

describe('services/permission', () => {
    describe('findPermissionsToAccessJustice()', () => {
        let stubs;
        beforeEach(() => {
            stubs = {
                findPermissionToAccessJustice: sinon.stub(permissionModel, 'findPermissionsToAccessJustice'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('retourne la liste des utilisateurs ayant la permission d\'accéder aux PJ', async () => {
            const permissions = fakePermissionsToAccessJustice();
            stubs.findPermissionToAccessJustice.resolves(permissions);
            const response = await findService(marseille.city());
            expect(response).to.be.an('array');
            expect(response).to.be.eql(permissions);
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si aucune permission n\'existe pas en bdd', async () => {
            stubs.findPermissionToAccessJustice.resolves(null);
            let responseError = null;
            try {
                await findService(marseille.city());
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
