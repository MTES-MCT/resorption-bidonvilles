import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeTown } from '#test/utils/shantytown';
import { AuthUser } from '#server/middlewares/authMiddleware';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownModel: {
        findOne: sandbox.stub(),
    },
    userModel: {
        findOne: sandbox.stub(),
        getNationalAdmins: sandbox.stub(),
    },
    shantytownCommentModel: {
        deleteComment: sandbox.stub(),
    },
    enrichCommentsAttachments: sandbox.stub().resolves([]),
    mails: {
        sendUserCommentDeletion: sandbox.stub().resolves(),
    },
    dateUtils: {
        fromTsToFormat: sandbox.stub().callsFake(ts => (ts ? new Date(ts).toISOString() : 'Invalid Date')),
        tsToString: sandbox.stub().callsFake(ts => (ts ? new Date(ts * 1000).toLocaleDateString('fr-FR') : 'Invalid Date')),
    },
    can: sandbox.stub(),
    do: sandbox.stub(),
    on: sandbox.stub(),
    validator: {
        trim: sandbox.stub().callsFake(value => value.trim()),
    },
};

rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);
rewiremock('#server/models/shantytownCommentModel').with(stubs.shantytownCommentModel);
rewiremock('#server/models/userModel').with(stubs.userModel);
rewiremock('#server/mails/mails').with(stubs.mails);
rewiremock('#server/utils/permission').with({ can: stubs.can });
rewiremock('validator').with(stubs.validator);
rewiremock('#server/utils/date').with(stubs.dateUtils);
rewiremock('./_common/enrichCommentsAttachments').with(stubs.enrichCommentsAttachments);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deleteCommentService from './deleteComment';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('deleteComment()', () => {
        let user: AuthUser;
        const author = fakeUser({ id: 1 });
        const shantytownId = 0;
        const commentId = 0;
        const comment = {
            id: commentId,
            description: 'description',
            createdAt: Date.now(),
            organization_target_name: ['org1'],
            user_target_name: ['user1'],
            createdBy: {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                organization: 'Org',
                organization_id: 1,
                position: 'Test position',
            },
            shantytown: 0,
            tags: [],
            attachments: [],
        };
        const deletionMessage = 'Test supression message site';
        const town = fakeTown();
        town.comments = [comment];
        beforeEach(() => {
            stubs.can.returns({
                do: stubs.do,
            });
            stubs.do.returns({
                on: stubs.on,
            });
            user = fakeUser();
            stubs.shantytownModel.findOne.resolves(town);
            stubs.userModel.findOne.resolves(author);
        });

        afterEach(() => {
            sandbox.reset();
        });
        it('vérifie que l\'utilisateur a le droit de supprimer le commentaire', async () => {
            try {
                await deleteCommentService(user, shantytownId, commentId, deletionMessage);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
            expect(stubs.can).to.have.been.calledOnceWith(user);
            expect(stubs.do).to.have.been.calledOnceWith('moderate', 'data');
            // eslint-disable-next-line no-unused-expressions
            expect(stubs.on).to.have.been.calledOnce;
        });
        it('si aucune exception n\'est soulevée, supprime le commentaire en bdd et renvoie la liste des commentaires du site à jour', async () => {
            stubs.on.returns(true);
            const commentsUpdated = await deleteCommentService(user, shantytownId, commentId, deletionMessage);
            expect(stubs.shantytownCommentModel.deleteComment).to.have.been.calledOnceWith(commentId);
            expect(commentsUpdated).to.eql({
                comments: [],
            });
        });

        it('renvoie une exception ServiceError \'fetch_failed\' si le site correspondant au commentaire n\'existe pas en bdd', async () => {
            stubs.shantytownModel.findOne.rejects(new Error());
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
            stubs.userModel.findOne.rejects(new Error());
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
            stubs.validator.trim.returns('');
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
            stubs.shantytownCommentModel.deleteComment.rejects(new Error());
            let responseError;
            try {
                await deleteCommentService(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('delete_failed');
        });
        // it('renvoie une exception ServiceError \'delete_failed\' si le modèle deleteComment échoue', async () => {
        //     stubs.on.returns(true);
        //     stubs.shantytownCommentModel.deleteComment.rejects(new Error());
        //     let responseError;
        //     try {
        //         console.log('User:', user, 'Shantytown ID:', shantytownId, 'Comment ID:', 0, 'Deletion Message:', deletionMessage);

        //         await deleteCommentService(user, shantytownId, 0, deletionMessage);
        //     } catch (error) {
        //         console.error('Erreur:', error, 'Message:', deletionMessage);

        //         responseError = error;
        //     }
        //     expect(responseError).to.be.instanceOf(ServiceError);
        //     expect(responseError.code).to.be.eql('delete_failed');
        // });

        it('envoie une notification de suppression du message', async () => {
            stubs.on.returns(true);

            const nationalAdmins = [fakeUser(), fakeUser()];
            stubs.userModel.getNationalAdmins.resolves(nationalAdmins);

            try {
                await deleteCommentService(user, shantytownId, commentId, deletionMessage);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }

            expect(stubs.mails.sendUserCommentDeletion).to.have.been.calledOnce;

            const { args } = stubs.mails.sendUserCommentDeletion.getCall(0);
            expect(args[1]).to.have.property('bcc');
            expect(args[1].bcc).to.have.lengthOf(nationalAdmins.length);
            expect(args[1]).to.containSubset({
                bcc: nationalAdmins,
            });
        });
    });
});
