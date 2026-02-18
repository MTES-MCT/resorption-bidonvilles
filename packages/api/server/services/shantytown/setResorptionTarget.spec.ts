import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

import locationUtils from '#test/utils/location';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import { serialized as fakeUser } from '#test/utils/user';

import permissionUtils from '#server/utils/permission';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownModel: {
        setResorptionTarget: sandbox.stub(),
        findOne: sandbox.stub(),
    },
    can: sandbox.stub(),
    do: sandbox.stub(),
    on: sandbox.stub(),
    paris: locationUtils.paris,
};

rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);
rewiremock('#server/utils/permission').with(permissionUtils);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import setResorptionTargetService from './setResorptionTarget';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('setResorptionTarget()', () => {
        let user: AuthUser;
        let data: { shantytown: any };
        let currentYear: number;

        beforeEach(() => {
            currentYear = new Date().getFullYear();
            user = fakeUser();
            user.permissions.shantytown.update = {
                allowed: true,
                allowed_on_national: true,
                allowed_on: null,
            };
            data = {
                shantytown: fakeShantytown(stubs.paris.city(), { resorption_target: null }),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('met à jour le site en définissant l\'année courante comme objectif de résorption et renvoie le site ainsi modifié', async () => {
            const updatedTown = fakeShantytown(stubs.paris.city(), { resorption_target: currentYear });
            stubs.shantytownModel.findOne.resolves(updatedTown);
            const response = await setResorptionTargetService(user, data);
            expect(stubs.shantytownModel.setResorptionTarget).to.have.been.calledOnceWith(data.shantytown.id, currentYear);
            expect(response).to.be.eql(updatedTown);
        });

        it('renvoie une exception ServiceError \'permission_denied\' si l\'utilisateur n\'a pas la permission de mettre à jour le site', async () => {
            user.permissions.shantytown.update = {
                allowed: false,
                allowed_on_national: false,
                allowed_on: null,
            };
            let responseError: ServiceError;
            try {
                await setResorptionTargetService(user, data);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('permission_denied');
        });
    });
});
