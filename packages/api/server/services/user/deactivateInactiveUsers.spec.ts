import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const userModel = {
    findUsersToBeDeactivated: sandbox.stub(),
    deactivate: sandbox.stub(),
};
const mails = {
    sendInactiveUserDeactivationAlert: sandbox.stub(),
};

rewiremock('#server/mails/mails').with(mails);
rewiremock('#server/models/userModel/index').with(userModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deactivateInactiveUsers from './deactivateInactiveUsers';
rewiremock.disable();

describe('userService/deactivateInactiveUsers', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('si aucun utilisateur n\'est à désactiver, ne fait rien', async () => {
        userModel.findUsersToBeDeactivated.resolves([]);
        await deactivateInactiveUsers();

        expect(userModel.deactivate).to.not.have.been.called;
    });
    it('si des utilisateurs sont à désactiver, les désactive', async () => {
        userModel.findUsersToBeDeactivated.resolves([
            fakeUser({ id: 42 }),
            fakeUser({ id: 60 }),
        ]);
        await deactivateInactiveUsers();

        expect(userModel.deactivate).to.have.been.calledOnceWith([42, 60]);
    });
    it('si des utilisateurs sont à désactiver, envoie une notification à chaque utilisateur', async () => {
        const users = [
            fakeUser({ id: 42 }),
            fakeUser({ id: 60 }),
        ];
        userModel.findUsersToBeDeactivated.resolves(users);
        await deactivateInactiveUsers();

        expect(mails.sendInactiveUserDeactivationAlert).to.have.been.calledWith(users[0]);
        expect(mails.sendInactiveUserDeactivationAlert).to.have.been.calledWith(users[1]);
    });
    it('attend la désactivation des utilisateurs avant d\'envoyer les notifications mails', async () => {
        userModel.findUsersToBeDeactivated.resolves([fakeUser()]);
        userModel.deactivate.rejects(new Error());

        try {
            await deactivateInactiveUsers();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }

        expect(mails.sendInactiveUserDeactivationAlert).to.not.have.been.called;
    });
});
