import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeTown } from '#test/utils/shantytown';
import { AuthUser } from '#server/middlewares/authMiddleware';
import ServiceError from '#server/errors/ServiceError';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';

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
    },
    shantytownCommentModel: {
        findOne: sandbox.stub(),
        updateComment: sandbox.stub(),
    },
    enrichCommentsAttachments: sandbox.stub().resolves([]),
    validator: {
        trim: sandbox.stub().callsFake(value => value.trim()),
    },
};

rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);
rewiremock('#server/models/shantytownCommentModel').with(stubs.shantytownCommentModel);
rewiremock('#server/models/userModel').with(stubs.userModel);
rewiremock('validator').with(stubs.validator);
rewiremock('../shantytown/_common/enrichCommentsAttachments').with(stubs.enrichCommentsAttachments);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import updateCommentService from './updateComment';
rewiremock.disable();

describe('services/shantytown', () => {
    describe('updateComment()', () => {
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
        const updateMessage = 'Test modification message site';
        const town = fakeTown();
        town.comments = [comment];
        beforeEach(() => {
            stubs.validator.trim.callsFake(value => value.trim());
            user = fakeUser();
            stubs.userModel.findOne.resolves(author);
        });

        afterEach(() => {
            sandbox.reset();
        });

        it('vérifie que le site existe', async () => {
            stubs.shantytownModel.findOne.resolves(town);
            try {
                await updateCommentService(commentId, shantytownId, user, updateMessage);
            } catch (e) {
                // DO NOTHING
            }
            expect(stubs.shantytownModel.findOne).to.be.calledOnceWith(user, shantytownId);
        });

        it('renvoie une erreur si le site n\'est pas trouvé', async () => {
            stubs.shantytownModel.findOne.rejects();
            try {
                await updateCommentService(commentId, shantytownId, user, updateMessage);
            } catch (e) {
                expect(e).to.be.an.instanceOf(ServiceError);
                expect(e).to.have.property('code', 'fetch_failed');
                expect(e).to.have.property('message', 'Error');
            }
            expect(stubs.shantytownModel.findOne).to.be.calledOnceWith(user, shantytownId);
        });

        it('renvoie une erreur si le commentaire à modifier n\'a pas été trouvé', async () => {
            town.comments = [];
            stubs.shantytownModel.findOne.resolves(town);
            try {
                await updateCommentService(commentId, shantytownId, user, updateMessage);
            } catch (e) {
                expect(e).to.be.an.instanceOf(ServiceError);
                expect(e).to.have.property('code', 'fetch_failed');
                expect(e).to.have.property('message', 'Le commentaire à modifier n\'a pas été retrouvé en base de données');
            }
        });

        it('récupère l\'utilisateur/auteur du message à mettre à jour', async () => {
            user.id = comment.createdBy.id;
            town.comments = [comment];
            stubs.shantytownModel.findOne.resolves(town);
            stubs.userModel.findOne.resolves(author);
            try {
                await updateCommentService(commentId, shantytownId, user, updateMessage);
            } catch (e) {
                // DO NOTHING
            }
            expect(stubs.userModel.findOne).to.be.calledOnceWith(comment?.createdBy.id);
        });

        it('renvoie une erreur si l\'utilisateur n\'est pas l\'auteur du commentaire', async () => {
            user.id = comment.createdBy.id + 1;
            town.comments = [comment];
            stubs.shantytownModel.findOne.resolves(town);
            stubs.userModel.findOne.resolves(author);
            try {
                await updateCommentService(commentId, shantytownId, user, updateMessage);
            } catch (e) {
                expect(e).to.be.an.instanceOf(ServiceError);
                expect(e).to.have.property('code', 'permission_denied');
            }
        });
        
        it('vérifie la validité du message (trim)', async () => {
            user.id = comment.createdBy.id;
            town.comments = [comment];
            stubs.shantytownModel.findOne.resolves(town);
            stubs.userModel.findOne.resolves(author);
            try {
                await updateCommentService(commentId, shantytownId, user, updateMessage);
            } catch (e) {
                expect(e).to.be.an.instanceOf(ServiceError);
                expect(e).to.have.property('code', 'data_incomplete');
            }
        });

        it('met à jour le commentaire', async () => {
            user.id = comment.createdBy.id;
            town.comments = [comment];
            stubs.shantytownModel.findOne.resolves(town);
            stubs.userModel.findOne.resolves(author);
            try {
                await updateCommentService(commentId, shantytownId, user, updateMessage);
            } catch (e) {
                // DO NOTHING
            }
            expect(stubs.shantytownCommentModel.updateComment).to.be.calledOnceWith(commentId, updateMessage);
        });

        it('renvoie un ServiceError si la mise à jour échoue', async () => {
            stubs.shantytownModel.findOne.resolves(town);
            stubs.userModel.findOne.resolves(author);
            stubs.shantytownCommentModel.findOne.resolves(comment);
            stubs.shantytownCommentModel.updateComment.rejects();
            user.id = comment.createdBy.id;
            try {
                await updateCommentService(commentId, shantytownId, user, updateMessage);
            } catch (e) {
                expect(e).to.be.an.instanceOf(ServiceError);
                expect(e).to.have.property('code', 'update_failed');
                expect(e).to.have.property('message', 'update_failed');
            }
        });
    });
});
