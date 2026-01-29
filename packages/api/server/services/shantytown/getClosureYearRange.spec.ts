import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownModel: {
        getClosureYearRange: sandbox.stub(),
    },
};

rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import getClosureYearRange from './getClosureYearRange';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('getClosureYearRange()', () => {
        afterEach(() => {
            sandbox.reset();
        });

        it('retourne la plage d\'années de fermeture', async () => {
            const range = { minYear: 2021, maxYear: 2024 };
            stubs.shantytownModel.getClosureYearRange.resolves(range);

            const response = await getClosureYearRange();

            expect(stubs.shantytownModel.getClosureYearRange).to.have.been.calledOnce;
            expect(response).to.be.eql(range);
        });

        it('renvoie une exception ServiceError \'fetch_failed\' si le modèle échoue', async () => {
            const nativeError = new Error('une erreur');
            stubs.shantytownModel.getClosureYearRange.rejects(nativeError);

            let responseError;
            try {
                await getClosureYearRange();
            } catch (error) {
                responseError = error;
            }

            expect(stubs.shantytownModel.getClosureYearRange).to.have.been.calledOnce;
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
            expect(responseError.nativeError).to.be.eql(nativeError);
        });
    });
});
