import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const userService = {
    setExpertiseTopics: sandbox.stub(),
};

rewiremock('#server/services/user/index').with(userService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import setExpertiseTopics from './setExpertiseTopics';
rewiremock.disable();

describe('userController.setExpertiseTopics()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande la mise à jour de l\'utilisateur', async () => {
        const req = mockReq({
            body: {
                user: fakeUser({ id: 42 }),
                expertise_topics: ['a', 'b'],
                interest_topics: ['c'],
            },
        });
        const res = mockRes();

        await setExpertiseTopics(req, res, () => {});
        expect(userService.setExpertiseTopics).to.have.been.calledOnce;
        expect(userService.setExpertiseTopics).to.have.been.calledWith(42, ['a', 'b'], ['c']);
    });

    it('répond avec un code 200 et l\'utilisateur mis à jour', async () => {
        const originalUser = fakeUser({ id: 42, expertise_topics_chosen: false, expertise_topics: [] });
        const updatedUser = fakeUser({ id: 42, expertise_topics_chosen: true, expertise_topics: [{ uid: 'a', label: 'A', type: 'interest' }] });

        const req = mockReq({
            body: {
                user: originalUser,
                expertise_topics: [],
                interest_topics: ['a'],
            },
        });
        const res = mockRes();

        userService.setExpertiseTopics.withArgs(42, [], ['a']).resolves(updatedUser);

        await setExpertiseTopics(req, res, () => {});
        expect(res.status).to.have.been.calledOnceWith(200);
        expect(res.send).to.have.been.calledOnceWith(updatedUser);
    });

    it('en cas d\'erreur, répond avec un code 500 et un détail de l\'erreur', async () => {
        const req = mockReq({
            body: {
                user: fakeUser(),
                expertise_topics: [],
                interest_topics: [],
            },
        });
        const res = mockRes();
        const next = sandbox.stub();

        const error = new Error();
        userService.setExpertiseTopics.rejects(error);

        await setExpertiseTopics(req, res, next);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(next).to.have.been.calledOnceWith(error);
    });
});
