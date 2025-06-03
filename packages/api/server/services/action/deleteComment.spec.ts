import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import permissionUtils from '#server/utils/permission';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import { AuthUser } from '#server/middlewares/authMiddleware';

import actionModel from '#server/models/actionModel';
import deleteActionComment from './deleteComment';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    deleteComment: sandbox.stub().resolves(true),
    fetchCommentsModel: sandbox.stub(),
    fetchUserModel: sandbox.stub(),
    canDeleteComment: sandbox.stub(),
    can: sandbox.stub(permissionUtils, 'can'),
    do: sandbox.stub(),
    on: sandbox.stub(),
};

stubs.can.returns({
    do: stubs.do,
});
stubs.do.returns({
    on: stubs.on,
});

rewiremock('#server/models/actionModel/fetchComments/fetchComments').with(stubs.fetchCommentsModel);
rewiremock('#server/models/userModel/findOne').with(stubs.fetchUserModel);
rewiremock('#server/utils/permission').with({ can: stubs.canDeleteComment });
rewiremock('#server/models/actionModel/deleteComment/deleteComment').with(stubs.deleteComment);

describe('services/action.deleteComment()', () => {
    let user: AuthUser;

    beforeEach(() => {
        user = fakeUser();
        user.permissions = {
            data: {
                moderate: {
                    allowed: true,
                    allowed_on_national: true,
                    allowed_on: {
                        regions: [],
                        departements: [{
                            type: 'departement',
                            city: null,
                            epci: null,
                            departement: { code: '78', name: 'Yvelines' },
                            region: { code: '11', name: 'Île-De-France' },
                        }],
                        epci: [],
                        cities: [],
                        actions: [1],
                    },
                },
            },
        };
        sandbox.stub(actionModel, 'fetch').resolves([fakeAction()]);
        stubs.fetchUserModel.resolves(user);
        // stubs.canDeleteComment.usingPromise(Boolean).resolves(true);
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('supprime un commentaire après vérification des droits', async () => {
        user.id = 1; // Surcharge de l'ID utilisateur pour simuler qu'il est propriétaire du commentaire
        const commentId = 1;
        const deletionMessage = 'Test supression message action';
        stubs.deleteComment.resolves({ id: 1, comments: [] });
        const result = await deleteActionComment(user, fakeAction().id, commentId, deletionMessage);

        expect(stubs.can).to.have.been.calledOnceWith(user);
        expect(stubs.do).to.have.been.calledOnceWith('moderate', 'data');
        expect(stubs.on).to.have.been.calledOnce;
        expect(result).to.be.true;
    });

    // it('retourne une erreur si la suppression est demandée par un admin sans message de suppression', async () => {
    //     user.id = 2;
    //     try {
    //         await expect(deleteActionComment(user, fakeAction().id, fakeAction().comments[0].id, '')).to.be.rejectedWith(ServiceError, 'data_incomplete');
    //     }
    // });
    /*
    it('should send notification email when deleted by non-owner', async () => {
        // Arrange
        const user = { id: 2 };
        const action = { id: 1, comments: [{ id: 1, createdBy: { id: 1 } }] };

        // Mocks
        sandbox.stub(actionModel, 'fetch').resolves([fakeAction]);
        sandbox.stub(userModel, 'findOne').resolves(user);
        sandbox.stub(permissionUtils, 'can').returns(true);
        sandbox.stub(deleteComment).resolves();
        sandbox.stub(mails, 'sendUserCommentDeletion').resolves();

        // Act
        await deleteActionComment(user, action.id, 1, 'Test message');

        // Assert
        expect(mails.sendUserCommentDeletion).to.have.been.calledOnce;
    });
    it('should throw permission error when user lacks permission', async () => {
        fetchCommentsModel.resolves([fakeActionComment]);
        fetchUserModel.resolves(fakeUser);
        canDeleteComment.usingPromise(Boolean).resolves(true);
        expect(canDeleteComment).to.have.been.calledOnceWith(fakeUser);
        expect(stubs.do).to.have.been.calledOnceWith('moderate', 'data');
        // eslint-disable-next-line no-unused-expressions
        expect(stubs.on).to.have.been.calledOnce;
        // Act & Assert
        await expect(deleteActionComment(user, action.id, 1, 'Test message')).to.be.rejectedWith(ServiceError, 'permission_denied');
    });
    */
});
