import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { existingOrganization as fakeContactBody } from '#test/utils/contactBody';
import { serialized as fakeOrganization } from '#test/utils/organization';
import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const accessRequestService = {
    handleNewAccessRequest: sandbox.stub(),
};
const createUser = sandbox.stub();

rewiremock('#server/services/accessRequest/accessRequestService').with(accessRequestService);
rewiremock('./create').with(createUser);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import register from './register';
rewiremock.disable();

describe('userService/register', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('insère l\'utilisateur en base de données', async () => {
        await register(fakeContactBody({
            last_name: 'Dupont',
            first_name: 'Jean',
            email: 'jean.dupont@beta.gouv.fr',
            phone: '0102030405',
            organization_full: fakeOrganization({ id: 42 }),
            position: 'Développeur',
            access_request_message: 'Message de test',
        }));
        expect(createUser).to.have.been.calledOnceWithExactly({
            last_name: 'Dupont',
            first_name: 'Jean',
            email: 'jean.dupont@beta.gouv.fr',
            phone: '0102030405',
            organization: 42,
            position: 'Développeur',
            access_request_message: 'Message de test',
        });
    });

    it('si l\'insertion en base de données échoue, lance une exception ServiceError', async () => {
        const nativeError = new Error('insert_failed');
        createUser.rejects(nativeError);

        let error;
        try {
            await register(fakeContactBody());
            expect.fail('should have thrown an error');
        } catch (e) {
            error = e;
        }

        expect(error).to.be.instanceOf(ServiceError);
        expect(error.code).to.equal('insert_failed');
        expect(error.nativeError).to.equal(nativeError);
    });

    it('si l\'insertion en base de données échoue, ne planifie pas les mails automatiques', async () => {
        createUser.rejects(new Error());
        try {
            await register(fakeContactBody());
            expect.fail('should have thrown an error');
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }

        expect(accessRequestService.handleNewAccessRequest).to.not.have.been.called;
    });

    it('planifie les mails automatiques', async () => {
        const user = fakeUser();
        createUser.resolves(user);

        await register(fakeContactBody());
        expect(accessRequestService.handleNewAccessRequest).to.have.been.calledOnceWith(user);
    });

    it('si la planification des mails échoue, ignore l\'erreur', async () => {
        accessRequestService.handleNewAccessRequest.rejects(new Error());

        let error = null;
        try {
            await register(fakeContactBody());
        } catch (e) {
            error = e;
        }

        expect(error).to.be.null;
    });

    it('retourne l\'utilisateur nouvellement créé', async () => {
        const user = fakeUser();
        createUser.resolves(user);

        const result = await register(fakeContactBody());
        expect(result).to.equal(user);
    });
});
