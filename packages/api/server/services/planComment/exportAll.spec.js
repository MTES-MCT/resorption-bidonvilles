const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const planCommentModel = require('#server/models/planCommentModel');

const { serialized: fakePlanComment } = require('#test/utils/planComment');
const { serialized: fakeUser } = require('#test/utils/user');
const permissionUtils = require('#server/utils/permission');
const moment = require('moment');


const exportAllService = require('./exportAll');


describe.only('services/exportAll', () => {
    describe('exportAll()', () => {
        const user = fakeUser();
        const planComment = fakePlanComment();
        let stubs;

        beforeEach(() => {
            stubs = {
                findAll: sinon.stub(planCommentModel, 'findAll'),
                can: sinon.stub(permissionUtils, 'can'),
                do: sinon.stub(),
                on: sinon.stub(),
            };
            stubs.can.returns({
                do: stubs.do,
            });
            stubs.do.returns({
                on: stubs.on,
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('vérifie que l\'utilisateur a le droit d\'exporter les commentaires des actions au niveau national', async () => {
            try {
                await exportAllService(user);
            } catch (e) {
                // ignore
            }
            expect(stubs.can).to.have.been.calledOnceWith(user);
            expect(stubs.do).to.have.been.calledOnceWith('export', 'plan_comment');
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.on).to.have.been.calledOnceWith({ type: 'nation' });
        });
        it('récupère les commentaires en bdd et les renvoie au formal excel', async () => {
            stubs.on.returns(true);
            const createdAt = moment(planComment.commentCreatedAt).utcOffset(2);
            stubs.findAll.resolves([planComment]);
            const response = await exportAllService(user);
            expect(response).to.be.eql([{
                S: createdAt.format('w'),
                'ID du commentaire': planComment.id,
                'ID de l\'action': planComment.plan,
                'Publié le': createdAt.format('DD/MM/YYYY'),
                Description: planComment.description,
                'ID de l\'auteur(e)': planComment.createdBy.id,
                'Nom de famille': planComment.createdBy.last_name,
                Structure: planComment.createdBy.organization,
                Role: planComment.createdBy.role,
            }]);
        });
    });
});
