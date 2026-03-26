import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import territories from '#test/utils/territories';
import { Region } from '#root/types/resources/Region.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    regionModel: {
        findAll: sandbox.stub(),
    },
};

rewiremock('#server/models/regionModel').with(stubs.regionModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import regions from './regions.listAll';
rewiremock.disable();

describe('services/territory.regions.listAll()', () => {
    beforeEach(() => {
        stubs.regionModel.findAll.reset();
        const regionList: Region[] = territories.region();
        stubs.regionModel.findAll.resolves(regionList);
    });

    afterEach(() => {
        sandbox.resetHistory();
    });

    after(() => {
        sandbox.restore();
    });

    it('renvoi la liste des régions', async () => {
        const result = await regions();

        expect(stubs.regionModel.findAll).to.have.been.calledOnce;
        expect(result).to.deep.equal(territories.region().map(region => ({
            id: region.code,
            name: `${region.code} - ${region.name}`,
        })));
    });
});
