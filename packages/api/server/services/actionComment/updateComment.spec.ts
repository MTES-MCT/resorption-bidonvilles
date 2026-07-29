import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import { AuthUser } from '#server/middlewares/authMiddleware';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    updateComment: sandbox.stub().resolves([{ action_comment_id: 1 }]),
    fetchAction: sandbox.stub(),
    enrichCommentsAttachments: sandbox.stub().resolves([]),
    validator: {
        trim: sandbox.stub().callsFake(value => value.trim()),
    },
};

rewiremock('#server/models/actionModel').with({
    fetch: stubs.fetchAction,
    updateComment: stubs.updateComment,
});
rewiremock('./enrichCommentsAttachments').with(stubs.enrichCommentsAttachments);
rewiremock('validator').with(stubs.validator);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import updateActionComment from '#server/services/actionComment/updateComment';
rewiremock.disable();

describe('services/actionComment.updateComment()', () => {
    let user: AuthUser;
    const newDescription = 'Description modifiée du commentaire';
    const actionId = 1;

    beforeEach(() => {
        user = fakeUser();
        const action = fakeAction();
        action.comments = [
            {
                id: 1,
                description: 'Commentaire original',
                createdBy: {
                    id: user.id,
                    first_name: 'Test',
                    last_name: 'User',
                    organization: 'Test Org',
                    organization_id: 1,
                },
                createdAt: Date.now() / 1000,
                attachments: [],
            },
        ];
        stubs.fetchAction.resolves([action]);
        stubs.updateComment.resolves([{ action_comment_id: 1 }]);
    });

    afterEach(() => {
        user = null;
        sandbox.restore();
    });

    it('si l\'utilisateur est l\'auteur, modifie le commentaire en bdd et renvoie la liste des commentaires de l\'action à jour', async () => {
        const commentsUpdated = await updateActionComment(user, actionId, 1, newDescription);
        expect(stubs.updateComment).to.have.been.calledOnceWith(1, user.id, newDescription);
        expect(commentsUpdated).to.have.property('comment');
    });

    it('renvoie une exception ServiceError \'fetch_failed\' si l\'action correspondante au commentaire n\'existe pas en bdd', async () => {
        stubs.fetchAction.rejects(new Error('l\'action correspondante au commentaire n\'existe pas en bdd'));
        let responseError;
        try {
            await updateActionComment(user, actionId, 1, newDescription);
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('fetch_failed');
    });

    it('renvoie une exception ServiceError \'fetch_failed\' si le commentaire à modifier n\'existe pas en bdd', async () => {
        let responseError;
        try {
            await updateActionComment(user, actionId, 999, newDescription); // 999 est un Id qui ne correspond à aucun commentaire
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('fetch_failed');
    });

    it('renvoie une exception ServiceError \'permission_denied\' si l\'utilisateur n\'est pas l\'auteur du commentaire', async () => {
        const fakeTestUser = fakeUser();
        fakeTestUser.id = 999; // Surcharge l'ID pour ne pas être le propriétaire du message
        let responseError: ServiceError | undefined;
        try {
            await updateActionComment(fakeTestUser, actionId, 1, newDescription);
        } catch (error) {
            responseError = error;
        }

        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('permission_denied');
    });

    it('renvoie une exception ServiceError \'data_incomplete\' si la nouvelle description est vide', async () => {
        stubs.validator.trim.returns('');
        let responseError;
        try {
            await updateActionComment(user, actionId, 1, '   ');
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('data_incomplete');
    });

    it('renvoie une exception ServiceError \'update_failed\' si le modèle updateComment échoue', async () => {
        stubs.validator.trim.callsFake(value => value.trim());
        stubs.updateComment.rejects(new Error('Impossible de modifier le commentaire'));
        let responseError;
        try {
            await updateActionComment(user, actionId, 1, newDescription);
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('update_failed');
    });
});
