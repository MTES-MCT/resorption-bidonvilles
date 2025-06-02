/*
Tests à effectuer:
- Vérifier que la suppression d'un commentaire fonctionne correctement.
- Vérifier que la suppression d'un commentaire sans message de suppression renvoie une erreur.
- Vérifier que la suppression d'un commentaire par un utilisateur non propriétaire envoie un email de notification.
- Vérifier que la suppression d'un commentaire par un utilisateur propriétaire ne nécessite pas de message de suppression.
- Vérifier que la suppression d'un commentaire par un utilisateur sans permission renvoie une erreur de permission.
*/

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';

import validator from 'validator';
import actionModel from '#server/models/actionModel';
import userModel from '#server/models/userModel';
import mails from '#server/mails/mails';
import permissionUtils from '#server/utils/permission';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import { serialized as fakeActionComment, row as fakeActionCommentRow } from '#test/utils/actionComment';
import ServiceError from '#server/errors/ServiceError';
import deleteActionComment from './deleteComment';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

// stubs
const sandbox = sinon.createSandbox();
// const sequelize = {
//     transaction: sandbox.stub(),
// };
// const transaction = {
//     commit: sandbox.stub(),
//     rollback: sandbox.stub(),
// };
const deleteComment = sandbox.stub();

// const fetchCommentsModel = sandbox.stub();
// // const uploadAttachments = sandbox.stub();
// const serializeComment = sandbox.stub();
// const sendMattermostNotification = sandbox.stub();
// const sendMailNotifications = sandbox.stub();
// const enrichCommentsAttachments = sandbox.stub();
// const scanAttachmentErrors = sandbox.stub();

// rewiremock('#db/sequelize').with({ sequelize });
// rewiremock('#server/models/actionModel/deleteComment/deleteComment').with(deleteCommentModel);
// rewiremock('#server/models/actionModel/fetchComments/fetchComments').with(fetchCommentsModel); // balek
// rewiremock('#server/models/actionModel/fetchComments/serializeComment').with(serializeComment); // balek
// rewiremock('#server/services/attachment/upload').with(uploadAttachments); // balek
// rewiremock('./createComment.sendMattermostNotification').with(sendMattermostNotification); // balek
// rewiremock('./createComment.sendMailNotifications').with(sendMailNotifications);
// rewiremock('./enrichCommentsAttachments').with(enrichCommentsAttachments); // balek
// rewiremock('#server/services/attachment/scanAttachmentErrors').with(scanAttachmentErrors); // balek
// import validator from 'validator';
// import actionModel from '#server/models/actionModel';
// import userModel from '#server/models/userModel';
// import mails from '#server/mails/mails';
// import permissionUtils from '#server/utils/permission';
// import dateUtils from '#server/utils/date';
// import ServiceError from '#server/errors/ServiceError';
// import { Location } from '#server/models/geoModel/Location.d';
// rewiremock('#server/models/actionModel').with(actionModel);
// rewiremock('#server/models/userModel').with(userModel);
// rewiremock('#server/mails/mails').with(mails);
// rewiremock('#server/utils/permission').with(permissionUtils);
// rewiremock('#server/utils/date').with(dateUtils);
// rewiremock('#server/errors/ServiceError').with(ServiceError);
// rewiremock('#server/models/geoModel/Location').with({ Location });
rewiremock('#server/models/actionModel/deleteComment/deleteComment').with(deleteComment);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
// import deleteActionComment from './deleteComment';
rewiremock.disable();

describe('services/action.deleteComment()', () => {
    // beforeEach(() => {
    //     sequelize.transaction.resolves(transaction);
    // });
    let stubs;
    const user = { id: 0 };
    const author = { id: 1 };
    const shantytownId = 0;
    const commentId = 0;
    const comment = fakeActionComment;
    const deletionMessage = 'deletionMessage';
    const town = {
        region: null,
        departement: null,
        epci: null,
        city: 0,
        comments: [comment],
    };
    beforeEach(() => {
        stubs = {
            actionModelfetch: sinon.stub(actionModel, 'fetch'),
            userModelFindOne: sinon.stub(userModel, 'findOne'),
            userModelGetNationalAdmins: sinon.stub(userModel, 'getNationalAdmins'),
            can: sinon.stub(permissionUtils, 'can'),
            do: sinon.stub(),
            on: sinon.stub(),
            trim: sinon.stub(validator, 'trim'),
            sendUserCommentDeletion: sinon.stub(mails, 'sendUserCommentDeletion'),
        };
        stubs.can.returns({
            do: stubs.do,
        });
        stubs.do.returns({
            on: stubs.on,
        });

        stubs.shantytownModelfindOne.resolves(town);
        stubs.userModelFindOne.resolves(author);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('supprime le commentaire en base de données', async () => {
        // fetchCommentsModel.resolves([fakeActionCommentRow()]);
        console.log('req.user:', 1, 'comment ID:', fakeAction());
        const action = fakeAction();
        // console.log(fakeActionComment());

        // req.user, req.params.id, req.params.commentId, req.body.message
        await deleteActionComment(
            1,
            action.id,
            action.comments[0].id,
            'message de suppression',
        );

        // expect(createCommentModel).to.have.been.calledOnce;
        // expect(createCommentModel).to.have.been.calledOnceWith(1, {
        //     description: 'description',
        //     created_by: 1,
        // }, transaction);
        expect(deleteComment).to.have.been.calledOnceWith(1, 1, 1, 'message de suppression');
    });

    // it('en cas d\'échec d\'insertion du commentaire, rollback la transaction', async () => {
    //     createCommentModel.rejects(new Error('fake error'));

    //     try {
    //         await createComment(1, fakeAction(), { description: 'description', files: [] });
    //     } catch (e) {
    //         // ignore
    //     }

    //     expect(transaction.rollback).to.have.been.calledOnce;
    // });

    // it('en cas d\'échec d\'insertion du commentaire, lance un ServiceError avec le code insert_failed', async () => {
    //     const nativeError = new Error('fake error');
    //     createCommentModel.rejects(nativeError);

    //     let caughtError;
    //     try {
    //         await createComment(1, fakeAction(), { description: 'description', files: [] });
    //     } catch (error) {
    //         caughtError = error;
    //     }

    //     expect(caughtError).to.be.an.instanceOf(ServiceError);
    //     expect(caughtError.code).to.be.eql('insert_failed');
    //     expect(caughtError.nativeError).to.be.eql(nativeError);
    // });

    // it('enregistre les pièces-jointes', async () => {
    //     createCommentModel.resolves(42);
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);
    //     const files = [fakeFile(), fakeFile()];
    //     await createComment(
    //         1,
    //         fakeAction(),
    //         {
    //             description: 'description',
    //             files,
    //         },
    //     );

    //     expect(uploadAttachments).to.have.been.calledOnce;
    //     expect(uploadAttachments).to.have.been.calledOnceWith('action_comment', 42, 1, files, transaction);
    // });

    // it('ne lance pas d\'erreur si aucune pièce-jointe n\'est fournie', async () => {
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);

    //     let caughtError;
    //     try {
    //         await createComment(
    //             1,
    //             fakeAction(),
    //             {
    //                 description: 'description',
    //                 files: [],
    //             },
    //         );
    //     } catch (error) {
    //         caughtError = error;
    //     }

    //     expect(caughtError).to.be.eql(undefined);
    //     expect(uploadAttachments).to.not.have.been.called;
    // });

    // it('en cas d\'échec d\'enregistrement des pièces-jointes, rollback la transaction', async () => {
    //     uploadAttachments.rejects(new Error('fake error'));

    //     try {
    //         await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
    //     } catch (e) {
    //         // ignore
    //     }

    //     expect(transaction.rollback).to.have.been.calledOnce;
    // });

    // it('en cas d\'échec d\'enregistrement des pièces-jointes, lance un ServiceError avec le code upload_failed', async () => {
    //     const nativeError = new Error('fake error');
    //     uploadAttachments.rejects(new Error('fake error'));

    //     let caughtError;
    //     try {
    //         await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
    //     } catch (error) {
    //         caughtError = error;
    //     }

    //     expect(caughtError).to.be.an.instanceOf(ServiceError);
    //     expect(caughtError.code).to.be.eql('upload_failed');
    //     expect(caughtError.nativeError).to.be.eql(nativeError);
    // });

    // it('commit la transaction une fois toutes les requêtes effectuées', async () => {
    //     createCommentModel.resolves(42);
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);
    //     await createComment(
    //         1,
    //         fakeAction(),
    //         {
    //             description: 'description',
    //             files: [],
    //         },
    //     );

    //     expect(transaction.commit).to.have.been.calledOnce;
    //     expect(transaction.commit).to.have.been.calledAfter(fetchCommentsModel);
    // });

    // it('en cas d\'échec dans le fetch des commentaires, rollback la transaction', async () => {
    //     fetchCommentsModel.rejects(new Error('fake error'));

    //     try {
    //         await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
    //     } catch (e) {
    //         // ignore
    //     }

    //     expect(transaction.rollback).to.have.been.calledOnce;
    // });

    // it('en cas d\'échec dans le fetch des commentaires, lance un ServiceError avec le code commit_failed', async () => {
    //     const nativeError = new Error('fake error');
    //     fetchCommentsModel.rejects(new Error('fake error'));

    //     let caughtError;
    //     try {
    //         await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
    //     } catch (error) {
    //         caughtError = error;
    //     }

    //     expect(caughtError).to.be.an.instanceOf(ServiceError);
    //     expect(caughtError.code).to.be.eql('commit_failed');
    //     expect(caughtError.nativeError).to.be.eql(nativeError);
    // });

    // it('en cas d\'échec de commit, rollback la transaction', async () => {
    //     transaction.commit.rejects(new Error('fake error'));

    //     try {
    //         await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
    //     } catch (e) {
    //         // ignore
    //     }

    //     expect(transaction.rollback).to.have.been.calledOnce;
    // });

    // it('en cas d\'échec de commit, lance un ServiceError avec le code commit_failed', async () => {
    //     const nativeError = new Error('fake error');
    //     transaction.commit.rejects(new Error('fake error'));
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);

    //     let caughtError;
    //     try {
    //         await createComment(1, fakeAction(), { description: 'description', files: [fakeFile()] });
    //     } catch (error) {
    //         caughtError = error;
    //     }

    //     expect(caughtError).to.be.an.instanceOf(ServiceError);
    //     expect(caughtError.code).to.be.eql('commit_failed');
    //     expect(caughtError.nativeError).to.be.eql(nativeError);
    // });

    // it('envoie une notification mattermost', async () => {
    //     const action = fakeAction();
    //     const comment = fakeActionComment();
    //     serializeComment.returns(comment);
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);

    //     await createComment(
    //         1,
    //         action,
    //         {
    //             description: 'description',
    //             files: [],
    //         },
    //     );

    //     expect(sendMattermostNotification).to.have.been.calledOnce;
    //     expect(sendMattermostNotification).to.have.been.calledOnceWith(
    //         action,
    //         comment,
    //     );
    // });

    // it('ne lance pas d\'erreur en cas d\'échec d\'envoi de la notification mattermost', async () => {
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);
    //     sendMattermostNotification.rejects(new Error('fake error'));

    //     let caughtError;
    //     try {
    //         await createComment(
    //             1,
    //             fakeAction(),
    //             {
    //                 description: 'description',
    //                 files: [],
    //             },
    //         );
    //     } catch (error) {
    //         caughtError = error;
    //     }

    //     expect(caughtError).to.be.eql(undefined);
    // });

    // it('envoie une notification mail aux personnes concernées', async () => {
    //     const action = fakeAction();
    //     const comment = fakeActionComment();
    //     serializeComment.returns(comment);
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);

    //     await createComment(
    //         1,
    //         action,
    //         {
    //             description: 'description',
    //             files: [],
    //         },
    //     );

    //     expect(sendMailNotifications).to.have.been.calledOnce;
    //     expect(sendMailNotifications).to.have.been.calledOnceWith(
    //         action,
    //         comment,
    //     );
    // });
    // it('ne lance pas d\'erreur en cas d\'échec d\'envoi de la notification mail', async () => {
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);
    //     sendMailNotifications.rejects(new Error('fake error'));

    //     let caughtError;
    //     try {
    //         await createComment(
    //             1,
    //             fakeAction(),
    //             {
    //                 description: 'description',
    //                 files: [],
    //             },
    //         );
    //     } catch (error) {
    //         caughtError = error;
    //     }

    //     expect(caughtError).to.be.eql(undefined);
    // });

    // it('retourne le commentaire fraîchement créé', async () => {
    //     const comment = fakeActionComment();
    //     serializeComment.returns(comment);
    //     enrichCommentsAttachments.resolves(comment);
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);

    //     const response = await createComment(
    //         1,
    //         fakeAction(),
    //         {
    //             description: 'description',
    //             files: [],
    //         },
    //     );

    //     expect(enrichCommentsAttachments).to.have.been.calledOnce;
    //     expect(response).to.be.an('object');
    //     expect(response).to.have.property('comment');
    //     expect(response.comment).to.be.eql(comment);
    // });

    // it('retourne le nombre de personnes notifiées par mail', async () => {
    //     fetchCommentsModel.resolves([fakeActionCommentRow()]);
    //     sendMailNotifications.resolves(42);

    //     const response = await createComment(
    //         1,
    //         fakeAction(),
    //         {
    //             description: 'description',
    //             files: [],
    //         },
    //     );

    //     expect(response).to.be.an('object');
    //     expect(response).to.have.property('numberOfObservers');
    //     expect(response.numberOfObservers).to.be.eql(42);
    // });
});
