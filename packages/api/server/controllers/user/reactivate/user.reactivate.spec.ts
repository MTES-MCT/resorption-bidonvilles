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
    reactivate: sandbox.stub(),
};

rewiremock('#server/services/user/index').with(userService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import reactivateController from './user.reactivate';
rewiremock.disable();

describe('userController.reactivate()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande la réactivation du compte', async () => {
        const req = mockReq({
            user: fakeUser({ is_admin: true }),
            body: {
                user: fakeUser({ id: 42 }),
            },
        });
        const res = mockRes();

        await reactivateController(req, res, () => {});
        expect(userService.reactivate).to.have.been.calledOnce;
        expect(userService.reactivate).to.have.been.calledWith(req.user, 42);
    });

    it('répond avec un code 200 et l\'utilisateur mis à jour', async () => {
        const originalUser = fakeUser({ id: 42, status: 'inactive' });
        const updatedUser = fakeUser({ id: 42, status: 'active' });

        const req = mockReq({
            user: fakeUser({ is_admin: true }),
            body: {
                user: originalUser,
            },
        });
        const res = mockRes();

        userService.reactivate.withArgs(req.user, 42).resolves(updatedUser);

        await reactivateController(req, res, () => {});
        expect(res.status).to.have.been.calledOnceWith(200);
        expect(res.send).to.have.been.calledOnceWith(updatedUser);
    });

    it('en cas d\'erreur, répond avec un code 500 et un détail de l\'erreur', async () => {
        const req = mockReq({
            user: fakeUser({ is_admin: true }),
            body: {
                user: fakeUser(),
            },
        });
        const res = mockRes();
        const next = sandbox.stub();

        const error = new Error();
        userService.reactivate.rejects(error);

        await reactivateController(req, res, next);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(next).to.have.been.calledOnceWith(error);
    });
});
