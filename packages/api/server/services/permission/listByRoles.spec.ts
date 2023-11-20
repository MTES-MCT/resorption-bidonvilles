import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const permissionModel = {
    listByRoles: sandbox.stub(),
};

rewiremock('#server/models/permissionModel/index').with(permissionModel);

rewiremock.enable();
// eslint-disable-next-line
import listByRoles from './listByRoles';
rewiremock.disable();

describe('permissionService.listByRoles()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('retourne la liste des permissions par rôle', async () => {
        permissionModel.listByRoles.resolves({
            national_admin: [],
            collaborator: [],
        });
        const result = await listByRoles();

        expect(result).to.be.eql({
            national_admin: [],
            collaborator: [],
        });
    });
});
