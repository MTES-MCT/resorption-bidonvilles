import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';

import { serialized as fakeShantytown } from '#test/utils/shantytown';
import ServiceError from '#server/errors/ServiceError';
import locationUtils from '#test/utils/location';
import permissionUtils from '#server/utils/permission';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownModel: {
        fixClosedStatus: sinon.stub(),
        findOne: sinon.stub(),
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
import fixClosedStatusService from './fixClosedStatus';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('fixClosedStatus()', () => {
        const user: any = fakeUser();
        user.permissions.shantytown.fix_status = {
            allowed: true,
            allowed_on_national: true,
            allowed_on: null,
        };

        const data = {
            shantytown: fakeShantytown(stubs.paris.city(), { closed_with_solutions: false }),
            closed_with_solutions: 'yes',
        };

        beforeEach(() => {
            stubs.can.returns({
                do: stubs.do,
            });
            stubs.do.returns({
                on: stubs.on,
            });
        });

        afterEach(() => {
            sandbox.restore();
        });


        it('met à jour le site en changeant le statut et renvoie le site ainsi modifié', async () => {
            const updatedTown = fakeShantytown(stubs.paris.city(), { closed_with_solutions: true });
            stubs.shantytownModel.findOne.resolves(updatedTown);

            const response = await fixClosedStatusService(user, data);
            expect(stubs.shantytownModel.fixClosedStatus).to.have.been.calledOnceWith(data.shantytown.id, data.closed_with_solutions);
            expect(response).to.be.eql(updatedTown);
        });

        it('Si l\'utilisateur n\'a pas la permission de modifier le status d\'un site fermé, renvoie une exception ServiceError \'permission_denied\'', async () => {
            user.permissions.shantytown.fix_status = {};
            let responseError;
            try {
                await fixClosedStatusService(user, data);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('permission_denied');
        });
    });
});
