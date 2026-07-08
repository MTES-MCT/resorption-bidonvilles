import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import { AuthUser } from '#server/middlewares/authMiddleware';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const stubs = {
    updateComment: sandbox.stub().resolves([{ shantytown_comment_id: 1 }]),
    findByShantytown: sandbox.stub(),
    getShantytownWatchers: sandbox.stub().resolves([]),
    validator: {
        trim: sandbox.stub().callsFake(value => value.trim()),
    },
};

rewiremock('#server/models/shantytownCommentModel').with({
    findByShantytown: stubs.findByShantytown,
    update: stubs.updateComment,
});
rewiremock('#server/models/userModel').with({
    getShantytownWatchers: stubs.getShantytownWatchers,
});
rewiremock('validator').with(stubs.validator);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import updateShantytownComment from '#server/services/shantytownComment/updateComment';
rewiremock.disable();

describe('services/shantytownComment.updateComment()', () => {
    let user: AuthUser;
    const newDescription = 'Description modifiée du commentaire';
    const shantytownId = 1;

    beforeEach(() => {
        user = fakeUser();
        const comments = {
            [shantytownId]: [
                {
                    id: 1,
                    description: 'Commentaire original',
                    createdBy: { id: user.id },
                    createdAt: new Date(),
                },
            ],
        };
        stubs.findByShantytown.resolves(comments);
        stubs.getShantytownWatchers.resolves([]);
        stubs.updateComment.resolves([{ shantytown_comment_id: 1 }]);
    });

    afterEach(() => {
        user = null;
        sandbox.restore();
    });

    it('si l\'utilisateur est l\'auteur, modifie le commentaire en bdd et renvoie la liste des commentaires du site à jour', async () => {
        const result = await updateShantytownComment(user, shantytownId, 1, newDescription);
        expect(stubs.updateComment).to.have.been.calledOnceWith(1, user.id, newDescription);
        expect(result).to.have.property('comments');
        expect(result).to.have.property('numberOfWatchers');
    });

    it('renvoie une exception ServiceError \'fetch_failed\' si le commentaire à modifier n\'existe pas en bdd', async () => {
        let responseError;
        try {
            await updateShantytownComment(user, shantytownId, 999, newDescription); // 999 est un Id qui ne correspond à aucun commentaire
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
            await updateShantytownComment(fakeTestUser, shantytownId, 1, newDescription);
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
            await updateShantytownComment(user, shantytownId, 1, '   ');
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
            await updateShantytownComment(user, shantytownId, 1, newDescription);
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('update_failed');
    });
});
