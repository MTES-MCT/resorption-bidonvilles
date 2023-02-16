import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import actionModel from '#server/models/actionModel';
import userModel from '#server/models/userModel';
import locationUtils from '#test/utils/location';

import mails from '#server/mails/mails';

import mattermostUtils from '#server/utils/mattermost';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import { serialized as fakeActionComment } from '#test/utils/actionComment';

import createComment from './createComment';

const { expect } = chai;
chai.use(sinonChai);

describe('services/action.createComment()', () => {
    const user = fakeUser();
    const action = fakeAction({ location: locationUtils.paris.departement() });
    const comment = { description: 'ceci est un commentaire de test' };
    const newComment = fakeActionComment(comment);
    let stubs;

    beforeEach(() => {
        stubs = {
            createComment: sinon.stub(actionModel, 'createComment'),
            getActionObservers: sinon.stub(userModel, 'getActionObservers'),
            triggerNewActionComment: sinon.stub(mattermostUtils, 'triggerNewActionComment'),
            sendUserNewActionComment: sinon.stub(mails, 'sendUserNewActionComment'),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('crée le commentaire en base de données et le renvoie', async () => {
        stubs.createComment.resolves(newComment);

        const response = await createComment(user.id, action, comment);
        expect(stubs.createComment).to.have.been.calledOnceWith(action.id, { ...comment, created_by: user.id });
        expect(response).to.be.eql(newComment);
    });

    it('envoie une notification mattermost', async () => {
        stubs.createComment.resolves(newComment);
        await createComment(user.id, action, comment);
        // eslint-disable-next-line no-unused-expressions
        expect(stubs.triggerNewActionComment).to.have.been.calledOnce;
    });

    it('envoie une notification mail aux personnes concernées', async () => {
        const observers = [fakeUser(), fakeUser(), fakeUser()];
        stubs.createComment.resolves(newComment);

        stubs.getActionObservers.resolves(observers);

        await createComment(user.id, action, comment);
        // eslint-disable-next-line no-unused-expressions
        expect(stubs.sendUserNewActionComment).to.have.been.calledThrice;
    });
});
