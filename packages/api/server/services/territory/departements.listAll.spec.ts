import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import territories from '#test/utils/territories';
import { Departement } from '#root/types/resources/Departement.d';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    departementModel: {
        findAll: sandbox.stub(),
    },
};

rewiremock('#server/models/departementModel').with(stubs.departementModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import departements from './departements.listAll';
rewiremock.disable();

describe('services/territory.departements.listAll()', () => {
    beforeEach(() => {
        stubs.departementModel.findAll.reset();
        const departementList: Departement[] = territories.departement();
        stubs.departementModel.findAll.resolves(departementList);
    });

    afterEach(() => {
        sandbox.resetHistory();
    });

    after(() => {
        sandbox.restore();
    });

    it('renvoi la liste des départements', async () => {
        const result = await departements();

        expect(stubs.departementModel.findAll).to.have.been.calledOnce;
        expect(result).to.deep.equal(territories.departement().map(departement => ({
            id: departement.code,
            name: `${departement.code} - ${departement.name}`,
        })));
    });
});
