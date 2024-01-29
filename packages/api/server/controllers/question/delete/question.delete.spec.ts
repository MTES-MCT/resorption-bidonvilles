import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as fakeQuestion } from '#test/utils/question';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const deleteQuestion = sandbox.stub();

rewiremock('#server/services/question/delete').with(deleteQuestion);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deleteController from './question.delete';
rewiremock.disable();

describe('questionController.delete()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande la suppression de la question', async () => {
        const req = mockReq({
            user: fakeUser({ is_superuser: true }),
            question: fakeQuestion({ id: 1 }),
        });
        const res = mockRes();

        await deleteController(req, res, () => {});
        expect(deleteQuestion).to.have.been.calledOnceWith(1);
    });

    it('répond avec un code 204 et la question est supprimée', async () => {
        const req = mockReq({
            user: fakeUser({ is_superuser: true }),
            question: fakeQuestion(),
        });
        const res = mockRes();

        await deleteController(req, res, () => {});
        expect(res.status).to.have.been.calledOnceWith(204);
    });

    it('en cas d\'erreur, répond avec un code 500 et un détail de l\'erreur', async () => {
        const req = mockReq({
            user: fakeUser({ is_superuser: true }),
            question: fakeQuestion(),
        });
        const res = mockRes();
        const next = sandbox.stub();

        const error = new Error();
        deleteQuestion.rejects(error);

        await deleteController(req, res, next);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(next).to.have.been.calledOnceWith(error);
    });
});
