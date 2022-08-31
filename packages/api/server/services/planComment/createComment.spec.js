const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const planCommentModel = require('#server/models/planCommentModel');
const userModel = require('#server/models/userModel');


const mails = require('#server/mails/mails');

const mattermostUtils = require('#server/utils/mattermost');
const { serialized: fakeUser } = require('#test/utils/user');
const { serialized: fakePlan } = require('#test/utils/plan');

const createCommentService = require('./createComment');


describe.only('services/planComment', () => {
    describe('createComment()', () => {
        const user = fakeUser();
        const plan = fakePlan({ departement: 1, region: 84 });
        const newComment = { description: 'ceci est un commentaire de test', id: 2, plan: plan.id };
        let stubs;

        beforeEach(() => {
            stubs = {
                createComment: sinon.stub(planCommentModel, 'create'),
                findOne: sinon.stub(planCommentModel, 'findOne'),
                getPlanObservers: sinon.stub(userModel, 'getPlanObservers'),
                triggerNewPlanComment: sinon.stub(mattermostUtils, 'triggerNewPlanComment'),
                sendUserNewPlanComment: sinon.stub(mails, 'sendUserNewPlanComment'),
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('crée le commentaire en base de données et le renvoie', async () => {
            stubs.createComment.resolves(newComment.id);
            stubs.findOne.resolves(newComment);

            const response = await createCommentService(newComment, plan, user);
            expect(stubs.createComment).to.have.been.calledOnceWith({
                description: newComment.description,
                fk_plan: plan.id,
                created_by: user.id,
            });
            expect(response).to.be.eql(newComment);
        });
        it('envoie une notification mattermost', async () => {
            stubs.createComment.resolves(newComment.id);
            stubs.findOne.resolves(newComment);
            await createCommentService(newComment, plan, user);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.triggerNewPlanComment).to.have.been.calledOnce;
        });
        it('envoie une notification mail aux personnes concernées', async () => {
            const observers = [fakeUser(), fakeUser(), fakeUser()];
            stubs.createComment.resolves(newComment.id);
            stubs.findOne.resolves(newComment);
            stubs.getPlanObservers.resolves(observers);
            stubs.findOne.resolves(newComment);
            await createCommentService(newComment, plan, user);
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.sendUserNewPlanComment).to.have.been.calledThrice;
        });
    });
});
