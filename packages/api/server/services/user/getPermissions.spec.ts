import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { Permissions } from '#server/models/permissionModel/types/Permissions.d';

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
        const stubPermissions: Permissions = {
            shantytown: {
                create: {
                    allowed: true, allowed_on_national: true, allowed_on: null,
                },
            },
        };
        permissionModel.find.withArgs([60]).resolves({ 60: stubPermissions });

        const permissions = await getPermissions(60);
        expect(permissions).to.be.eql({
            shantytown: {
                create: {
                    allowed: true, allowed_on_national: true, allowed_on: null,
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
