import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const deleteQuestion = sandbox.stub();

rewiremock('#server/models/questionModel/delete').with(deleteQuestion);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deleteService from './delete';
rewiremock.disable();

describe('questionService.delete()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande la suppression de la question', async () => {
        await deleteService(112);
        expect(deleteQuestion).to.have.been.calledOnceWith(112);
    });

    it('en cas d\'erreur, lance une ServiceError', async () => {
        const nativeError = new Error('Une erreur inconnue est survenue');
        deleteQuestion.rejects(nativeError);

        let error;
        try {
            await deleteService(112);
        } catch (e) {
            error = e;
        }

        expect(error).to.be.an.instanceOf(ServiceError);
        expect(error.code).to.be.eql('delete_failed');
        expect(error.nativeError).to.be.eql(nativeError);
    });
});
