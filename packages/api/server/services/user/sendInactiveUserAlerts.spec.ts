import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const userModel = {
    findInactiveUsers: sandbox.stub(),
    setInactivityAlertSentAt: sandbox.stub(),
};
const mails = {
    sendInactiveUserAlert: sandbox.stub(),
};

rewiremock('#server/mails/mails').with(mails);
rewiremock('#server/models/userModel/index').with(userModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import sendInactiveUserAlerts from './sendInactiveUserAlerts';
rewiremock.disable();

describe('userService/sendInactiveUserAlerts', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('si aucun utilisateur n\'est à alerter, ne fait rien', async () => {
        userModel.findInactiveUsers.resolves([]);
        await sendInactiveUserAlerts();

        expect(userModel.setInactivityAlertSentAt).to.not.have.been.called;
    });
    it('si des utilisateurs sont à désactiver, les désactive', async () => {
        userModel.findInactiveUsers.resolves([
            fakeUser({ id: 42 }),
            fakeUser({ id: 60 }),
        ]);
        await sendInactiveUserAlerts();

        expect(userModel.setInactivityAlertSentAt).to.have.been.calledOnceWith([42, 60]);
    });
    it('si des utilisateurs sont à désactiver, envoie une notification à chaque utilisateur', async () => {
        const users = [
            fakeUser({ id: 42 }),
            fakeUser({ id: 60 }),
        ];
        userModel.findInactiveUsers.resolves(users);
        await sendInactiveUserAlerts();

        expect(mails.sendInactiveUserAlert).to.have.been.calledWith(users[0]);
        expect(mails.sendInactiveUserAlert).to.have.been.calledWith(users[1]);
    });
    it('attend la désactivation des utilisateurs avant d\'envoyer les notifications mails', async () => {
        userModel.findInactiveUsers.resolves([fakeUser()]);
        userModel.setInactivityAlertSentAt.rejects(new Error());

        try {
            await sendInactiveUserAlerts();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }

        expect(mails.sendInactiveUserAlert).to.not.have.been.called;
    });
});
