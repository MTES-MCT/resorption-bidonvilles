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
    setTags: sandbox.stub(),
};

rewiremock('#server/services/user/index').with(userService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import setTagsController from './setTags';
rewiremock.disable();

describe('userController.setTags()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande la mise à jour de l\'utilisateur', async () => {
        const req = mockReq({
            body: {
                user: fakeUser({ id: 42 }),
                tags: ['a', 'b'],
            },
        });
        const res = mockRes();

        await setTagsController(req, res, () => {});
        expect(userService.setTags).to.have.been.calledOnce;
        expect(userService.setTags).to.have.been.calledWith(42, ['a', 'b']);
    });

    it('répond avec un code 200 et l\'utilisateur mis à jour', async () => {
        const originalUser = fakeUser({ id: 42, tags_chosen: false, tags: [] });
        const updatedUser = fakeUser({ id: 42, tags_chosen: true, tags: [{ uid: 'a', name: 'A' }] });

        const req = mockReq({
            user: fakeUser(),
            body: {
                user: originalUser,
                tags: ['a'],
            },
        });
        const res = mockRes();

        userService.setTags.withArgs(42, ['a']).resolves(updatedUser);

        await setTagsController(req, res, () => {});
        expect(res.status).to.have.been.calledOnceWith(200);
        expect(res.send).to.have.been.calledOnceWith(updatedUser);
    });

    it('en cas d\'erreur, répond avec un code 500 et un détail de l\'erreur', async () => {
        const req = mockReq({
            user: fakeUser(),
            body: {
                user: fakeUser(),
                tags: [],
            },
        });
        const res = mockRes();
        const next = sandbox.stub();

        const error = new Error();
        userService.setTags.rejects(error);

        await setTagsController(req, res, next);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(next).to.have.been.calledOnceWith(error);
    });
});
