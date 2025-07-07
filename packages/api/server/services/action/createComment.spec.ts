import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeAction } from '#test/utils/action';
import { serialized as fakeActionComment, row as fakeActionCommentRow } from '#test/utils/actionComment';
import fakeFile from '#test/utils/file';
import ServiceError from '#server/errors/ServiceError';
import scanAttachmentErrors from '../attachment/scanAttachmentErrors';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

// stubs
const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        transaction: sandbox.stub(),
    },
    transaction: {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
    },
    createCommentModel: sandbox.stub(),
    fetchCommentsModel: sandbox.stub(),
    uploadAttachments: sandbox.stub(),
    serializeComment: sandbox.stub(),
    sendMattermostNotification: sandbox.stub(),
    sendMailNotifications: sandbox.stub(),
    enrichCommentsAttachments: sandbox.stub(),
};

rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/models/actionModel/createComment/createComment').with(stubs.createCommentModel);
rewiremock('#server/models/actionModel/fetchComments/fetchComments').with(stubs.fetchCommentsModel);
rewiremock('#server/models/actionModel/fetchComments/serializeComment').with(stubs.serializeComment);
rewiremock('#server/services/attachment/upload').with(stubs.uploadAttachments);
rewiremock('./createComment.sendMattermostNotification').with(stubs.sendMattermostNotification);
rewiremock('./createComment.sendMailNotifications').with(stubs.sendMailNotifications);
rewiremock('./enrichCommentsAttachments').with(stubs.enrichCommentsAttachments);
rewiremock('#server/services/attachment/scanAttachmentErrors').with(scanAttachmentErrors);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createComment from './createComment';
rewiremock.disable();

describe('services/action.createComment()', () => {
    beforeEach(() => {
        stubs.sequelize.transaction.resolves(stubs.transaction);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('insère le commentaire en base de données', async () => {
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);
        await createComment(
            1,
            fakeAction(),
            {
                description: 'description',
                files: [],
            },
        );

        expect(stubs.createCommentModel).to.have.been.calledOnce;
        expect(stubs.createCommentModel).to.have.been.calledOnceWith(1, {
            description: 'description',
            created_by: 1,
        }, stubs.transaction);
    });

    it('en cas d\'échec d\'insertion du commentaire, rollback la transaction', async () => {
        stubs.createCommentModel.rejects(new Error('fake error'));

        try {
            await createComment(1, fakeAction(), { description: 'description', files: [] });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }

        expect(stubs.transaction.rollback).to.have.been.calledOnce;
    });

    it('en cas d\'échec d\'insertion du commentaire, lance un ServiceError avec le code insert_failed', async () => {
        const nativeError = new Error('fake error');
        stubs.createCommentModel.rejects(nativeError);

        let caughtError;
        try {
            await createComment(1, fakeAction(), { description: 'description', files: [] });
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.an.instanceOf(ServiceError);
        expect(caughtError.code).to.be.eql('insert_failed');
        expect(caughtError.nativeError).to.be.eql(nativeError);
    });

    it('enregistre les pièces-jointes', async () => {
        stubs.createCommentModel.resolves(42);
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);
        const files = [fakeFile(), fakeFile()];
        await createComment(
            1,
            fakeAction(),
            {
                description: 'description',
                files,
            },
        );

        expect(stubs.uploadAttachments).to.have.been.calledOnce;
        expect(stubs.uploadAttachments).to.have.been.calledOnceWith('action_comment', 42, 1, files, stubs.transaction);
    });

    it('ne lance pas d\'erreur si aucune pièce-jointe n\'est fournie', async () => {
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);

        let caughtError;
        try {
            await createComment(
                1,
                fakeAction(),
                {
                    description: 'description',
                    files: [],
                },
            );
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.eql(undefined);
        expect(stubs.uploadAttachments).to.not.have.been.called;
    });

    it('en cas d\'échec d\'enregistrement des pièces-jointes, rollback la transaction', async () => {
        stubs.uploadAttachments.rejects(new Error('fake error'));

        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            // ignore
        }

        expect(stubs.transaction.rollback).to.have.been.calledOnce;
    });

    it('en cas d\'échec d\'enregistrement des pièces-jointes, lance un ServiceError avec le code upload_failed', async () => {
        const nativeError = new Error('420');
        stubs.uploadAttachments.rejects(nativeError);

        let caughtError;
        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.an.instanceOf(ServiceError);
        expect(caughtError.code).to.be.eql(nativeError.message);
        expect(caughtError.nativeError).to.be.eql('upload_failed');
    });

    it('commit la transaction une fois toutes les requêtes effectuées', async () => {
        stubs.createCommentModel.resolves(42);
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);
        await createComment(
            1,
            fakeAction(),
            {
                description: 'description',
                files: [],
            },
        );

        expect(stubs.transaction.commit).to.have.been.calledOnce;
        expect(stubs.transaction.commit).to.have.been.calledAfter(stubs.fetchCommentsModel);
    });

    it('en cas d\'échec dans le fetch des commentaires, rollback la transaction', async () => {
        stubs.fetchCommentsModel.rejects(new Error('fake error'));

        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }

        expect(stubs.transaction.rollback).to.have.been.calledOnce;
    });

    it('en cas d\'échec dans le fetch des commentaires, lance un ServiceError avec le code commit_failed', async () => {
        const nativeError = new Error('fake error');
        stubs.fetchCommentsModel.rejects(new Error('fake error'));

        let caughtError;
        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.an.instanceOf(ServiceError);
        expect(caughtError.code).to.be.eql('commit_failed');
        expect(caughtError.nativeError).to.be.eql(nativeError);
    });

    it('en cas d\'échec de commit, rollback la transaction', async () => {
        stubs.transaction.commit.rejects(new Error('fake error'));

        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }

        expect(stubs.transaction.rollback).to.have.been.calledOnce;
    });

    it('en cas d\'échec de commit, lance un ServiceError avec le code commit_failed', async () => {
        const nativeError = new Error('fake error');
        stubs.transaction.commit.rejects(new Error('fake error'));
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);

        let caughtError;
        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.an.instanceOf(ServiceError);
        expect(caughtError.code).to.be.eql('commit_failed');
        expect(caughtError.nativeError).to.be.eql(nativeError);
    });

    it('envoie une notification mattermost', async () => {
        const action = fakeAction();
        const comment = fakeActionComment();
        stubs.serializeComment.returns(comment);
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);

        await createComment(
            1,
            action,
            {
                description: 'description',
                files: [],
            },
        );

        expect(stubs.sendMattermostNotification).to.have.been.calledOnce;
        expect(stubs.sendMattermostNotification).to.have.been.calledOnceWith(
            action,
            comment,
        );
    });

    it('ne lance pas d\'erreur en cas d\'échec d\'envoi de la notification mattermost', async () => {
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);
        stubs.sendMattermostNotification.rejects(new Error('fake error'));

        let caughtError;
        try {
            await createComment(
                1,
                fakeAction(),
                {
                    description: 'description',
                    files: [],
                },
            );
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.eql(undefined);
    });

    it('envoie une notification mail aux personnes concernées', async () => {
        const action = fakeAction();
        const comment = fakeActionComment();
        stubs.serializeComment.returns(comment);
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);

        await createComment(
            1,
            action,
            {
                description: 'description',
                files: [],
            },
        );

        expect(stubs.sendMailNotifications).to.have.been.calledOnce;
        expect(stubs.sendMailNotifications).to.have.been.calledOnceWith(
            action,
            comment,
        );
    });
    it('ne lance pas d\'erreur en cas d\'échec d\'envoi de la notification mail', async () => {
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);
        stubs.sendMailNotifications.rejects(new Error('fake error'));

        let caughtError;
        try {
            await createComment(
                1,
                fakeAction(),
                {
                    description: 'description',
                    files: [],
                },
            );
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.eql(undefined);
    });

    it('retourne le commentaire fraîchement créé', async () => {
        const comment = fakeActionComment();
        stubs.serializeComment.returns(comment);
        stubs.enrichCommentsAttachments.resolves(comment);
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);

        const response = await createComment(
            1,
            fakeAction(),
            {
                description: 'description',
                files: [],
            },
        );

        expect(stubs.enrichCommentsAttachments).to.have.been.calledOnce;
        expect(response).to.be.an('object');
        expect(response).to.have.property('comment');
        expect(response.comment).to.be.eql(comment);
    });

    it('retourne le nombre de personnes notifiées par mail', async () => {
        stubs.fetchCommentsModel.resolves([fakeActionCommentRow()]);
        stubs.sendMailNotifications.resolves(42);

        const response = await createComment(
            1,
            fakeAction(),
            {
                description: 'description',
                files: [],
            },
        );

        expect(response).to.be.an('object');
        expect(response).to.have.property('numberOfObservers');
        expect(response.numberOfObservers).to.be.eql(42);
    });
});
