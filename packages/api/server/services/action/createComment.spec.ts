import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';
import rewiremock from 'rewiremock/node';

import actionModel from '#server/models/actionModel';
import attachment from '#server/services/attachment';
import locationUtils from '#test/utils/location';

import mattermostUtils from '#server/utils/mattermost';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import { serialized as fakeActionComment } from '#test/utils/actionComment';
import fakeFile from '#test/utils/file';
import { Transaction } from 'sequelize';


const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

// stubs
const sandbox = sinon.createSandbox();
const stubs = {
    createComment: sandbox.stub(actionModel, 'createComment'),
    triggerNewActionComment: sandbox.stub(mattermostUtils, 'triggerNewActionComment'),
    sendMailNotifications: sandbox.stub(),
    uploadFiles: sandbox.stub(attachment, 'upload'),
};

rewiremock('./createComment.sendMailNotifications').with(stubs.sendMailNotifications);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createComment from './createComment';
rewiremock.disable();

describe('services/action.createComment()', () => {
    const user = fakeUser({ id: 4 });
    const action = fakeAction({ location: locationUtils.paris.departement() });
    const input = { description: 'ceci est un commentaire de test' };
    const newComment = fakeActionComment({ ...input, id: 1 });

    afterEach(() => {
        sandbox.reset();
    });
    after(() => {
        sandbox.restore();
    });
    it('crée le commentaire en base de données et le renvoie', async () => {
        stubs.createComment.resolves(newComment);
        const comment = { ...input, files: [] };

        const response = await createComment(user.id, action, comment);
        expect(stubs.createComment).to.have.been.calledOnceWith(action.id, { ...input, created_by: user.id });
        expect(response).to.containSubset({ comment: newComment });
    });
    it('les pièces sont bien uploadées', async () => {
        const files = [fakeFile()];
        stubs.createComment.resolves(newComment);
        const comment = { ...input, files };
        await createComment(user.id, action, { ...comment, files });
        expect(stubs.uploadFiles).to.have.been.calledOnceWith('action_comment', 1, 4, files);
        expect(stubs.uploadFiles.getCall(0).args[4]).to.be.instanceOf(Transaction);
    });

    it('renvoie le nombre de personnes notifiées par mail', async () => {
        stubs.sendMailNotifications.resolves(3);
        const comment = { ...input, files: [] };
        const response = await createComment(user.id, action, comment);
        expect(response).to.containSubset({ numberOfObservers: 3 });
    });

    it('envoie une notification mattermost', async () => {
        stubs.createComment.resolves(newComment);
        const comment = { ...input, files: [] };
        await createComment(user.id, action, comment);
        expect(stubs.triggerNewActionComment).to.have.been.calledOnce;
    });

    it('envoie une notification mail aux personnes concernées', async () => {
        stubs.createComment.resolves(newComment);
        const comment = { ...input, files: [] };
        await createComment(user.id, action, comment);
        expect(stubs.sendMailNotifications).to.have.been.calledOnce;

        const { args } = stubs.sendMailNotifications.getCalls()[0];
        expect(args[0]).to.containSubset(action);
        expect(args[1]).to.containSubset(newComment);
    });
});
