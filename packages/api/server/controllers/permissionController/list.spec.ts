import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

import { mockReq, mockRes } from 'sinon-express-mock';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const permissionService = {
    listByRoles: sandbox.stub(),
};

rewiremock('#server/services/permission/index').with(permissionService);

rewiremock.enable();
// eslint-disable-next-line
import list from './list';
rewiremock.disable();

describe('permissionController.list()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('répond une 200', async () => {
        const req = mockReq();
        const res = mockRes();
        await list(req, res, () => {});

        expect(res.status).to.have.been.calledOnceWith(200);
    });

    it('répond une liste de permissions par rôles', async () => {
        permissionService.listByRoles.resolves({
            national_admin: [],
            collaborator: [],
        });

        const req = mockReq();
        const res = mockRes();
        await list(req, res, () => {});

        expect(res.send).to.have.been.calledOnceWith({
            national_admin: [],
            collaborator: [],
        });
    });

    it('répond un code d\'erreur approprié en cas d\'erreur du service', async () => {
        const error = new Error('Erreur');
        permissionService.listByRoles.rejects(error);

        const req = mockReq();
        const res = mockRes();
        const nextFn = sandbox.stub();

        try {
            await list(req, res, nextFn);
        } catch (e) {
            expect.fail('L\'erreur aurait dû être interceptée par le contrôleur');
            return;
        }

        expect(res.status).to.have.been.calledOnceWith(500);
        expect(res.send).to.have.been.calledOnceWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(nextFn).to.have.been.calledOnceWith(error);
    });

    it('gère les ServiceErrors', async () => {
        const nativeError = Error('Erreur');
        const error = new ServiceError('test', nativeError);
        permissionService.listByRoles.rejects(error);

        const req = mockReq();
        const res = mockRes();
        const nextFn = sandbox.stub();

        try {
            await list(req, res, nextFn);
        } catch (e) {
            expect.fail('L\'erreur aurait dû être interceptée par le contrôleur');
            return;
        }

        expect(res.status).to.have.been.calledOnceWith(500);
        expect(res.send).to.have.been.calledOnceWith({
            user_message: 'Une erreur inconnue est survenue',
        });
        expect(nextFn).to.have.been.calledOnceWith(nativeError);
    });
});
