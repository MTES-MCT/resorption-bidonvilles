import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';
import { rewiremock } from '#test/rewiremock';

import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeQuestion } from '#test/utils/question';
import { serialized as fakeAnswer } from '#test/utils/answer';
import { serialized as serializedAnswer } from '#test/utils/answerSerialized';
import fakeFile from '#test/utils/file';
import { row as fakeQuestionSubscriber } from '#test/utils/questionSubscriber';
import { fail } from 'assert';
import scanAttachmentErrors from '../attachment/scanAttachmentErrors';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

// mock all dependencies
const sandbox = sinon.createSandbox();
const stubs = {
    mails: {
        sendMail: sandbox.stub(),
        sendCommunityNewAnswerForAuthor: sandbox.stub(),
        sendCommunityNewAnswerForObservers: sandbox.stub(),
    },
    sequelize: {
        transaction: sandbox.stub(),
    },
    transaction: {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
    },
    userModel: {
        getQuestionSubscribers: sandbox.stub(),
    },
    answerModel: {
        create: sandbox.stub(),
        findOne: sandbox.stub(),
    },
    userQuestionSubscriptionModel: {
        createSubscription: sandbox.stub(),
    },
    uploadAttachments: sandbox.stub(),
    serializeAttachment: sandbox.stub(),
};

rewiremock('#server/mails/mails').withDefault(stubs.mails);
rewiremock('#server/models/userModel').withDefault(stubs.userModel);
rewiremock('#server/models/answerModel').withDefault(stubs.answerModel);
rewiremock('#server/models/userQuestionSubscriptionModel').withDefault(stubs.userQuestionSubscriptionModel);
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/services/attachment/upload').withDefault(stubs.uploadAttachments);
rewiremock('#server/services/attachment/serializeAttachment').withDefault(stubs.serializeAttachment);
rewiremock('#server/services/attachment/scanAttachmentErrors').with(scanAttachmentErrors);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createAnswer from './createAnswer';
rewiremock.disable();

describe('services/answer.createAnswer()', () => {
    beforeEach(async () => {
        stubs.sequelize.transaction.resolves(stubs.transaction);
    });
    afterEach(() => {
        sandbox.resetHistory();
        sandbox.restore();
    });

    it('insére la réponse en base de données', async () => {
        const answerData = { description: 'Une réponse' };
        const question = fakeQuestion({ id: 1 });
        const author = fakeUser();
        const files = [];

        stubs.answerModel.create.resolves(1);
        stubs.answerModel.findOne.resolves(serializedAnswer);

        await createAnswer(answerData, question, author, files);

        expect(stubs.answerModel.create).to.have.been.calledOnce;
        expect(stubs.answerModel.create).to.have.been.calledWith({
            description: 'Une réponse',
            fk_question: 1,
            created_by: 2,
        }, stubs.transaction);
    });


    it('commit la transaction si l\'insertion de la réponse réussit', async () => {
        stubs.answerModel.findOne.resolves(serializedAnswer);
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), []);
        expect(stubs.transaction.commit).to.have.been.calledOnce;
    });

    it.skip('rollback la transaction si l\'insertion de la réponse échoue', async () => {
        stubs.answerModel.create.rejects(new Error('Une erreur'));
        try {
            await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), []);
        } catch (error) {
            // ignore
        }

        expect(stubs.transaction.commit, 'Le commit() a été appellé').to.not.have.been.called;
        expect(stubs.transaction.rollback, 'Le rollback() n\'a pas été appellé').to.have.been.calledOnce;
    });

    it('lance une exception insert_failed si l\'insertion de la réponse échoue', async () => {
        stubs.answerModel.create.rejects(new Error('Une erreur'));
        try {
            await createAnswer(
                { description: 'Une réponse' },
                fakeQuestion({ id: 1 }),
                fakeUser({ id: 2 }),
                [],
            );
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('insert_failed');
            expect(error.message).to.be.equal('Une erreur');
            return;
        }

        expect.fail('Une exception était attendue');
    });

    it.skip('rollback la transaction si le commit échoue', async () => {
        stubs.transaction.commit.rejects(new Error('Une erreur'));
        try {
            await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), []);
        } catch (error) {
            // ignore
        }

        expect(stubs.transaction.rollback, 'Le rollback() n\'a pas été appellé').to.have.been.calledOnce;
    });

    it('lance une exception commit_failed si le commit de la transaction échoue', async () => {
        stubs.answerModel.create.resolves(1);
        stubs.answerModel.findOne.resolves(serializedAnswer);
        const originalError = new Error('Une erreur');
        stubs.transaction.commit.rejects(originalError);
        try {
            await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), []);
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code, 'Le code de l\'exception est incorrect').to.be.equal('commit_failed');
            expect(error.nativeError, 'L\'erreur native est incorrecte').to.be.equal(originalError);
            return;
        }

        expect.fail('Une exception était attendue');
    });

    it.skip('abonne l\'auteur de la réponse s\'il n\'est pas déjà abonné à la question et retourne cette information', async () => {
        stubs.answerModel.create.resolves(2);
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        stubs.transaction.commit.resolves();
        const response = await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
            [],
        );
        expect(stubs.userQuestionSubscriptionModel.createSubscription).to.have.been.calledOnce;
        expect(stubs.userQuestionSubscriptionModel.createSubscription).to.have.been.calledWith(2, 1);

        expect(response.subscribed).to.be.true;
    });

    it.skip('n\'abonne pas l\'auteur de la réponse si il est déjà abonné à la question et retourne cette information', async () => {
        stubs.answerModel.create.resolves(2);
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        const response = await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            // l'utilisateur n'est plus abonné à la question mais l'a déjà été donc on ne le réabonne pas automatiquement
            fakeUser({ id: 2, question_subscriptions: { 1: false } }),
            [],
        );
        expect(stubs.userQuestionSubscriptionModel.createSubscription).to.not.have.been.called;

        expect(response.subscribed).to.be.false;
    });

    it.skip('ignore une erreur d\'abonnement de l\'auteur de la réponse', async () => {
        stubs.answerModel.create.resolves(2);
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        stubs.userQuestionSubscriptionModel.createSubscription.rejects(new Error('une erreur'));

        try {
            await createAnswer(
                { description: 'Une réponse' },
                fakeQuestion({ id: 1 }),
                fakeUser({ id: 2 }),
                [],
            );
        } catch (error) {
            fail('Une exception a été lancée');
        }
    });

    it.skip('envoie une notification mail spéciale à l\'auteur de la question', async () => {
        const subscriber = fakeQuestionSubscriber({ user_id: 1, is_author: true });
        const answerAuthor = fakeUser({ id: 2 });
        stubs.answerModel.create.resolves(2);
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        stubs.userModel.getQuestionSubscribers.withArgs(1).resolves([subscriber]);
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            answerAuthor,
            [],
        );
        expect(stubs.mails.sendCommunityNewAnswerForAuthor).to.have.been.calledOnce;

        const { args } = stubs.mails.sendCommunityNewAnswerForAuthor.getCall(0);
        expect(args[0]).to.be.eql(subscriber);
        expect(args[1]).to.be.eql({
            preserveRecipient: false,
            variables: {
                questionId: 1,
                author: answerAuthor,
            },
        });
    });

    it.skip('envoie une notification mail générique aux abonnés à la question', async () => {
        const subscribers = [
            fakeQuestionSubscriber({ user_id: 2, is_author: false }),
            fakeQuestionSubscriber({ user_id: 3, is_author: false }),
            fakeQuestionSubscriber({ user_id: 4, is_author: false }),
        ];
        const answerAuthor = fakeUser({ id: 5 });
        stubs.answerModel.create.resolves(2);
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        stubs.userModel.getQuestionSubscribers.withArgs(1).resolves(subscribers);
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1, question: 'Une question' }),
            answerAuthor,
            [],
        );
        expect(stubs.mails.sendCommunityNewAnswerForObservers).to.have.callCount(3);

        const { args } = stubs.mails.sendCommunityNewAnswerForObservers.getCall(0);
        expect(args[0]).to.be.eql(subscribers[0]);
        expect(args[1]).to.be.eql({
            preserveRecipient: false,
            variables: {
                questionId: 1,
                question: 'Une question',
                author: answerAuthor,
            },
        });
    });

    it.skip('n\'envoie pas de notification mail à l\'auteur de la réponse', async () => {
        const subscriber = fakeQuestionSubscriber({ user_id: 2 });
        stubs.answerModel.create.resolves(2);
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        stubs.userModel.getQuestionSubscribers.withArgs(1).resolves([subscriber]);
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
            [],
        );
        expect(stubs.mails.sendCommunityNewAnswerForAuthor).to.not.have.been.called;
        expect(stubs.mails.sendCommunityNewAnswerForObservers).to.not.have.been.called;
    });

    it.skip('ignore une erreur d\'envoi de notifications mail', async () => {
        const subscriber = fakeQuestionSubscriber({ user_id: 1, is_author: true });
        const answerAuthor = fakeUser({ id: 2 });
        stubs.answerModel.create.resolves(2);
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        stubs.userModel.getQuestionSubscribers.withArgs(1).resolves([subscriber]);
        stubs.mails.sendCommunityNewAnswerForAuthor.rejects(new Error('Une erreur'));

        try {
            await createAnswer(
                { description: 'Une réponse' },
                fakeQuestion({ id: 1 }),
                answerAuthor,
                [],
            );
        } catch (error) {
            fail('Une exception a été lancée');
        }
    });

    it.skip('retourne la réponse nouvelle créée', async () => {
        const answer = fakeAnswer({ id: 2 });
        stubs.answerModel.create.resolves(2);
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        stubs.answerModel.findOne.withArgs(2).resolves(answer);
        const response = await createAnswer(
            { description: answer.description },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
            [],
        );
        expect(response.answer).to.be.eql(answer);
    });

    it.skip('lance une exception fetch_failed si la récupération de la réponse échoue', async () => {
        stubs.answerModel.create.resolves(2);
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        stubs.answerModel.findOne.rejects(new Error('Une erreur'));

        try {
            await createAnswer(
                { description: 'Une description' },
                fakeQuestion({ id: 1 }),
                fakeUser({ id: 2 }),
                [],
            );
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('fetch_failed');
            expect(error.message).to.be.equal('Une erreur');
            return;
        }

        expect.fail('Une exception était attendue');
    });

    it.skip('fait appel au service d\'upload', async () => {
        const files = [fakeFile()];
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(stubs.uploadAttachments).to.have.been.calledOnce;
    });

    it.skip('enregistre chaque fichier en tant que pièce-jointe d\'une réponse', async () => {
        const files = [fakeFile()];
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(stubs.uploadAttachments.getCall(0).args[0]).to.be.eql('answer');
    });

    it.skip('enregistre chaque fichier avec le bon identifiant de réponse', async () => {
        const answerId = 42;
        stubs.answerModel.create.resolves(answerId);

        const files = [fakeFile()];
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(stubs.uploadAttachments.getCall(0).args[1]).to.be.eql(42);
    });

    it.skip('enregistre chaque fichier avec le bon identifiant utilisateur', async () => {
        const files = [fakeFile()];
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser({ id: 42 }), files);
        expect(stubs.uploadAttachments.getCall(0).args[2]).to.be.eql(42);
    });

    it.skip('passe bien la liste de tous les fichiers au service d\'upload', async () => {
        const files = [fakeFile(), fakeFile(), fakeFile()];
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(stubs.uploadAttachments.getCall(0).args[3]).to.be.eql(files);
    });

    it.skip('enregistre chaque fichier avec la bonne transaction', async () => {
        const files = [fakeFile()];
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(stubs.uploadAttachments.getCall(0).args[4]).to.be.eql(stubs.transaction);
    });

    it.skip('n\'appelle pas le service d\'upload si aucun fichier n\'est fourni', async () => {
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), []);
        expect(stubs.uploadAttachments).to.not.have.been.called;
    });

    it.skip('ne commit l\'enregistrement de la réponse qu\'une fois les fichiers uploadés', async () => {
        const files = [fakeFile()];
        stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(stubs.transaction.commit).to.have.been.calledAfter(stubs.uploadAttachments);
    });

    it.skip('fait un rollback si l\'upload des fichiers échoue', async () => {
        const files = [fakeFile()];
        stubs.uploadAttachments.rejects(new Error('une erreur'));
        try {
            stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
            await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        } catch (error) {
            // ignore
        }

        expect(stubs.transaction.commit, 'Le commit() de la transaction a été appelé').to.not.have.been.called;
        expect(stubs.transaction.rollback).to.have.been.calledOnce;
    });

    it.skip('lance une exception upload_failed si l\'upload des fichiers échoue', async () => {
        const files = [fakeFile()];
        const originalError = new Error('420');
        stubs.uploadAttachments.rejects(originalError);

        try {
            stubs.answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
            await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        } catch (error) {
            expect(error).to.be.an.instanceof(ServiceError);
            expect(error.code).to.be.eql(originalError.message);
            expect(error.nativeError).to.be.eql('upload_failed');
            return;
        }

        expect.fail('Une exception aurait dû être lancée');
    });
});
