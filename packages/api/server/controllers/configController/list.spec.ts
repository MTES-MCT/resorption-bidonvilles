import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const configService = {
    fetch: sandbox.stub(),
};

rewiremock('#server/services/config/index').with(configService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import listController from './list';
rewiremock.disable();

describe('configController.list()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('demande la configuration pour l\'utilisateur connecté', async () => {
        const req = mockReq({
            user: fakeUser({ id: 42 }),
        });
        const res = mockRes();

        await listController(req, res, () => {});
        expect(configService.fetch).to.have.been.calledOnce;
        expect(configService.fetch).to.have.been.calledWith(req.user);
    });

    it('répond avec un code 200 et la configuration', async () => {
        const req = mockReq({
            user: fakeUser(),
        });
        const res = mockRes();

        configService.fetch.withArgs(req.user).resolves({
            foo: 'bar',
        });

        await listController(req, res, () => {});
        expect(res.status).to.have.been.calledOnceWith(200);
        expect(res.send).to.have.been.calledOnceWith({
            foo: 'bar',
        });
    });

    it('en cas d\'erreur, répond avec un code 500 et un détail de l\'erreur', async () => {
        const req = mockReq({
            user: fakeUser(),
        });
        const res = mockRes();
        const next = sandbox.stub();

        const error = new Error();
        configService.fetch.rejects(error);

        await listController(req, res, next);
        expect(res.status).to.have.been.calledWith(500);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(next).to.have.been.calledOnceWith(error);
    });
});
