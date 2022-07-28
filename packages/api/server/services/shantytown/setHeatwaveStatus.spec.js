const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const {
    paris,
} = require('#test/utils/location');
const { serialized: fakeShantytown } = require('#test/utils/shantytown');
const { serialized: fakeUser } = require('#test/utils/user');

const shantytownModel = require('#server/models/shantytownModel');

const setHeatwaveStatusService = require('./setHeatwaveStatus');


describe.only('services/shantytown', () => {
    describe('setHeatwaveStatus()', () => {
        const user = fakeUser();
        const data = {
            shantytown: fakeShantytown(paris.city(), { heatwave_status: false }),
            heatwave_status: true,
        };

        let stubs;

        beforeEach(() => {
            stubs = {
                setHeatwaveStatus: sinon.stub(shantytownModel, 'setHeatwaveStatus'),
                findOne: sinon.stub(shantytownModel, 'findOne'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });


        it('met à jour le site en changeant le statut de canicule et renvoie le site ainsi modifié', async () => {
            const updatedTown = fakeShantytown(paris.city(), { heatwave_status: true });
            stubs.findOne.resolves(updatedTown);
            const response = await setHeatwaveStatusService(user, data);
            expect(stubs.setHeatwaveStatus).to.have.been.calledOnceWith(data.shantytown.id, data.heatwave_status);
            expect(response).to.be.eql(updatedTown);
        });
    });
});
