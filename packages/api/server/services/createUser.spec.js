const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const rewiremock = require('rewiremock/node');
const { serialized: fakeUser } = require('#test/utils/user');

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiAsPromised);

// stubs
const sequelize = {
    transaction: sinon.stub(),
};
const mattermostUtils = {
    triggerNotifyNewUserFromRectorat: sinon.stub(),
};
const userModel = {
    findOne: sinon.stub(),
};
const createUser = rewiremock.proxy('./createUser.js', {
    '#db/sequelize': sequelize,
    '#server/utils/mattermost': mattermostUtils,
    '#server/models/userModel': userModel,
});

describe.only('userService.createUser()', () => {
    afterEach(() => {
        sinon.reset();
    });

    it('envoie une notification mattermost lorsqu\'un utilisateur de rectorat est créé', async () => {
        // prepare
        const user = fakeUser();
        user.organization.type.uid = 'rectorat';
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        // execute
        await createUser();
        // assert
        expect(mattermostUtils.triggerNotifyNewUserFromRectorat).to.have.been.calledWith(user);
    });

    it('n\'envoie pas de notification mattermost lorsqu\'un utilisateur hors rectorat est créé', async () => {
        // prepare
        const user = fakeUser();
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        // execute
        await createUser();
        // assert
        expect(mattermostUtils.triggerNotifyNewUserFromRectorat).to.not.have.been.called;
    });

    it('retourne l\'utilisateur nouvellement créé', async () => {
        // prepare
        const user = fakeUser();
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        // execute
        const response = await createUser();
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
        await expect(createUser()).not.to.be.rejected;
    });
});
