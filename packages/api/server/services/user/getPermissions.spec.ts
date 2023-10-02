import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const permissionModel = {
    find: sandbox.stub(),
};

rewiremock('#server/models/permissionModel/index').with(permissionModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import getPermissions from './getPermissions';
rewiremock.disable();

describe('userService/getPermissions', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('retourne la liste des permissions de l\'utilisateur', async () => {
        permissionModel.find.withArgs([60]).resolves({
            60: {
                shantytown: {
                    create: {
                        allowed: true, allow_all: true, allowed_on: null, is_writing: true,
                    },
                },
            },
        });

        const permissions = await getPermissions(60);
        expect(permissions).to.be.eql({
            shantytown: {
                create: {
                    allowed: true, allow_all: true, allowed_on: null, is_writing: true,
                },
            },
        });
    });

    it('retourne un objet vide si l\'utilisateur n\'a pas de permissions', async () => {
        permissionModel.find.resolves({});

        const permissions = await getPermissions(60);
        expect(permissions).to.be.eql({});
    });
});
