import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();

const userModelUpdate = sandbox.stub();
const findOneUser = sandbox.stub();
const findOneRole = sandbox.stub();

rewiremock('#server/models/userModel/update').withDefault(userModelUpdate);
rewiremock('#server/models/userModel/findOne').withDefault(findOneUser);
rewiremock('#server/models/roleModel/findOne').withDefault(findOneRole);

rewiremock.enable();
// eslint-disable-next-line import/first, import/newline-after-import
import setRoleRegular from './setRoleRegular';
rewiremock.disable();

function getRandomIndex(valueMax: number) {
    return Math.floor(Math.random() * valueMax) + 1;
}


const regularUser = fakeUser({ id: 1, is_superuser: false, is_admin: false });
const adminUser = fakeUser({ id: 2, is_admin: true });
const superAdminUser = fakeUser({ id: 3, is_admin: true, is_superuser: true });

const fakeIntervenerRole = { role_id: 'intervener', name: 'Intervenant' };
const fakeRegularRoles = [
    { role_id: 'association', name: 'Opérateur' },
    { role_id: 'collaborator', name: 'Partenaire institutionnel' },
    { role_id: 'direct_collaborator', name: 'Correspondant' },
    { role_id: 'external_observator', name: 'Observateur externe' },
];

describe('services/user/setRoleRegular', () => {

    afterEach(() => {
        sandbox.reset();
    });
    
    it('lève une erreur si l\'utilisateur n\'est pas "Administrateur local" et le rôle est "intervenant"', async () => {
        try {
            await setRoleRegular(regularUser, 2, fakeIntervenerRole.name);
            expect.fail('should have thrown an error');
        } catch (error) {
            expect(error).to.be.an.instanceOf(ServiceError);
            expect(error.code).to.equal('permission_denied');
        }
    });

    it('lève une erreur si un "Administrateur local" tente d\'affecter un rôle autre que "Intervenant"', async () => {
        try {
            const roleId = fakeRegularRoles[getRandomIndex(fakeRegularRoles.length - 1)].role_id;
            await setRoleRegular(adminUser, 2, roleId);
            expect.fail('should have thrown an error');
        } catch (error) {
            expect(error).to.be.an.instanceOf(ServiceError);
            expect(error.code).to.equal('permission_denied');
        }
    });

    it('lève une erreur si un utilisateur ordinaire essaie d\'affecter un rôle autre que "Intervenant"', async () => {
        try {
            const roleId = fakeRegularRoles[getRandomIndex(fakeRegularRoles.length - 1)].role_id;
            await setRoleRegular(regularUser, 2, roleId);
            expect.fail('should have thrown an error');
        } catch (error) {
            expect(error).to.be.an.instanceOf(ServiceError);
            expect(error.code).to.equal('permission_denied');
        }
    });

    it('change le rôle ordinaire d\'un utilisateur', async () => {
        const roleId = fakeRegularRoles[getRandomIndex(fakeRegularRoles.length - 1)].role_id;
        await setRoleRegular(superAdminUser, 2, roleId);
        expect(userModelUpdate).to.have.been.calledOnce;
        expect(userModelUpdate).to.have.been.calledOnceWith(
            2, { fk_role_regular: roleId },
        );
        expect(findOneUser).to.have.been.calledOnce;
    });

    it('retourne l\'utilisateur mis à jour', async () => {
        const roleId = fakeRegularRoles[getRandomIndex(fakeRegularRoles.length - 1)].role_id;
        const updatedUser = fakeUser();
        findOneUser.resolves(updatedUser);
        const result = await setRoleRegular(superAdminUser, 2, roleId);
        expect(result).to.equal(updatedUser);
    });
});
