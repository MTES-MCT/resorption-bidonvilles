import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeQuestion } from '#test/utils/question';
import { serialized as fakeAnswer } from '#test/utils/answer';
import { row as fakeQuestionSubscriber } from '#test/utils/questionSubscriber';
import { fail } from 'assert';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();
const mails = {
    sendCommunityNewAnswerForAuthor: sandbox.stub(),
    sendCommunityNewAnswerForObservers: sandbox.stub(),
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
rewiremock('#server/mails/mails').withDefault(mails);
rewiremock('#server/models/userModel').withDefault(userModel);
rewiremock('#server/models/answerModel').withDefault(answerModel);
rewiremock('#server/models/userQuestionSubscriptionModel').withDefault(userQuestionSubscriptionModel);

describe('services/answer.createAnswer()', () => {
    let createAnswer;
    beforeEach(async () => {
        rewiremock.enable();
        ({ default: createAnswer } = await rewiremock.module(() => import('./createAnswer')));
    });
    afterEach(() => {
        rewiremock.disable();
        sandbox.reset();
    });

    it('insére la réponse en base de données', async () => {
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
        );
        expect(answerModel.create).to.have.been.calledOnce;
        expect(answerModel.create).to.have.been.calledWith({
            description: 'Une réponse',
            fk_question: 1,
            created_by: 2,
        });
    });

    it('lance une exception insert_failed si l\'insertion de la réponse échoue', async () => {
        answerModel.create.rejects(new Error('Une erreur'));
        try {
            await createAnswer(
                { description: 'Une réponse' },
                fakeQuestion({ id: 1 }),
                fakeUser({ id: 2 }),
            );
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('insert_failed');
            expect(error.message).to.be.equal('Une erreur');
            return;
        }

        expect.fail('Une exception était attendue');
    });

    it('abonne l\'auteur de la réponse s\'il n\'est pas déjà abonné à la question et retourne cette information', async () => {
        answerModel.create.resolves(2);
        const response = await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
        );
        expect(userQuestionSubscriptionModel.createSubscription).to.have.been.calledOnce;
        expect(userQuestionSubscriptionModel.createSubscription).to.have.been.calledWith(2, 1);

        expect(response.subscribed).to.be.true;
    });

    it('n\'abonne pas l\'auteur de la réponse si il est déjà abonné à la question et retourne cette information', async () => {
        answerModel.create.resolves(2);
        const response = await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            // l'utilisateur n'est plus abonné à la question mais l'a déjà été donc on ne le réabonne pas automatiquement
            fakeUser({ id: 2, question_subscriptions: { 1: false } }),
        );
        expect(userQuestionSubscriptionModel.createSubscription).to.not.have.been.called;

        expect(response.subscribed).to.be.false;
    });

    it('ignore une erreur d\'abonnement de l\'auteur de la réponse', async () => {
        answerModel.create.resolves(2);
        userQuestionSubscriptionModel.createSubscription.rejects(new Error('une erreur'));

        try {
            await createAnswer(
                { description: 'Une réponse' },
                fakeQuestion({ id: 1 }),
                fakeUser({ id: 2 }),
            );
        } catch (error) {
            fail('Une exception a été lancée');
        }
    });

    it('envoie une notification mail spéciale à l\'auteur de la question', async () => {
        const subscriber = fakeQuestionSubscriber({ user_id: 1, is_author: true });
        const answerAuthor = fakeUser({ id: 2 });
        answerModel.create.resolves(2);
        userModel.getQuestionSubscribers.withArgs(1).resolves([subscriber]);
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            answerAuthor,
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
        userModel.getQuestionSubscribers.withArgs(1).resolves(subscribers);
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1, question: 'Une question' }),
            answerAuthor,
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
        userModel.getQuestionSubscribers.withArgs(1).resolves([subscriber]);
        await createAnswer(
            { description: 'Une réponse' },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
        );
        expect(mails.sendCommunityNewAnswerForAuthor).to.not.have.been.called;
        expect(mails.sendCommunityNewAnswerForObservers).to.not.have.been.called;
    });

    it('ignore une erreur d\'envoi de notifications mail', async () => {
        const subscriber = fakeQuestionSubscriber({ user_id: 1, is_author: true });
        const answerAuthor = fakeUser({ id: 2 });
        answerModel.create.resolves(2);
        userModel.getQuestionSubscribers.withArgs(1).resolves([subscriber]);
        mails.sendCommunityNewAnswerForAuthor.rejects(new Error('Une erreur'));

        try {
            await createAnswer(
                { description: 'Une réponse' },
                fakeQuestion({ id: 1 }),
                answerAuthor,
            );
        } catch (error) {
            fail('Une exception a été lancée');
        }
    });

    it('retourne la réponse nouvelle créée', async () => {
        const answer = fakeAnswer({ id: 2 });
        answerModel.create.resolves(2);
        answerModel.findOne.withArgs(2).resolves(answer);
        const response = await createAnswer(
            { description: answer.description },
            fakeQuestion({ id: 1 }),
            fakeUser({ id: 2 }),
        );
        expect(response.answer).to.be.eql(answer);
    });

    it('lance une exception fetch_failed si la récupération de la réponse échoue', async () => {
        answerModel.create.resolves(2);
        answerModel.findOne.rejects(new Error('Une erreur'));

        try {
            await createAnswer(
                { description: 'Une description' },
                fakeQuestion({ id: 1 }),
                fakeUser({ id: 2 }),
            );
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('fetch_failed');
            expect(error.message).to.be.equal('Une erreur');
            return;
        }

        expect.fail('Une exception était attendue');
    });
});
