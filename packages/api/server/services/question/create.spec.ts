import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import fakeFile from '#test/utils/file';
import { serialized as serializedQuestion, input as fakeQuestionInput } from '#test/utils/question';
import fakeUser from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';
import scanAttachmentErrors from '../attachment/scanAttachmentErrors';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    questionModel: {
        create: sandbox.stub(),
        findOne: sandbox.stub(),
    },
    userModel: {
        getQuestionWatchers: sandbox.stub(),
    },
    userQuestionSubscriptionModel: {
        createSubscription: sandbox.stub(),
    },
    mails: {
        sendCommunityNewQuestion: sandbox.stub(),
    },
    config: {
        testEmail: false,
    },
    sequelize: {
        transaction: sandbox.stub(),
    },
    transaction: {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
    },
    uploadAttachments: sandbox.stub(),
    enrichQuestion: sandbox.stub(),
};

rewiremock('#server/services/attachment/upload').with(stubs.uploadAttachments);
rewiremock('#server/services/question/common/enrichQuestion').with(stubs.enrichQuestion);
rewiremock('#server/models/questionModel').with(stubs.questionModel);
rewiremock('#server/models/userModel').with(stubs.userModel);
rewiremock('#server/models/userQuestionSubscriptionModel').with(stubs.userQuestionSubscriptionModel);
rewiremock('#server/mails/mails').with(stubs.mails);
rewiremock('#server/config').with(stubs.config);
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('#server/services/attachment/scanAttachmentErrors').with(scanAttachmentErrors);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import create from './create';
rewiremock.disable();

describe('services/question/create', () => {
    beforeEach(async () => {
        stubs.sequelize.transaction.resolves(stubs.transaction);
    });
    afterEach(() => {
        sandbox.reset();
    });

    it('fait appel au service d\'upload', async () => {
        const files = [fakeFile()];
        stubs.enrichQuestion.resolves(serializedQuestion);
        await create(fakeQuestionInput(), fakeUser(), files);
        expect(stubs.uploadAttachments).to.have.been.calledOnce;
    });

    it('enregistre chaque fichier en tant que pièce-jointe d\'une question', async () => {
        const files = [fakeFile()];
        await create(fakeQuestionInput(), fakeUser(), files);
        expect(stubs.uploadAttachments.getCall(0).args[0]).to.be.eql('question');
    });

    it('enregistre chaque fichier avec le bon identifiant de question', async () => {
        const questionId = 42;
        stubs.questionModel.create.resolves(questionId);

        const files = [fakeFile()];
        await create(fakeQuestionInput(), fakeUser(), files);
        expect(stubs.uploadAttachments.getCall(0).args[1]).to.be.eql(42);
    });

    it('enregistre chaque fichier avec le bon identifiant utilisateur', async () => {
        const files = [fakeFile()];
        await create(fakeQuestionInput(), fakeUser({ id: 42 }), files);
        expect(stubs.uploadAttachments.getCall(0).args[2]).to.be.eql(42);
    });

    it('passe bien la liste de tous les fichiers au service d\'upload', async () => {
        const files = [fakeFile(), fakeFile(), fakeFile()];
        await create(fakeQuestionInput(), fakeUser(), files);
        expect(stubs.uploadAttachments.getCall(0).args[3]).to.be.eql(files);
    });

    it('enregistre chaque fichier avec la bonne transaction', async () => {
        const files = [fakeFile()];
        await create(fakeQuestionInput(), fakeUser(), files);
        expect(stubs.uploadAttachments.getCall(0).args[4]).to.be.eql(stubs.transaction);
    });

    it('n\'appelle pas le service d\'upload si aucun fichier n\'est fourni', async () => {
        await create(fakeQuestionInput(), fakeUser(), []);
        expect(stubs.uploadAttachments).to.not.have.been.called;
    });

    it('ne commit l\'enregistrement de la question qu\'une fois les fichiers uploadés', async () => {
        const files = [fakeFile()];
        await create(fakeQuestionInput(), fakeUser(), files);
        expect(stubs.transaction.commit).to.have.been.calledAfter(stubs.uploadAttachments);
    });

    it('fait un rollback si l\'upload des fichiers échoue', async () => {
        const files = [fakeFile()];
        stubs.uploadAttachments.rejects(new Error('une erreur'));
        try {
            await create(fakeQuestionInput(), fakeUser(), files);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        expect(stubs.transaction.rollback).to.have.been.calledOnce;
    });

    it('lance une exception upload_failed si l\'upload des fichiers échoue', async () => {
        const files = [fakeFile()];
        const originalError = new Error('420');
        stubs.uploadAttachments.rejects(originalError);

        try {
            await create(fakeQuestionInput(), fakeUser(), files);
        } catch (error) {
            expect(error).to.be.an.instanceof(ServiceError);
            expect(error.code).to.be.eql(originalError.message);
            expect(error.nativeError).to.be.eql('upload_failed');
            return;
        }

        expect.fail('Une exception aurait dû être lancée');
    });
});
