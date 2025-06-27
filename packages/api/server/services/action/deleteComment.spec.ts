import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import permissionUtils from '#server/utils/permission';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import { AuthUser } from '#server/middlewares/authMiddleware';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    deleteComment: sandbox.stub().resolves({ comments: [] }),
    fetchAction: sandbox.stub(),
    userModel: { findOne: sandbox.stub(), getNationalAdmins: sandbox.stub() },
    enrichCommentsAttachments: sandbox.stub().resolves([]),
    validator: {
        trim: sandbox.stub().callsFake(value => value.trim()),
    },
    dateUtils: {
        fromTsToFormat: sandbox.stub().callsFake(ts => (ts ? new Date(ts).toISOString() : 'Invalid Date')),
        tsToString: sandbox.stub().callsFake(ts => (ts ? new Date(ts * 1000).toLocaleDateString('fr-FR') : 'Invalid Date')),
    },
    mails: {
        sendUserCommentDeletion: sandbox.stub().resolves(),
    },
    can: sandbox.stub(permissionUtils, 'can'),
    do: sandbox.stub(),
    on: sandbox.stub(),
};

rewiremock('#server/models/actionModel').with({
    fetch: stubs.fetchAction,
});
rewiremock('#server/mails/mails').with(stubs.mails);
rewiremock('#server/models/userModel').with(stubs.userModel);
rewiremock('#server/utils/permission').with({ can: stubs.can });
rewiremock('./enrichCommentsAttachments').with(stubs.enrichCommentsAttachments);
rewiremock('#server/models/actionModel/deleteComment/deleteComment').with(stubs.deleteComment);
rewiremock('validator').with(stubs.validator);
rewiremock('#server/utils/date').with(stubs.dateUtils);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deleteActionComment from './deleteComment';
rewiremock.disable();

describe('services/action.deleteComment()', () => {
    let user: AuthUser;
    const deletionMessage = 'Test supression message action';

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

        stubs.userModel.findOne.resolves(user);
        stubs.fetchAction.resolves([fakeAction()]);
        stubs.can.returns({
            do: stubs.do,
        });
        stubs.do.returns({
            on: stubs.on,
        });
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('vérifie que l\'utilisateur a le droit de supprimer le commentaire', async () => {
        const fakeTestUser = fakeUser();
        fakeTestUser.id = 1; // Surcharge l'ID pour ne pas être le propriétaire du message
        try {
            await deleteActionComment(fakeTestUser, fakeAction().id, 1, deletionMessage);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        expect(stubs.can).to.have.been.calledOnceWith(fakeTestUser);
        expect(stubs.do).to.have.been.calledOnceWith('moderate', 'data');
        expect(stubs.on).to.have.been.calledOnce;
    });

    it('si aucune exception n\'est soulevée, supprime le commentaire en bdd et renvoie la liste des commentaires du site à jour', async () => {
        stubs.on.returns(true);
        const commentsUpdated = await deleteActionComment(user, fakeAction().id, 1, deletionMessage);
        expect(stubs.deleteComment).to.have.been.calledOnceWith(1);
        expect(commentsUpdated).to.eql({
            comments: [],
        });
    });

    it('renvoie une exception ServiceError \'fetch_failed\' si le site correspondant au commentaire n\'existe pas en bdd', async () => {
        stubs.fetchAction.rejects(new Error());
        let responseError;
        try {
            await deleteActionComment(user, fakeAction().id, 1, deletionMessage);
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('fetch_failed');
    });

    it('renvoie une exception ServiceError \'fetch_failed\' si le commentaire à supprimer n\'existe pas en bdd', async () => {
        let responseError;
        try {
            await deleteActionComment(user, fakeAction().id, 2, deletionMessage); // 2 est un Id qui ne correspond à aucun commentaire dans notre test
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
            await deleteActionComment(user, fakeAction().id, 0, deletionMessage);
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('fetch_failed');
    });

    it('renvoie une exception ServiceError \'permission_denied\' si l\'utilisateur n\' pas la permission de supprimer le commentaire', async () => {
        user.id = 1;
        const fakeTestUser = fakeUser();

        stubs.deleteComment.resolves({ id: 1, comments: [] });
        let responseError: ServiceError | undefined;
        try {
            await deleteActionComment(fakeTestUser, fakeAction().id, 1, deletionMessage);
        } catch (error) {
            responseError = error;
        }

        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('permission_denied');
    });

    it('renvoie une exception ServiceError \'data_incomplete\' si le motif de suppression du message est vide', async () => {
        stubs.on.returns(true);
        stubs.validator.trim.returns('');
        user.id = 1;
        const fakeTestUser = fakeUser();
        let responseError;
        try {
            await deleteActionComment(fakeTestUser, fakeAction().id, 1, deletionMessage);
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('data_incomplete');
    });

    it('renvoie une exception ServiceError \'delete_failed\' si le modèle deleteComment échoue', async () => {
        stubs.on.returns(true);
        stubs.deleteComment.rejects(new Error());
        let responseError;
        try {
            await deleteActionComment(user, fakeAction().id, 1, deletionMessage);
        } catch (error) {
            responseError = error;
        }
        expect(responseError).to.be.instanceOf(ServiceError);
        expect(responseError.code).to.be.eql('delete_failed');
    });

    it('envoie une notification de suppression du message', async () => {
        stubs.on.returns(true);
        user.id = 1;
        const fakeTestUser = fakeUser();
        const nationalAdmins = [fakeUser(), fakeUser()];
        stubs.userModel.getNationalAdmins.resolves(nationalAdmins);

        try {
            await deleteActionComment(fakeTestUser, fakeAction().id, 1, deletionMessage);
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
