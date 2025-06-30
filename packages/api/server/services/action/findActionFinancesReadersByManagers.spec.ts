import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';

import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeOrganization } from '#test/utils/organization';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();
const actionModel = {
    findActionFinancesReadersByManagers: sandbox.stub(),
};
rewiremock('#server/models/actionModel').withDefault(actionModel);

describe.skip('services/action.findActionFinancesReadersByManagers()', () => {
    let findActionFinancesReadersByManagers;
    beforeEach(async () => {
        rewiremock.enable();
        ({ default: findActionFinancesReadersByManagers } = await rewiremock.module(() => import('./findActionFinancesReadersByManagers')));
    });
    afterEach(() => {
        rewiremock.disable();
        sandbox.restore();
    });

    it('retourne la liste des utilisateurs fournie par actionModel', async () => {
        const organizations = [
            fakeOrganization(),
            fakeOrganization(),
        ];
        actionModel.findActionFinancesReadersByManagers.withArgs([1, 2]).resolves(organizations);
        const response = await findActionFinancesReadersByManagers([1, 2]);
        expect(response).to.be.eql(organizations);
    });

    it('lance une exception fetch_failed si le modèle échoue', async () => {
        actionModel.findActionFinancesReadersByManagers.rejects(new Error('Une erreur'));
        try {
            await findActionFinancesReadersByManagers([1, 2]);
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('fetch_failed');
            expect(error.message).to.be.equal('Une erreur');
            return;
        }

        expect.fail('Une exception était attendue');
    });
});
