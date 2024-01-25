import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';
import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeQuestion } from '#test/utils/question';
import { serialized as fakeAnswer } from '#test/utils/answer';
import { serialized as fakeUser } from '#test/utils/user';

// import ServiceError from '#server/errors/ServiceError';
// import { serialized as fakeUser } from '#test/utils/user';
// import { serialized as fakeQuestion } from '#test/utils/question';
// import { serialized as fakeAnswer } from '#test/utils/answer';
// import fakeFile from '#test/utils/file';
// import { row as fakeQuestionSubscriber } from '#test/utils/questionSubscriber';
// import { fail } from 'assert';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

// mock all dependencies
const sandbox = sinon.createSandbox();
const deleteAnswerModel = sandbox.stub();
const mails = {
    sendAnswerDeletionNotification: sandbox.stub(),
};
const getNationalAdmins = sandbox.stub();
rewiremock.passBy('.*server/utils/date.*');
// const mails = {
//     sendCommunityNewAnswerForAuthor: sandbox.stub(),
//     sendCommunityNewAnswerForObservers: sandbox.stub(),
// };
// const userModel = {
//     getQuestionSubscribers: sandbox.stub(),
// };
// const answerModel = {
//     create: sandbox.stub(),
//     findOne: sandbox.stub(),
// };
// const userQuestionSubscriptionModel = {
//     createSubscription: sandbox.stub(),
// };
// const attachmentService = {
//     upload: sandbox.stub(),
// };
// const sequelize = {
//     sequelize: {
//         transaction: sandbox.stub(),
//     },
// };
// const transaction = {
//     commit: sandbox.stub(),
//     rollback: sandbox.stub(),
// };
rewiremock('#server/models/answerModel/delete').with(deleteAnswerModel);
rewiremock('#server/models/userModel/_common/getNationalAdmins').with(getNationalAdmins);
rewiremock('#server/mails/mails').with(mails);
// rewiremock('#server/models/userModel').withDefault(userModel);
// rewiremock('#server/models/answerModel').withDefault(answerModel);
// rewiremock('#server/models/userQuestionSubscriptionModel').withDefault(userQuestionSubscriptionModel);
// rewiremock('#server/services/attachment').withDefault(attachmentService);
// rewiremock('#db/sequelize').with(sequelize);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deleteAnswer from './deleteAnswer';
rewiremock.disable();

describe('services/answer.deleteAnswer()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('supprime la réponse de la base de données', async () => {
        await deleteAnswer(fakeQuestion(), fakeAnswer({ id: 1 }));
        expect(deleteAnswerModel).to.have.been.calledOnce;
        expect(deleteAnswerModel).to.have.been.calledOnceWithExactly(1);
    });

    it('en cas d\'erreur de suppression, lance un ServiceError avec le code delete_failed', async () => {
        const originalError = new Error('original error');
        deleteAnswerModel.rejects(originalError);

        let caughtError;
        try {
            await deleteAnswer(fakeQuestion(), fakeAnswer());
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.an.instanceOf(ServiceError);
        expect(caughtError.code).to.equal('delete_failed');
        expect(caughtError.nativeError).to.equal(originalError);
    });

    it('si une raison est fournie, envoie un mail à l\'auteur de la question', async () => {
        const author = {
            id: 1,
            email: 'jean.dupont@gouv.fr',
            first_name: 'Jean',
            last_name: 'Dupont',
            role: 'collaborator',
            position: 'Test',
            organization: 'DIHAL',
            organization_id: 1,
        };
        await deleteAnswer(fakeQuestion(), fakeAnswer({ createdBy: author }), 'une raison');

        expect(mails.sendAnswerDeletionNotification).to.have.been.calledOnce;
        expect(mails.sendAnswerDeletionNotification.getCalls()[0].args[0]).to.deep.equal(author);
    });

    it('le mail d\'alerte est envoyé avec toutes les informations nécessaires (question et réponses concernées, etc.)', async () => {
        await deleteAnswer(
            fakeQuestion({ question: 'une question' }),
            fakeAnswer({
                description: 'une réponse',
                createdAt: new Date('2020-01-01').getTime() / 1000,
            }),
            'une raison',
        );

        expect(mails.sendAnswerDeletionNotification).to.have.been.calledOnce;
        expect(mails.sendAnswerDeletionNotification.getCalls()[0].args[1]).to.containSubset({
            variables: {
                message: 'une réponse',
                created_at: '01 Janvier 2020',
                question: 'une question',
                reason: 'une raison',
            },
        });
    });

    it('le mail d\'alerte est envoyé en copie cachée à tous les administrateurs nationaux', async () => {
        const admins = [fakeUser(), fakeUser()];
        getNationalAdmins.resolves(admins);
        await deleteAnswer(fakeQuestion(), fakeAnswer(), 'une raison');

        expect(mails.sendAnswerDeletionNotification).to.have.been.calledOnce;
        expect(mails.sendAnswerDeletionNotification.getCalls()[0].args[1]).to.containSubset({
            bcc: admins,
        });
    });

    it('si la liste des administrateurs nationaux ne peut pas être récupérée, envoie tout de même le mail', async () => {
        getNationalAdmins.rejects(new Error('original error'));
        await deleteAnswer(fakeQuestion(), fakeAnswer(), 'une raison');

        expect(mails.sendAnswerDeletionNotification).to.have.been.calledOnce;
    });

    it('si aucune raison n\'est fournie, n\'envoie pas de mail', async () => {
        await deleteAnswer(fakeQuestion(), fakeAnswer());
        expect(mails.sendAnswerDeletionNotification).to.not.have.been.called;
    });

    it('ignore les échecs d\'envoi de mail', async () => {
        mails.sendAnswerDeletionNotification.rejects(new Error('original error'));

        let caughtError;
        try {
            await deleteAnswer(fakeQuestion(), fakeAnswer(), 'une raison');
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.undefined;
    });
});
