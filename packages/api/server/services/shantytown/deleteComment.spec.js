const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);


const validator = require('validator');
const shantytownModel = require('#server/models/shantytownModel');
const shantytownCommentModel = require('#server/models/shantytownCommentModel');
const userModel = require('#server/models/userModel');
const mails = require('#server/mails/mails');
const permissionUtils = require('#server/utils/permission');
const ServiceError = require('#server/errors/ServiceError');
const deleteCommentService = require('./deleteComment');


describe.only('services/shantytown', () => {
    describe('deleteComment()', () => {
        let stubs;
        const user = { id: 0 };
        const author = { id: 1 };
        const shantytownId = 0;
        const commentId = 0;
        const comment = { id: 0, createdBy: { id: 1 } };
        const deletionMessage = 'deletionMessage';
        const town = {
            region: null,
            departement: null,
            epci: null,
            city: 0,
            comments: {
                regular: [comment],

            },
        };
        beforeEach(() => {
            stubs = {
                shantytownModelfindOne: sinon.stub(shantytownModel, 'findOne'),
                userModelFindOne: sinon.stub(userModel, 'findOne'),
                shantytownCommentModeldeleteComment: sinon.stub(shantytownCommentModel, 'deleteComment'),
                can: sinon.stub(permissionUtils, 'can'),
                do: sinon.stub(),
                on: sinon.stub(),
                trim: sinon.stub(validator, 'trim'),
                sendUserCommentDeletion: sinon.stub(mails, 'sendUserCommentDeletion'),

            };
            stubs.can.returns({
                do: stubs.do,
            });
            stubs.do.returns({
                on: stubs.on,
            });

            stubs.shantytownModelfindOne.resolves(town);
            stubs.userModelFindOne.resolves(author);
        });

        afterEach(() => {
            sinon.restore();
        });
        it('vérifie que l\'utilisateur a le droit de supprimer le commentaire', async () => {
            try {
                await deleteCommentService(user, shantytownId, commentId, deletionMessage);
            } catch (error) {
                // ignore
            }
            expect(stubs.can).to.have.been.calledOnceWith(user);
            expect(stubs.do).to.have.been.calledOnceWith('moderate', 'shantytown_comment');
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.on).to.have.been.calledOnce;
        });
        it('si aucune exception n\'est soulevée, supprime le commentaire en bdd et renvoie la liste des commentaires du site à jour', async () => {
            stubs.on.returns(true);
            let commentsUpdated;
            try {
                commentsUpdated = await deleteCommentService(user, shantytownId, commentId, deletionMessage);
            } catch (error) {
                // ignore
            }
            expect(stubs.shantytownCommentModeldeleteComment).to.have.been.calledOnceWith(commentId);
            expect(commentsUpdated).to.eql({ comments: [] });
        });

        it('renvoie une exception ServiceError \'fetch_failed\' si le site correspondant au commentaire n\'existe pas en bdd', async () => {
            stubs.shantytownModelfindOne.rejects(new Error());
            let responseError;
            try {
                await deleteCommentService(user, shantytownId, commentId, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si le commentaire à supprimer n\'existe pas en bdd', async () => {
            let responseError;
            try {
                await deleteCommentService(user, shantytownId, 1, deletionMessage); // 1 est un Id qui ne correspond à aucun commentaire dans notre test
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si l\'auteur du commentaire n\'existe pas en bdd', async () => {
            stubs.userModelFindOne.rejects(new Error());
            let responseError;
            try {
                await deleteCommentService(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
        it('renvoie une exception ServiceError \'permission_denied\' si l\'utilisateur n\' pas la permission de supprimer le commentaire', async () => {
            stubs.on.returns(false);
            let responseError;
            try {
                await deleteCommentService(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('permission_denied');
        });
        it('renvoie une exception ServiceError \'data_incomplete\' si le motif de suppression du message est vide', async () => {
            stubs.on.returns(true);
            stubs.trim.returns('');
            let responseError;
            try {
                await deleteCommentService(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('data_incomplete');
        });
        it('renvoie une exception ServiceError \'delete_failed\' si le modèle deleteComment échoue', async () => {
            stubs.on.returns(true);
            stubs.shantytownCommentModeldeleteComment.rejects(new Error());
            let responseError;
            try {
                await deleteCommentService(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('delete_failed');
        });

        it('envoie une notification de suppression du message ', async () => {
            stubs.on.returns(true);
            try {
                await deleteCommentService(user, shantytownId, commentId, deletionMessage);
            } catch (error) {
                // ignore
            }
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.sendUserCommentDeletion).to.have.been.calledOnce;
        });
    });
});
