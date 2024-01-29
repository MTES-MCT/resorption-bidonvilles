import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const sendActivationLinkService = sandbox.stub();

rewiremock('#server/services/user/sendActivationLink').with(sendActivationLinkService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import sendActivationLinkController from './user.sendActivationLink';
rewiremock.disable();

describe('userController.sendActivationLink()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande l\'envoi d\'un accès au compte', async () => {
        const req = mockReq({
            userToBeActivated: fakeUser({ id: 42 }),
            user: fakeUser({ id: 1 }),
            body: {
                options: ['option1', 'option2'],
            },
        });
        const res = mockRes();

        await sendActivationLinkController(req, res, () => {});
        expect(sendActivationLinkService).to.have.been.calledOnce;
        expect(sendActivationLinkService).to.have.been.calledWith(req.user, req.userToBeActivated, ['option1', 'option2']);
    });

    it('répond avec un code 200 et l\'utilisateur mis à jour', async () => {
        const originalUser = fakeUser({ id: 42, status: 'inactive' });
        const updatedUser = fakeUser({ id: 42, status: 'active' });

        const req = mockReq({
            userToBeActivated: originalUser,
            user: fakeUser({ id: 1 }),
            body: {
                options: [],
            },
        });
        const res = mockRes();

        sendActivationLinkService.resolves(updatedUser);

        await sendActivationLinkController(req, res, () => {});
        expect(res.status).to.have.been.calledOnceWith(200);
        expect(res.send).to.have.been.calledOnceWith(updatedUser);
    });

    it('en cas d\'erreur, répond avec un code 500 et un détail de l\'erreur', async () => {
        const req = mockReq({
            userToBeActivated: fakeUser({ id: 42 }),
            user: fakeUser({ id: 1 }),
            body: {
                options: [],
            },
        });
        const res = mockRes();
        const next = sandbox.stub();

        const error = new Error();
        sendActivationLinkService.rejects(error);

        await sendActivationLinkController(req, res, next);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(next).to.have.been.calledOnceWith(error);
    });
});
