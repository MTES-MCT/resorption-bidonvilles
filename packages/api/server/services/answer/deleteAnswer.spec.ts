import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeQuestion } from '#test/utils/question';
import { serialized as fakeAnswer } from '#test/utils/answer';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

// mock all dependencies
const sandbox = sinon.createSandbox();
const stubs = {
    mails: {
        sendAnswerDeletionNotification: sandbox.stub(),
    },
    deleteAnswerModel: sandbox.stub(),
    dateUtils: {
        fromTsToFormat: sandbox.stub().callsFake(ts => (ts ? new Date(ts * 1000).toLocaleDateString('fr-FR') : 'Invalid Date')),
    },
    userModel: {
        findOne: sandbox.stub().resolves(fakeUser()),
    },
    getNationalAdmins: sandbox.stub(),
};
rewiremock.passBy('.*server/utils/date.*');
rewiremock('#server/models/answerModel/delete').with(stubs.deleteAnswerModel);
rewiremock('#server/models/userModel/_common/getNationalAdmins').with(stubs.getNationalAdmins);
rewiremock('#server/mails/mails').with(stubs.mails);
rewiremock('#server/utils/date').with(stubs.dateUtils);
rewiremock('#server/models/userModel').with(stubs.userModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import deleteAnswer from './deleteAnswer';
rewiremock.disable();

describe('services/answer.deleteAnswer()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('supprime la réponse de la base de données', async () => {
        await deleteAnswer(fakeQuestion(), fakeAnswer({ id: 1 }));
        expect(stubs.deleteAnswerModel).to.have.been.calledOnce;
        expect(stubs.deleteAnswerModel).to.have.been.calledOnceWithExactly(1);
    });

    it('en cas d\'erreur de suppression, lance un ServiceError avec le code delete_failed', async () => {
        const originalError = new Error('original error');
        stubs.deleteAnswerModel.rejects(originalError);

        let caughtError;
        try {
            await deleteAnswer(fakeQuestion(), fakeAnswer());
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.an.instanceOf(ServiceError);
        expect(caughtError.code).to.equal('delete_failed');
        expect(caughtError.nativeError).to.equal(originalError);
    });

    it('si une raison est fournie, envoie un mail à l\'auteur de la question', async () => {
        const admins = [fakeUser(), fakeUser()];
        stubs.getNationalAdmins.resolves(admins);
        stubs.userModel.findOne.resolves(fakeUser({ id: 1, status: 'active' }));
        const author = {
            id: 1,
            email: 'jean.dupont@gouv.fr',
            first_name: 'Jean',
            last_name: 'Dupont',
            role: 'collaborator',
            position: 'Test',
            organization: 'DIHAL',
            organization_id: 1,
        };
        await deleteAnswer(fakeQuestion(), fakeAnswer({ createdBy: author }), 'une raison');

        expect(stubs.mails.sendAnswerDeletionNotification).to.have.been.calledOnce;
        expect(stubs.mails.sendAnswerDeletionNotification.getCalls()[0].args[0]).to.deep.equal(author);
    });

    it('le mail d\'alerte est envoyé avec toutes les informations nécessaires (question et réponses concernées, etc.)', async () => {
        const fakeTestAnswer = fakeAnswer({
            description: 'une réponse',
            createdAt: new Date('2020-01-01').getTime() / 1000,
        });
        const admins = [fakeUser(), fakeUser()];
        stubs.getNationalAdmins.resolves(admins);
        stubs.userModel.findOne.resolves(fakeUser({ id: 1, status: 'active' }));
        await deleteAnswer(
            fakeQuestion({ question: 'une question' }),
            fakeTestAnswer,
            'une raison',
        );

        expect(stubs.mails.sendAnswerDeletionNotification).to.have.been.calledOnce;
        const { args } = stubs.mails.sendAnswerDeletionNotification.getCall(0);
        expect(args[1]).to.containSubset({
            variables: {
                message: 'une réponse',
                created_at: stubs.dateUtils.fromTsToFormat(fakeTestAnswer.createdAt),
                question: 'une question',
                reason: 'une raison',
            },
        });
    });

    it('le mail d\'alerte est envoyé en copie cachée à tous les administrateurs nationaux', async () => {
        const fakeTestAnswer = fakeAnswer({
            description: 'une réponse',
            createdAt: new Date('2020-01-01').getTime() / 1000,
        });
        const admins = [fakeUser(), fakeUser()];
        stubs.getNationalAdmins.resolves(admins);
        stubs.userModel.findOne.resolves(fakeUser({ id: 1, status: 'active' }));
        await deleteAnswer(
            fakeQuestion({ question: 'une question' }),
            fakeTestAnswer,
            'une raison',
        );

        expect(stubs.mails.sendAnswerDeletionNotification).to.have.been.calledOnce;
        const { args } = stubs.mails.sendAnswerDeletionNotification.getCall(0);
        expect(args[1]).to.have.property('bcc');
        expect(args[1].bcc).to.have.lengthOf(admins.length);
        expect(args[1]).to.containSubset({
            bcc: admins,
        });
    });

    it('si la liste des administrateurs nationaux ne peut pas être récupérée, envoie tout de même le mail', async () => {
        stubs.getNationalAdmins.rejects(new Error('original error'));
        stubs.userModel.findOne.resolves(fakeUser({ id: 1, status: 'active' }));
        const fakeTestAnswer = fakeAnswer({
            description: 'une réponse',
            createdAt: new Date('2020-01-01').getTime() / 1000,
        });
        await deleteAnswer(fakeQuestion(), fakeTestAnswer, 'une raison');

        expect(stubs.mails.sendAnswerDeletionNotification).to.have.been.calledOnce;
    });

    it('si aucune raison n\'est fournie, n\'envoie pas de mail', async () => {
        await deleteAnswer(fakeQuestion(), fakeAnswer());
        expect(stubs.mails.sendAnswerDeletionNotification).to.not.have.been.called;
    });

    it('ignore les échecs d\'envoi de mail', async () => {
        stubs.mails.sendAnswerDeletionNotification.rejects(new Error('original error'));

        let caughtError;
        try {
            await deleteAnswer(fakeQuestion(), fakeAnswer(), 'une raison');
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.undefined;
    });
});
