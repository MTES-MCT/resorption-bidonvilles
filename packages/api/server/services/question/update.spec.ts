import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import { input as fakeQuestionInput } from '#test/utils/question';
import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';
import { UpdateQuestionInput } from '#server/models/questionModel/QuestionInput.d';
import type { Question } from '#root/types/resources/Question.d';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const updateQuestion = sandbox.stub();

rewiremock('#server/models/questionModel/update').with(updateQuestion);
rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import updateService from './update';
rewiremock.disable();

describe('services/question/update', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('update une question', async () => {
        const expectedResult: Partial<Question> = {
            id: 42,
            details: 'Fake Question details',
            updatedAt: Date.now(),
            updatedBy: fakeUser({ id: 1 }),
        };

        updateQuestion.resolves(expectedResult);
        const result = await updateService(42, fakeQuestionInput({ question_id: 42 }) as UpdateQuestionInput, 1);

        expect(updateQuestion).to.have.been.calledOnceWith({
            question_id: 42,
            details: 'Fake Question details',
            question: 'Fake question',
            tags: ['housing'],
            other_tag: null,
            people_affected: null,
            updated_by: 1,
        });
        // console.log('Update Question:', result);
        // console.log('Expected:', expectedResult);


        expect(result).to.eql(expectedResult);
    });

    it('en cas d\'erreur, lance une ServiceError', async () => {
        const nativeError = new Error('Une erreur inconnue est survenue');
        updateQuestion.rejects(nativeError);

        let error;
        try {
            await updateService(42, fakeQuestionInput() as UpdateQuestionInput, 1);
        } catch (e) {
            error = e;
        }

        expect(error).to.be.an.instanceOf(ServiceError);
        expect(error.code).to.be.eql('question_update_failed');
        expect(error.nativeError).to.be.eql(nativeError);
    });
});
