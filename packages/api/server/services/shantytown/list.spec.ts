import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeTown } from '#test/utils/shantytown';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownModel: { findAll: sandbox.stub() },
    shantytownDecree: sandbox.stub().resolves([]),
    serializeAttachment: sandbox.stub().resolves({}),
    can: sandbox.stub(),
    do: sandbox.stub(),
    on: sandbox.stub(),
};

rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);
rewiremock('#server/services/shantytownDecree/findAll').with(stubs.shantytownDecree);
rewiremock('#server/services/attachment/serializeAttachment').with(stubs.serializeAttachment);
rewiremock('#server/utils/permission/can').with(stubs.can);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import listService from './list';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('list()', () => {
        const user = {};
        let towns = [];

        beforeEach(() => {
            towns = [fakeTown()];
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

        it('retourne la liste de tous les sites', async () => {
            stubs.shantytownModel.findAll.resolves(towns);
            let shantytownsResponse;
            try {
                shantytownsResponse = await listService(user);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
            expect(shantytownsResponse).to.be.eql(towns);
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si le modèle échoue à renvoyer les sites', async () => {
            stubs.shantytownModel.findAll.rejects(new Error());
            let responseError;
            try {
                await listService(user);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
