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

describe('vérification du mot de passe actuel', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('retourne une erreur 400 si le password n\'est pas une chaîne de caractères', async () => {
        const req = mockReq({
            params: {
                id: 2,
            },
            body: {
                password: 123456,
            },
        });

        const res = mockRes();

        await controller(req, res, () => {});

        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith({
            user_message: 'Ces identifiants sont incorrects',
            fields: {
                password: ['Le mot de passe est invalide'],
            },
        });
        expect(userModel.findOne).to.not.have.been.called;
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

        userModel.findOne.withArgs(2, { auth: true }).resolves(user);
        hashPasswordStub.callsFake(hashPassword);

        await controller(req, res, () => {});

        expect(userModel.findOne).to.have.been.calledOnce;
        expect(userModel.findOne).to.have.been.calledWith(2, { auth: true });
        expect(hashPasswordStub).to.have.been.calledOnce;
        expect(hashPasswordStub).to.have.been.calledWith(req.body.password, user.salt);
        expect(res.status).to.have.been.calledWith(200);
        expect(res.send).to.have.been.calledWith({
            checkActualPassword: true,
        });
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

        userModel.findOne.withArgs(2, { auth: true }).resolves(user);
        hashPasswordStub.callsFake(hashPassword);

        await controller(req, res, () => {});

        expect(userModel.findOne).to.have.been.calledOnce;
        expect(userModel.findOne).to.have.been.calledWith(2, { auth: true });
        expect(hashPasswordStub).to.have.been.calledOnce;
        expect(hashPasswordStub).to.have.been.calledWith(req.body.password, user.salt);
        expect(res.status).to.have.been.calledWith(200);
        expect(res.send).to.have.been.calledWith({
            checkActualPassword: false,
        });
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
        const next = sinon.spy();

        userModel.findOne.withArgs(42, { auth: true }).resolves(null);

        await controller(req, res, next);

        expect(userModel.findOne).to.have.been.calledOnce;
        expect(userModel.findOne).to.have.been.calledWith(42, { auth: true });
        expect(res.status).to.have.been.calledWith(500);
        expect(next).to.have.been.calledOnce;
    });
});
