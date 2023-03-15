import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import questionModel from '#server/models/questionModel';
import ServiceError from '#server/errors/ServiceError';
import findService from './findOne';

const { expect } = chai;
chai.use(sinonChai);

describe('services/question', () => {
    describe('findOne()', () => {
        let stubs;
        beforeEach(() => {
            stubs = {
                findOne: sinon.stub(questionModel, 'findOne'),
                getAnswers: sinon.stub(questionModel, 'getAnswers'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('retourne la question', async () => {
            const question = {
                id: 1,
                question: 'question test',
                details: 'details test',
                peopleAffected: 5,
                tags: [],
                other_tag: null,
            };
            const apiAnswers = {
                6: [
                    {
                        id: 1,
                        description: 'réponse test 1',
                    },
                    {
                        id: 2,
                        description: 'réponse test 2',
                    },
                ],
            };
            stubs.findOne.resolves(question);
            stubs.getAnswers.resolves(apiAnswers);
            const answers = apiAnswers[1];
            const response = await findService(1);
            expect(response).to.be.an('object');
            expect(response).to.be.eql({ ...question, answers });
        });
        it('renvoie une exception ServiceError \'fetch_failed\'  si la question n\'existe pas en bdd', async () => {
            stubs.findOne.resolves(null);
            let responseError = null;
            try {
                await findService(1);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
