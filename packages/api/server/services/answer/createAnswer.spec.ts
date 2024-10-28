import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeQuestion } from '#test/utils/question';
import { serialized as fakeAnswer } from '#test/utils/answer';
import { serialized as serializedAnswer } from '#test/utils/answerSerialized';
import { fakeFile } from '#test/utils/file';
import { row as fakeQuestionSubscriber } from '#test/utils/questionSubscriber';
import { fail } from 'assert';
import createAnswer from './createAnswer';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();
const mails = {
    sendMail: sinon.stub(),
    sendCommunityNewAnswerForAuthor: sandbox.stub(),
    sendCommunityNewAnswerForObservers: sandbox.stub(),
};
const sequelize = {
    transaction: sandbox.stub(),
};
const transaction = {
    commit: sandbox.stub(),
    rollback: sandbox.stub(),
};
const userModel = {
    getQuestionSubscribers: sandbox.stub(),
};
const answerModel = {
    create: sandbox.stub(),
    findOne: sandbox.stub(),
};
const userQuestionSubscriptionModel = {
    createSubscription: sandbox.stub(),
};
const uploadAttachments = sandbox.stub();
const serializeAttachment = sandbox.stub();

rewiremock('#server/mails/mails').withDefault(mails);
rewiremock('#server/models/userModel').withDefault(userModel);
rewiremock('#server/models/answerModel').withDefault(answerModel);
rewiremock('#server/models/userQuestionSubscriptionModel').withDefault(userQuestionSubscriptionModel);
rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/services/attachment/upload').withDefault(uploadAttachments);
rewiremock('#server/services/attachment/serializeAttachment').withDefault(serializeAttachment);
<<<<<<< HEAD
=======
rewiremock.enable();
rewiremock.disable();
>>>>>>> 8e3c3db72 (fix: Corriger les erreurs relevées par eslint)

describe('services/answer.createAnswer()', () => {
    beforeEach(async () => {
        sequelize.transaction.resolves(transaction);
    });
    afterEach(() => {
        sandbox.reset();
    });

    it('insére la réponse en base de données', async () => {
        const answerData = { description: 'Une réponse' };
        const question = fakeQuestion({ id: 1 });
        const author = fakeUser();
        const files = [];

        answerModel.create.resolves(1);
        answerModel.findOne.resolves(serializedAnswer);

        await createAnswer(answerData, question, author, files);

        expect(answerModel.create).to.have.been.calledOnce;
        expect(answerModel.create).to.have.been.calledWith({
            description: 'Une réponse',
            fk_question: 1,
            created_by: 2,
        }, transaction);
    });


    it('commit la transaction si l\'insertion de la réponse réussit', async () => {
        answerModel.findOne.resolves(serializedAnswer);
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), []);
        expect(transaction.commit).to.have.been.calledOnce;
    });

    it('rollback la transaction si l\'insertion de la réponse échoue', async () => {
        answerModel.create.rejects(new Error('Une erreur'));
        try {
            await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), []);
        } catch (error) {
            // ignore
        }

        expect(transaction.commit, 'Le commit() a été appellé').to.not.have.been.called;
        expect(transaction.rollback, 'Le rollback() n\'a pas été appellé').to.have.been.calledOnce;
    });

    it('lance une exception insert_failed si l\'insertion de la réponse échoue', async () => {
        answerModel.create.rejects(new Error('Une erreur'));
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

    it('rollback la transaction si le commit échoue', async () => {
        transaction.commit.rejects(new Error('Une erreur'));
        try {
            await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), []);
        } catch (error) {
            // ignore
        }

        expect(transaction.rollback, 'Le rollback() n\'a pas été appellé').to.have.been.calledOnce;
    });

    it('lance une exception commit_failed si le commit de la transaction échoue', async () => {
        answerModel.findOne.resolves(serializedAnswer);
        const originalError = new Error('Une erreur');
        transaction.commit.rejects(originalError);
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

    it('abonne l\'auteur de la réponse s\'il n\'est pas déjà abonné à la question et retourne cette information', async () => {
        answerModel.create.resolves(2);
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        const response = await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
            [],
        );
        expect(userQuestionSubscriptionModel.createSubscription).to.have.been.calledOnce;
        expect(userQuestionSubscriptionModel.createSubscription).to.have.been.calledWith(2, 1);

        expect(response.subscribed).to.be.true;
    });

    it('n\'abonne pas l\'auteur de la réponse si il est déjà abonné à la question et retourne cette information', async () => {
        answerModel.create.resolves(2);
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        const response = await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            // l'utilisateur n'est plus abonné à la question mais l'a déjà été donc on ne le réabonne pas automatiquement
            fakeUser({ id: 2, question_subscriptions: { 1: false } }),
            [],
        );
        expect(userQuestionSubscriptionModel.createSubscription).to.not.have.been.called;

        expect(response.subscribed).to.be.false;
    });

    it('ignore une erreur d\'abonnement de l\'auteur de la réponse', async () => {
        answerModel.create.resolves(2);
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        userQuestionSubscriptionModel.createSubscription.rejects(new Error('une erreur'));

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

    it('envoie une notification mail spéciale à l\'auteur de la question', async () => {
        const subscriber = fakeQuestionSubscriber({ user_id: 1, is_author: true });
        const answerAuthor = fakeUser({ id: 2 });
        answerModel.create.resolves(2);
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        userModel.getQuestionSubscribers.withArgs(1).resolves([subscriber]);
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            answerAuthor,
            [],
        );
        expect(mails.sendCommunityNewAnswerForAuthor).to.have.been.calledOnce;

        const { args } = mails.sendCommunityNewAnswerForAuthor.getCall(0);
        expect(args[0]).to.be.eql(subscriber);
        expect(args[1]).to.be.eql({
            preserveRecipient: false,
            variables: {
                questionId: 1,
                author: answerAuthor,
            },
        });
    });

    it('envoie une notification mail générique aux abonnés à la question', async () => {
        const subscribers = [
            fakeQuestionSubscriber({ user_id: 2, is_author: false }),
            fakeQuestionSubscriber({ user_id: 3, is_author: false }),
            fakeQuestionSubscriber({ user_id: 4, is_author: false }),
        ];
        const answerAuthor = fakeUser({ id: 5 });
        answerModel.create.resolves(2);
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        userModel.getQuestionSubscribers.withArgs(1).resolves(subscribers);
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1, question: 'Une question' }),
            answerAuthor,
            [],
        );
        expect(mails.sendCommunityNewAnswerForObservers).to.have.callCount(3);

        const { args } = mails.sendCommunityNewAnswerForObservers.getCall(0);
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

    it('n\'envoie pas de notification mail à l\'auteur de la réponse', async () => {
        const subscriber = fakeQuestionSubscriber({ user_id: 2 });
        answerModel.create.resolves(2);
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        userModel.getQuestionSubscribers.withArgs(1).resolves([subscriber]);
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
            [],
        );
        expect(mails.sendCommunityNewAnswerForAuthor).to.not.have.been.called;
        expect(mails.sendCommunityNewAnswerForObservers).to.not.have.been.called;
    });

    it('ignore une erreur d\'envoi de notifications mail', async () => {
        const subscriber = fakeQuestionSubscriber({ user_id: 1, is_author: true });
        const answerAuthor = fakeUser({ id: 2 });
        answerModel.create.resolves(2);
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        userModel.getQuestionSubscribers.withArgs(1).resolves([subscriber]);
        mails.sendCommunityNewAnswerForAuthor.rejects(new Error('Une erreur'));

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

    it('retourne la réponse nouvelle créée', async () => {
        const answer = fakeAnswer({ id: 2 });
        answerModel.create.resolves(2);
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        answerModel.findOne.withArgs(2).resolves(answer);
        const response = await createAnswer(
            { description: answer.description },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
            [],
        );
        expect(response.answer).to.be.eql(answer);
    });

    it('lance une exception fetch_failed si la récupération de la réponse échoue', async () => {
        answerModel.create.resolves(2);
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        answerModel.findOne.rejects(new Error('Une erreur'));

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

    it('fait appel au service d\'upload', async () => {
        const files = [fakeFile()];
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(uploadAttachments).to.have.been.calledOnce;
    });

    it('enregistre chaque fichier en tant que pièce-jointe d\'une réponse', async () => {
        const files = [fakeFile()];
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(uploadAttachments.getCall(0).args[0]).to.be.eql('answer');
    });

    it('enregistre chaque fichier avec le bon identifiant de réponse', async () => {
        const answerId = 42;
        answerModel.create.resolves(answerId);

        const files = [fakeFile()];
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(uploadAttachments.getCall(0).args[1]).to.be.eql(42);
    });

    it('enregistre chaque fichier avec le bon identifiant utilisateur', async () => {
        const files = [fakeFile()];
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser({ id: 42 }), files);
        expect(uploadAttachments.getCall(0).args[2]).to.be.eql(42);
    });

    it('passe bien la liste de tous les fichiers au service d\'upload', async () => {
        const files = [fakeFile(), fakeFile(), fakeFile()];
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(uploadAttachments.getCall(0).args[3]).to.be.eql(files);
    });

    it('enregistre chaque fichier avec la bonne transaction', async () => {
        const files = [fakeFile()];
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(uploadAttachments.getCall(0).args[4]).to.be.eql(transaction);
    });

    it('n\'appelle pas le service d\'upload si aucun fichier n\'est fourni', async () => {
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), []);
        expect(uploadAttachments).to.not.have.been.called;
    });

    it('ne commit l\'enregistrement de la réponse qu\'une fois les fichiers uploadés', async () => {
        const files = [fakeFile()];
        answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
        await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        expect(transaction.commit).to.have.been.calledAfter(uploadAttachments);
    });

    it('fait un rollback si l\'upload des fichiers échoue', async () => {
        const files = [fakeFile()];
        uploadAttachments.rejects(new Error('une erreur'));
        try {
            answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
            await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        } catch (error) {
            // ignore
        }

        expect(transaction.commit, 'Le commit() de la transaction a été appelé').to.not.have.been.called;
        expect(transaction.rollback).to.have.been.calledOnce;
    });

    it('lance une exception upload_failed si l\'upload des fichiers échoue', async () => {
        const files = [fakeFile()];
        const originalError = new Error('une erreur');
        uploadAttachments.rejects(originalError);

        try {
            answerModel.findOne.resolves({ id: 2, ...serializedAnswer });
            await createAnswer(fakeAnswer(), fakeQuestion(), fakeUser(), files);
        } catch (error) {
            expect(error).to.be.an.instanceof(ServiceError);
            expect(error.code, 'Le code de l\'exception est incorrect').to.be.eql('upload_failed');
            expect(error.nativeError, 'L\'erreur native associée à l\'exception incorrect').to.be.eql(originalError);
            return;
        }

        expect.fail('Une exception aurait dû être lancée');
    });
});
