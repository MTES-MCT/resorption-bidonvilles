import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';

import { Heatwave } from '#root/types/resources/Heatwave.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const year = new Date().getFullYear();
const fakeHeatwavePeriod = {
    start_date: `${year}-05-01`,
    end_date: `${year}-09-30`,
};
const fakeHeatwavePeriodReturnObject: Heatwave = {
    ...fakeHeatwavePeriod,
    isPeriodActive: false,
};

const sandbox = sinon.createSandbox();
let clock: sinon.SinonFakeTimers;
const stubs = {
    heatwaveModel: { get: sandbox.stub() },
};


rewiremock('#server/models/heatwaveModel/index').with(stubs.heatwaveModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import get from './get';
rewiremock.disable();

describe('services/heatwave/get', () => {
    beforeEach(() => {
        stubs.heatwaveModel.get.resolves([fakeHeatwavePeriod]);
        clock = sandbox.useFakeTimers(new Date(`${year}-07-15T12:00:00Z`).getTime());
    });

    afterEach(() => {
        clock.restore();
        sandbox.restore();
    });

    it('récupère les dates de début et de fin de la période de canicule en DB', async () => {
        try {
            await get();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.heatwaveModel.get).to.have.been.calledOnce;
    });

    it('renvoie isPeriodActive à true si la période de canicule est en cours', async () => {
        const fakeReturnObject = { ...fakeHeatwavePeriodReturnObject, isPeriodActive: true };
        const heatwave = await get();
        expect(heatwave).to.deep.equal(fakeReturnObject);
        expect(heatwave.isPeriodActive).to.be.true;
    });

    it('renvoie isPeriodActive à false si la période de canicule n\'est pas en cours', async () => {
        clock.setSystemTime(new Date(`${year}-10-15T12:00:00Z`).getTime());
        const heatwave = await get();
        expect(heatwave).to.deep.equal(fakeHeatwavePeriodReturnObject);
        expect(heatwave.isPeriodActive).to.be.false;
    });

    it('renvoie un ServiceError si aucune période de canicule n\'est trouvée en DB', async () => {
        stubs.heatwaveModel.get.resolves([]);
        try {
            await get();
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error).to.have.property('code', 'heatwave_not_found');
        }
    });

    it('renvoie un ServiceError si la récupération en DB échoue', async () => {
        stubs.heatwaveModel.get.rejects(new Error('DB error'));
        try {
            await get();
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error).to.have.property('code', 'heatwave_fetch_failed');
        }
    });
});
