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
const tchapUtils = {
    triggerNotifyNewUserFromRectorat: sandbox.stub(),
};
const userModel = {
    findOne: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/utils/tchap').with(tchapUtils);
rewiremock('#server/models/userModel').with(userModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createUser from './create';
rewiremock.disable();

describe('userService.createUser()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('envoie une notification Tchap lorsqu\'un utilisateur de rectorat est créé', async () => {
        // prepare
        const user = fakeUser();
        user.organization.type.uid = 'rectorat';
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        // execute
        await createUser({});
        // assert
        expect(tchapUtils.triggerNotifyNewUserFromRectorat).to.have.been.calledWith(user);
    });

    it('n\'envoie pas de notification Tchap lorsqu\'un utilisateur hors rectorat est créé', async () => {
        // prepare
        const user = fakeUser();
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        // execute
        await createUser({});
        // assert
        expect(tchapUtils.triggerNotifyNewUserFromRectorat).to.not.have.been.called;
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

    it('ne lance pas d\'exception si l\'envoi de la notification Tchap échoue', async () => {
        // prepare
        const user = fakeUser();
        user.organization.type.uid = 'rectorat';
        sequelize.transaction.resolves(user.id);
        userModel.findOne.withArgs(user.id).resolves(user);
        tchapUtils.triggerNotifyNewUserFromRectorat.rejects(new Error('une erreur'));
        // assert
        await expect(createUser({})).not.to.be.rejected;
    });
});
