import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as fakeUser } from '#test/utils/user';
import authUtils from '#server/utils/auth';

const { hashPassword } = authUtils;

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();

const userModel = {
    findOne: sandbox.stub(),
};
const authUtilsMock = {
    hashPassword: sandbox.stub(),
};

rewiremock('#server/utils/auth').with(authUtilsMock);
rewiremock('#server/models/userModel').withDefault(userModel);


rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import controller from './user.checkPassword';
const { hashPassword: hashPasswordStub } = authUtilsMock;

rewiremock.disable();

describe.skip('vérification du mot de passe actuel', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('mot de passe valide', async () => {
        const req = mockReq({
            params: {
                id: 2,
            },
            body: {
                password: 'Mock123456789!!!',
            },
        });

        const res = mockRes();
        const user = fakeUser();

        hashPasswordStub.callsFake(hashPassword);
        const result = hashPasswordStub(req.body.password, user.salt);

        await controller(req, res, () => {});
        expect(req.params.id).to.equal(user.id);
        expect(hashPasswordStub).to.have.been.calledOnce;
        expect(hashPasswordStub).to.have.been.calledWith(req.body.password);
        expect(result).to.equal(user.password);
    });

    it('mot de passe invalide', async () => {
        const req = mockReq({
            params: {
                id: 2,
            },
            body: {
                password: 'Mock123456789!!!!',
            },
        });

        const res = mockRes();
        const user = fakeUser();

        hashPasswordStub.callsFake(hashPassword);
        const result = hashPasswordStub(req.body.password, user.salt);

        await controller(req, res, () => {});
        expect(req.params.id).to.equal(user.id);
        expect(hashPasswordStub).to.have.been.calledOnce;
        expect(hashPasswordStub).to.have.been.calledWith(req.body.password, user.salt);
        expect(result).to.not.equal(user.password);
    });

    it('utilisateur invalide', async () => {
        const req = mockReq({
            params: {
                id: 42,
            },
            body: {
                password: 'Mock123456789!!!!',
            },
        });

        const res = mockRes();
        const user = fakeUser();

        await controller(req, res, () => {});
        expect(req.params.id).to.not.equal(user.id);
    });
});
