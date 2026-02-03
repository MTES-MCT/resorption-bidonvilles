import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

import locationUtils from '#test/utils/location';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownModel: {
        setHeatwaveStatus: sandbox.stub(),
        findOne: sandbox.stub(),
    },
    paris: locationUtils.paris,
};

rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import setHeatwaveStatusService from './setHeatwaveStatus';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('setHeatwaveStatus()', () => {
        const user = fakeUser();
        const data: { shantytown: any; heatwave_status: boolean } = {
            shantytown: fakeShantytown(stubs.paris.city(), { heatwave_status: false }),
            heatwave_status: true,
        };

        afterEach(() => {
            sinon.restore();
        });


        it('met à jour le site en changeant le statut de canicule et renvoie le site ainsi modifié', async () => {
            const updatedTown = fakeShantytown(stubs.paris.city(), { heatwave_status: true });
            stubs.shantytownModel.findOne.resolves(updatedTown);
            const response = await setHeatwaveStatusService(user, data);
            expect(stubs.shantytownModel.setHeatwaveStatus).to.have.been.calledOnceWith(data.shantytown.id, data.heatwave_status);
            expect(response).to.be.eql(updatedTown);
        });
    });
});
