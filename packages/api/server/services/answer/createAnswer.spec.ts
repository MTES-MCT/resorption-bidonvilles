import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';

import answerModel from '#server/models/answerModel';

import { serialized as fakeUser } from '#test/utils/user';

import Question from '#server/models/questionModel/Question.d';

const stubs = {
    createAnswer: sinon.stub(),
    findOne: sinon.stub(),
};

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createAnswerService from './createAnswer';
rewiremock.disable();

const { expect } = chai;
chai.use(sinonChai);

describe('services/answer', () => {
    describe('createAnswer()', () => {
        const user = fakeUser();
        const question: Question = {
            id: 2,
            question: 'question test',
            details: 'Détails de la question',
            peopleAffected: null,
            tags: [],
            answers: [],
            createdBy: {
                id: 1,
                first_name: 'Jean',
                last_name: 'Dupont',
                position: 'Mock',
                role: 'Acteur national',
                organization_id: 2,
                organization: 'Délégation Interministérielle à l\'Hébergement et à l\'Accès au Logement',
            },
            createdAt: new Date().getTime() / 1000,
            updatedAt: null,
            solvedAt: null,
        };
        const newAnswer = { description: 'ceci est une réponse de test', id: 2 };

        beforeEach(() => {
            stubs.createAnswer = sinon.stub(answerModel, 'create');
            stubs.findOne = sinon.stub(answerModel, 'findOne');
        });

        afterEach(() => {
            sinon.reset();
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
