import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeUser } from '#test/utils/user';
import { rewiremock } from '#test/rewiremock';


const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const attachmentService = {
    deleteAttachment: sandbox.stub(),
};

const attachmentModel = {
    findKeys: sandbox.stub(),
};

const shantytownModel = {
    findOne: sandbox.stub(),
};

const shantytownCommentModel = {
    deleteComment: sandbox.stub(),
};

const userModel = {
    findOne: sandbox.stub(),
    getNationalAdmins: sandbox.stub(),
};

const permissionUtils = {
    can: sandbox.stub(),
    do: sandbox.stub(),
    on: sandbox.stub(),

};

const validator = {
    trim: sandbox.stub(),
};

const dateUtils = {
    fromTsToFormat: sandbox.stub(),
};

const mails = {
    sendUserCommentDeletion: sandbox.stub(),
};

const sequelize = {
    sequelize: {
        transaction: sandbox.stub(),
    },
};

const transaction = {
    commit: sandbox.stub(),
    rollback: sandbox.stub(),
};


rewiremock('#server/services/attachment').with(attachmentService);
rewiremock('#server/models/attachmentModel').with(attachmentModel);
rewiremock('#server/models/shantytownModel').with(shantytownModel);
rewiremock('#server/models/shantytownCommentModel').withDefault(shantytownCommentModel);
rewiremock('#server/models/userModel').with(userModel);
rewiremock('#server/utils/permission').with(permissionUtils);
rewiremock('validator').with(validator);
rewiremock('#server/utils/date').with(dateUtils);
rewiremock('#server/mails/mails').withDefault(mails);
rewiremock('#db/sequelize').with(sequelize);


describe('services/shantytown', () => {
    describe('deleteComment()', () => {
        let deleteComment;

        const user = { id: 0 };
        const author = { id: 1 };
        const shantytownId = 0;
        const commentId = 0;
        const comment = { id: 0, createdBy: { id: 1 }, attachments: [{ id: 1 }, { id: 3 }] };
        const deletionMessage = 'deletionMessage';
        const town = {
            region: null,
            departement: null,
            epci: null,
            city: 0,
            comments: {
                regular: [comment],
                covid: [],
            },
        };
        beforeEach(async () => {
            rewiremock.enable();

            sequelize.sequelize.transaction.resolves(transaction);

            ({ default: deleteComment } = await rewiremock.module(() => import('./deleteComment')));

            permissionUtils.can.returns({
                do: permissionUtils.do,
            });
            permissionUtils.do.returns({
                on: permissionUtils.on,
            });

            shantytownModel.findOne.resolves(town);
            userModel.findOne.resolves(author);
        });

        afterEach(() => {
            rewiremock.disable();
            sandbox.reset();
        });
        it('vérifie que l\'utilisateur a le droit de supprimer le commentaire', async () => {
            try {
                await deleteComment(user, shantytownId, commentId, deletionMessage);
            } catch (error) {
                // ignore
            }
            expect(permissionUtils.can).to.have.been.calledOnceWith(user);
            expect(permissionUtils.do).to.have.been.calledOnceWith('moderate', 'shantytown_comment');
            // eslint-disable-next-line no-unused-expressions
            expect(permissionUtils.on).to.have.been.calledOnce;
        });
        it('si aucune exception n\'est soulevée, supprime le commentaire et ses pièces jointes en bdd et renvoie la liste des commentaires du site à jour', async () => {
            permissionUtils.on.returns(true);
            const commentsUpdated = await deleteComment(user, shantytownId, commentId, deletionMessage);
            expect(attachmentService.deleteAttachment).to.have.been.calledTwice;
            expect(commentsUpdated).to.eql({
                comments: {
                    regular: [],
                    covid: [],
                },
            });
        });

        it('renvoie une exception ServiceError \'fetch_failed\' si le site correspondant au commentaire n\'existe pas en bdd', async () => {
            shantytownModel.findOne.rejects(new Error());
            let responseError;
            try {
                await deleteComment(user, shantytownId, commentId, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si le commentaire à supprimer n\'existe pas en bdd', async () => {
            let responseError;
            try {
                await deleteComment(user, shantytownId, 1, deletionMessage); // 1 est un Id qui ne correspond à aucun commentaire dans notre test
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
        it('renvoie une exception ServiceError \'fetch_failed\' si l\'auteur du commentaire n\'existe pas en bdd', async () => {
            userModel.findOne.rejects(new Error());
            let responseError;
            try {
                await deleteComment(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('fetch_failed');
        });
        it('renvoie une exception ServiceError \'permission_denied\' si l\'utilisateur n\' pas la permission de supprimer le commentaire', async () => {
            permissionUtils.on.returns(false);
            let responseError;
            try {
                await deleteComment(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('permission_denied');
        });
        it('renvoie une exception ServiceError \'data_incomplete\' si le motif de suppression du message est vide', async () => {
            permissionUtils.on.returns(true);
            validator.trim.returns('');
            let responseError;
            try {
                await deleteComment(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('data_incomplete');
        });

        it('renvoie une exception ServiceError \'commit_failed\' si la transaction de suppression des PJ échoue', async () => {
            permissionUtils.on.returns(true);
            transaction.commit.rejects(new Error());
            let responseError;
            try {
                await deleteComment(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('commit_failed');
        });

        it('renvoie une exception ServiceError \'delete_failed\' si le modèle deleteComment échoue', async () => {
            permissionUtils.on.returns(true);
            shantytownCommentModel.deleteComment.rejects(new Error());
            let responseError;
            try {
                await deleteComment(user, shantytownId, 0, deletionMessage);
            } catch (error) {
                responseError = error;
            }
            expect(responseError).to.be.instanceOf(ServiceError);
            expect(responseError.code).to.be.eql('delete_failed');
        });

        it('envoie une notification de suppression du message', async () => {
            permissionUtils.on.returns(true);

            const nationalAdmins = [fakeUser(), fakeUser()];
            userModel.getNationalAdmins.resolves(nationalAdmins);

            try {
                await deleteComment(user, shantytownId, commentId, deletionMessage);
            } catch (error) {
                // ignore
            }

            expect(mails.sendUserCommentDeletion).to.have.been.calledOnce;

            const { args } = mails.sendUserCommentDeletion.getCall(0);
            expect(args[1]).to.have.property('bcc');
            expect(args[1].bcc).to.have.lengthOf(nationalAdmins.length);
            expect(args[1]).to.containSubset({
                bcc: nationalAdmins,
            });
        });
    });
});
