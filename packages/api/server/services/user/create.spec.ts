import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import rewiremock from 'rewiremock/node';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiAsPromised);

// stubs
const sandbox = sinon.createSandbox();
const sequelize = {
    transaction: sandbox.stub(),
};
const mattermostUtils = {
    triggerNotifyNewUserFromRectorat: sandbox.stub(),
};
const userModel = {
    findOne: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/utils/mattermost').with(mattermostUtils);
rewiremock('#server/models/userModel').with(userModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createUser from './create';
rewiremock.disable();

describe('userService.createUser()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('envoie une notification mattermost lorsqu\'un utilisateur de rectorat est créé', async () => {
        // prepare
        const user = fakeUser();
        user.organization.type.uid = 'rectorat';
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        // execute
        await createUser({});
        // assert
        expect(mattermostUtils.triggerNotifyNewUserFromRectorat).to.have.been.calledWith(user);
    });

    it('n\'envoie pas de notification mattermost lorsqu\'un utilisateur hors rectorat est créé', async () => {
        // prepare
        const user = fakeUser();
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        // execute
        await createUser({});
        // assert
        expect(mattermostUtils.triggerNotifyNewUserFromRectorat).to.not.have.been.called;
    });

    it('retourne l\'utilisateur nouvellement créé', async () => {
        // prepare
        const user = fakeUser();
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        // execute
        const response = await createUser({});
        // assert
        expect(response).to.be.eql(user);
    });

    it('ne lance pas d\'exception si l\'envoi de la notification mattermost échoue', async () => {
        // prepare
        const user = fakeUser();
        user.organization.type.uid = 'rectorat';
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        mattermostUtils.triggerNotifyNewUserFromRectorat.rejects(new Error('une erreur'));
        // assert
        await expect(createUser({})).not.to.be.rejected;
    });
});
