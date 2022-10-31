import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const { expect } = chai;
chai.use(sinonChai);

import planCommentModelFactory from '#server/models/planCommentModel';

import planCommentUtils from '#test/utils/planComment';
import userUtils from '#test/utils/user';
import permissionUtils from '#server/utils/permission';
import moment from 'moment';

import exportAllService from './exportAll';

const planCommentModel = planCommentModelFactory();
const { serialized: fakePlanComment } = planCommentUtils;
const { serialized: fakeUser } = userUtils;

describe.only('services/exportAll', () => {
    describe('exportAll()', () => {
        const user = fakeUser();
        const planComment: any = fakePlanComment();
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
