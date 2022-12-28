import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import answerModel from '#server/models/answerModel';

import { serialized as fakeUser } from '#test/utils/user';

import createAnswerService from './createAnswer';

const { expect } = chai;
chai.use(sinonChai);

describe('services/answer', () => {
    describe('createAnswer()', () => {
        const user = fakeUser();
        const question = {
            id: 2,
            question: 'question test',
            tags: [],
            answers: [],
            createdBy: {
                id: 1,

            },
        };
        const newAnswer = { description: 'ceci est une réponse de test', id: 2 };
        let stubs;

        beforeEach(() => {
            stubs = {
                createAnswer: sinon.stub(answerModel, 'create'),
                findOne: sinon.stub(answerModel, 'findOne'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('crée la réponse en base de données et la renvoie', async () => {
            stubs.createAnswer.resolves(newAnswer.id);
            stubs.findOne.resolves(newAnswer);

            const response = await createAnswerService(newAnswer, question, user);
            expect(stubs.createAnswer).to.have.been.calledOnceWith({
                description: newAnswer.description,
                fk_question: question.id,
                created_by: user.id,
            });
            expect(response).to.be.eql(newAnswer);
        });
    });
});
