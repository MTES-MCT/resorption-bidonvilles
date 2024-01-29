import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as fakeAnswer } from '#test/utils/answer';
import { serialized as fakeQuestion } from '#test/utils/question';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const deleteAnswerService = sandbox.stub();

rewiremock('#server/services/answer/deleteAnswer').with(deleteAnswerService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deleteAnswer from './question.moderateAnswer';
rewiremock.disable();

describe('answerController.delete()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande la suppression de la réponse', async () => {
        const answer = fakeAnswer();
        const question = fakeQuestion();
        const req = mockReq({
            answer,
            question,
            body: {
                reason: 'une raison',
            },
        });
        const res = mockRes();

        await deleteAnswer(req, res, () => {});
        expect(deleteAnswerService).to.have.been.calledOnce;
        expect(deleteAnswerService).to.have.been.calledOnceWithExactly(question, answer, 'une raison');
    });

    it('répond avec un code 201', async () => {
        const res = mockRes();
        await deleteAnswer(mockReq(), res, () => {});
        expect(res.status).to.have.been.calledOnceWith(201);
        expect(res.send).to.have.been.calledOnceWith({});
    });

    it('en cas d\'erreur, répond avec un code 500 et un détail de l\'erreur', async () => {
        const res = mockRes();
        const next = sandbox.stub();

        const nativeError = new Error('une erreur');
        const error = new ServiceError('delete_failed', nativeError);
        deleteAnswerService.rejects(error);

        await deleteAnswer(mockReq(), res, (next));
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Une erreur est survenue lors de la suppression de la réponse',
        });
        expect(next).to.have.been.calledOnceWith(nativeError);
    });
});
