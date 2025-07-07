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
    deactivate: sandbox.stub(),
};

rewiremock('#server/services/user/index').with(userService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deactivateController from './user.deactivate';
rewiremock.disable();

describe.skip('userController.deactivate()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande la désactivation du compte', async () => {
        const req = mockReq({
            user: fakeUser(),
            body: {
                user: fakeUser({ id: 42 }),
                reason: null,
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledOnce;
        expect(userService.deactivate).to.have.been.calledWith(42);
    });

    it('indique bien au service si la demande de désactivation est faite par l\'utilisateur lui-même', async () => {
        const req = mockReq({
            user: fakeUser({ id: 42 }),
            body: {
                user: fakeUser({ id: 42 }),
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledWith(42, true);
    });

    it('indique bien au service si la demande de désactivation n\'est PAS faite par l\'utilisateur lui-même', async () => {
        const req = mockReq({
            user: fakeUser({ id: 1 }),
            body: {
                user: fakeUser({ id: 42 }),
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledWith(42, false);
    });

    it('indique bien au service la raison de la désactivation', async () => {
        const req = mockReq({
            user: fakeUser({ id: 1 }),
            body: {
                user: fakeUser({ id: 42 }),
                reason: 'test',
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledWith(42, false, 'test');
    });

    it('répond avec un code 200 et l\'utilisateur mis à jour', async () => {
        const originalUser = fakeUser({ id: 42, status: 'active' });
        const updatedUser = fakeUser({ id: 42, status: 'inactive' });

        const req = mockReq({
            user: fakeUser(),
            body: {
                user: originalUser,
            },
        });
        const res = mockRes();

        userService.deactivate.withArgs(42).resolves(updatedUser);

        await deactivateController(req, res, () => {});
        expect(res.status).to.have.been.calledOnceWith(200);
        expect(res.send).to.have.been.calledOnceWith(updatedUser);
    });

    it('en cas d\'erreur, répond avec un code 500 et un détail de l\'erreur', async () => {
        const req = mockReq({
            user: fakeUser(),
            body: {
                user: fakeUser(),
            },
        });
        const res = mockRes();
        const next = sandbox.stub();

        const error = new Error();
        userService.deactivate.rejects(error);

        await deactivateController(req, res, next);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(next).to.have.been.calledOnceWith(error);
    });
});
