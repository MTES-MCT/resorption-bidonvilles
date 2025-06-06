import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

import { serialized as serializedQuestion } from '#test/utils/question';
import { serialized as fakeUser } from '#test/utils/userSimplified';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();

const enrichQuestion = sandbox.stub();

rewiremock('#server/services/question/common/enrichQuestion').withDefault(enrichQuestion);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import findOne from './findOne';
rewiremock.disable();

const question = serializedQuestion({
    answers: [
        {
            id: 1,
            description: 'réponse test 1',
            createdAt: null,
            createdBy: fakeUser(),
            question: 1,
            attachments: [],
        },
        {
            id: 2,
            description: 'réponse test 2',
            createdAt: null,
            createdBy: fakeUser(),
            question: 1,
            attachments: [],
        },
    ],
});
const answers = [
    {
        id: 1,
        description: 'réponse test 1',
    },
    {
        id: 2,
        description: 'réponse test 2',
    },
];


describe('services/question', () => {
    describe('findOne()', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('retourne la question', async () => {
            enrichQuestion.resolves({ answers, ...question });
            const questionFound = await findOne(1);

            expect(questionFound).to.be.an('object');
            expect(questionFound).to.be.eql(question);
        });
        it('renvoie une exception ServiceError \'fetch_failed\'  si la question n\'est pas retournée', async () => {
            enrichQuestion.resolves(null);
            let responseError = null;
            try {
                enrichQuestion.resolves(null);
                await findOne(1);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
    });
});
