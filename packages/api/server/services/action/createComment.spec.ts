import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeAction } from '#test/utils/action';
import { serialized as fakeActionComment, row as fakeActionCommentRow } from '#test/utils/actionComment';
import fakeFile from '#test/utils/file';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

// stubs
const sandbox = sinon.createSandbox();
const sequelize = {
    transaction: sandbox.stub(),
};
const transaction = {
    commit: sandbox.stub(),
    rollback: sandbox.stub(),
};
const createCommentModel = sandbox.stub();
const fetchCommentsModel = sandbox.stub();
const uploadAttachments = sandbox.stub();
const serializeComment = sandbox.stub();
const sendMattermostNotification = sandbox.stub();
const sendMailNotifications = sandbox.stub();
const enrichCommentsAttachments = sandbox.stub();
const scanAttachmentErrors = sandbox.stub();

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/models/actionModel/createComment/createComment').with(createCommentModel);
rewiremock('#server/models/actionModel/fetchComments/fetchComments').with(fetchCommentsModel);
rewiremock('#server/models/actionModel/fetchComments/serializeComment').with(serializeComment);
rewiremock('#server/services/attachment/upload').with(uploadAttachments);
rewiremock('./createComment.sendMattermostNotification').with(sendMattermostNotification);
rewiremock('./createComment.sendMailNotifications').with(sendMailNotifications);
rewiremock('./enrichCommentsAttachments').with(enrichCommentsAttachments);
rewiremock('#server/services/attachment/scanAttachmentErrors').with(scanAttachmentErrors);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createComment from './createComment';
rewiremock.disable();

describe('services/action.createComment()', () => {
    beforeEach(() => {
        sequelize.transaction.resolves(transaction);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('insère le commentaire en base de données', async () => {
        fetchCommentsModel.resolves([fakeActionCommentRow()]);
        await createComment(
            1,
            fakeAction(),
            {
                description: 'description',
                files: [],
            },
        );

        expect(createCommentModel).to.have.been.calledOnce;
        expect(createCommentModel).to.have.been.calledOnceWith(1, {
            description: 'description',
            created_by: 1,
        }, transaction);
    });

    it('en cas d\'échec d\'insertion du commentaire, rollback la transaction', async () => {
        createCommentModel.rejects(new Error('fake error'));

        try {
            await createComment(1, fakeAction(), { description: 'description', files: [] });
        } catch (e) {
            // ignore
        }

        expect(transaction.rollback).to.have.been.calledOnce;
    });

    it('en cas d\'échec d\'insertion du commentaire, lance un ServiceError avec le code insert_failed', async () => {
        const nativeError = new Error('fake error');
        createCommentModel.rejects(nativeError);

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
        createCommentModel.resolves(42);
        fetchCommentsModel.resolves([fakeActionCommentRow()]);
        const files = [fakeFile(), fakeFile()];
        await createComment(
            1,
            fakeAction(),
            {
                description: 'description',
                files,
            },
        );

        expect(uploadAttachments).to.have.been.calledOnce;
        expect(uploadAttachments).to.have.been.calledOnceWith('action_comment', 42, 1, files, transaction);
    });

    it('ne lance pas d\'erreur si aucune pièce-jointe n\'est fournie', async () => {
        fetchCommentsModel.resolves([fakeActionCommentRow()]);

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
        expect(uploadAttachments).to.not.have.been.called;
    });

    it('en cas d\'échec d\'enregistrement des pièces-jointes, rollback la transaction', async () => {
        uploadAttachments.rejects(new Error('fake error'));

        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (e) {
            // ignore
        }

        expect(transaction.rollback).to.have.been.calledOnce;
    });

    it.skip('en cas d\'échec d\'enregistrement des pièces-jointes, lance un ServiceError avec le code upload_failed', async () => {
        const nativeError = new Error('fake error');
        uploadAttachments.rejects(new Error('fake error'));

        let caughtError;
        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (error) {
            caughtError = error;
        }
        console.log('Caught error:', caughtError);

        expect(caughtError).to.be.an.instanceOf(ServiceError);
        expect(caughtError.code).to.be.eql('upload_failed');
        expect(caughtError.nativeError).to.be.eql(nativeError);
    });

    it('commit la transaction une fois toutes les requêtes effectuées', async () => {
        createCommentModel.resolves(42);
        fetchCommentsModel.resolves([fakeActionCommentRow()]);
        await createComment(
            1,
            fakeAction(),
            {
                description: 'description',
                files: [],
            },
        );

        expect(transaction.commit).to.have.been.calledOnce;
        expect(transaction.commit).to.have.been.calledAfter(fetchCommentsModel);
    });

    it('en cas d\'échec dans le fetch des commentaires, rollback la transaction', async () => {
        fetchCommentsModel.rejects(new Error('fake error'));

        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (e) {
            // ignore
        }

        expect(transaction.rollback).to.have.been.calledOnce;
    });

    it('en cas d\'échec dans le fetch des commentaires, lance un ServiceError avec le code commit_failed', async () => {
        const nativeError = new Error('fake error');
        fetchCommentsModel.rejects(new Error('fake error'));

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
        transaction.commit.rejects(new Error('fake error'));

        try {
            await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
        } catch (e) {
            // ignore
        }

        expect(transaction.rollback).to.have.been.calledOnce;
    });

    it('en cas d\'échec de commit, lance un ServiceError avec le code commit_failed', async () => {
        const nativeError = new Error('fake error');
        transaction.commit.rejects(new Error('fake error'));
        fetchCommentsModel.resolves([fakeActionCommentRow()]);

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
        serializeComment.returns(comment);
        fetchCommentsModel.resolves([fakeActionCommentRow()]);

        await createComment(
            1,
            action,
            {
                description: 'description',
                files: [],
            },
        );

        expect(sendMattermostNotification).to.have.been.calledOnce;
        expect(sendMattermostNotification).to.have.been.calledOnceWith(
            action,
            comment,
        );
    });

    it('ne lance pas d\'erreur en cas d\'échec d\'envoi de la notification mattermost', async () => {
        fetchCommentsModel.resolves([fakeActionCommentRow()]);
        sendMattermostNotification.rejects(new Error('fake error'));

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
        serializeComment.returns(comment);
        fetchCommentsModel.resolves([fakeActionCommentRow()]);

        await createComment(
            1,
            action,
            {
                description: 'description',
                files: [],
            },
        );

        expect(sendMailNotifications).to.have.been.calledOnce;
        expect(sendMailNotifications).to.have.been.calledOnceWith(
            action,
            comment,
        );
    });
    it('ne lance pas d\'erreur en cas d\'échec d\'envoi de la notification mail', async () => {
        fetchCommentsModel.resolves([fakeActionCommentRow()]);
        sendMailNotifications.rejects(new Error('fake error'));

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
        serializeComment.returns(comment);
        enrichCommentsAttachments.resolves(comment);
        fetchCommentsModel.resolves([fakeActionCommentRow()]);

        const response = await createComment(
            1,
            fakeAction(),
            {
                description: 'description',
                files: [],
            },
        );

        expect(enrichCommentsAttachments).to.have.been.calledOnce;
        expect(response).to.be.an('object');
        expect(response).to.have.property('comment');
        expect(response.comment).to.be.eql(comment);
    });

    it('retourne le nombre de personnes notifiées par mail', async () => {
        fetchCommentsModel.resolves([fakeActionCommentRow()]);
        sendMailNotifications.resolves(42);

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
