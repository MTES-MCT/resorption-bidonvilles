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

describe('userController.deactivate()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande la désactivation du compte avec tous les paramètres', async () => {
        const currentUser = fakeUser({ id: 1 });
        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: null,
                anonymizationRequested: null,
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledOnce;
        expect(userService.deactivate).to.have.been.calledWith(42, false, currentUser, null, null);
    });

    it('indique bien au service si la demande de désactivation est faite par l\'utilisateur lui-même', async () => {
        const currentUser = fakeUser({ id: 42 });
        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: null,
                anonymizationRequested: null,
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledWith(42, true, currentUser, null, null);
    });

    it('indique bien au service si la demande de désactivation n\'est PAS faite par l\'utilisateur lui-même', async () => {
        const currentUser = fakeUser({ id: 1 });
        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: null,
                anonymizationRequested: null,
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledWith(42, false, currentUser, null, null);
    });

    it('indique bien au service la raison de la désactivation', async () => {
        const currentUser = fakeUser({ id: 1 });
        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: 'test',
                anonymizationRequested: null,
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledWith(42, false, currentUser, 'test', null);
    });

    it('indique bien au service la demande d\'anonymisation (true)', async () => {
        const currentUser = fakeUser({ id: 1 });
        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: null,
                anonymizationRequested: true,
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledWith(42, false, currentUser, null, true);
    });

    it('indique bien au service la demande d\'anonymisation (false)', async () => {
        const currentUser = fakeUser({ id: 1 });
        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: null,
                anonymizationRequested: false,
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledWith(42, false, currentUser, null, false);
    });

    it('indique bien au service la raison et la demande d\'anonymisation ensemble', async () => {
        const currentUser = fakeUser({ id: 42 });
        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: 'Compte en doublon',
                anonymizationRequested: true,
            },
        });
        const res = mockRes();

        await deactivateController(req, res, () => {});
        expect(userService.deactivate).to.have.been.calledWith(42, true, currentUser, 'Compte en doublon', true);
    });

    it('répond avec un code 200 et l\'utilisateur mis à jour', async () => {
        const currentUser = fakeUser({ id: 1 });
        const updatedUser = fakeUser({ id: 42, status: 'inactive' });

        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: null,
                anonymizationRequested: null,
            },
        });
        const res = mockRes();

        userService.deactivate.withArgs(42, false, currentUser, null, null).resolves(updatedUser);

        await deactivateController(req, res, () => {});
        expect(res.status).to.have.been.calledOnceWith(200);
        expect(res.send).to.have.been.calledOnceWith(updatedUser);
    });

    it('en cas d\'erreur, répond avec un code 500 et un détail de l\'erreur', async () => {
        const currentUser = fakeUser({ id: 1 });
        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: null,
                anonymizationRequested: null,
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

    it('en cas d\'utilisateur déjà inactif, répond avec un code 400', async () => {
        const currentUser = fakeUser({ id: 1 });
        const req = mockReq({
            user: currentUser,
            params: { id: '42' },
            body: {
                reason: null,
                anonymizationRequested: null,
            },
        });
        const res = mockRes();
        const next = sandbox.stub();

        const error = {
            code: 'user_already_inactive',
            nativeError: new Error('User is already inactive'),
        };
        userService.deactivate.rejects(error);

        await deactivateController(req, res, next);
        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith({
            user_message: 'L\'utilisateur est déjà inactif',
        });
        expect(next).to.have.been.calledOnceWith(error.nativeError);
    });
});
