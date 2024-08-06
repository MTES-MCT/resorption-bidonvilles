import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import { fakeFile } from '#test/utils/file';
import fakeQuestion from '#test/utils/question';
import fakeUser from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();
const attachmentService = {
    upload: sandbox.stub(),
};
const questionModel = {
    create: sandbox.stub(),
    findOne: sandbox.stub(),
};
const userModel = {
    getQuestionWatchers: sandbox.stub(),
};
const userQuestionSubscriptionModel = {
    createSubscription: sandbox.stub(),
};
const mails = {
    sendCommunityNewQuestion: sandbox.stub(),
};
const config = {
    testEmail: false,
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

rewiremock('#server/services/attachment').withDefault(attachmentService);
rewiremock('#server/models/questionModel').withDefault(questionModel);
rewiremock('#server/models/userModel').withDefault(userModel);
rewiremock('#server/models/userQuestionSubscriptionModel').withDefault(userQuestionSubscriptionModel);
rewiremock('#server/mails/mails').withDefault(mails);
rewiremock('#server/config').withDefault(config);
rewiremock('#db/sequelize').with(sequelize);

describe('services/question/create', () => {
    let create;
    beforeEach(async () => {
        sequelize.sequelize.transaction.resolves(transaction);
        rewiremock.enable();
        ({ default: create } = await rewiremock.module(() => import('./create')));
    });
    afterEach(() => {
        rewiremock.disable();
        sandbox.reset();
    });

    it('fait appel au service d\'upload', async () => {
        const files = [fakeFile()];
        await create(fakeQuestion(), fakeUser(), files);
        expect(attachmentService.upload).to.have.been.calledOnce;
    });

    it('enregistre chaque fichier en tant que pièce-jointe d\'une question', async () => {
        const files = [fakeFile()];
        await create(fakeQuestion(), fakeUser(), files);
        expect(attachmentService.upload.getCall(0).args[0]).to.be.eql('question');
    });

    it('enregistre chaque fichier avec le bon identifiant de question', async () => {
        const questionId = 42;
        questionModel.create.resolves(questionId);

        const files = [fakeFile()];
        await create(fakeQuestion(), fakeUser(), files);
        expect(attachmentService.upload.getCall(0).args[1]).to.be.eql(42);
    });

    it('enregistre chaque fichier avec le bon identifiant utilisateur', async () => {
        const files = [fakeFile()];
        await create(fakeQuestion(), fakeUser({ id: 42 }), files);
        expect(attachmentService.upload.getCall(0).args[2]).to.be.eql(42);
    });

    it('passe bien la liste de tous les fichiers au service d\'upload', async () => {
        const files = [fakeFile(), fakeFile(), fakeFile()];
        await create(fakeQuestion(), fakeUser(), files);
        expect(attachmentService.upload.getCall(0).args[3]).to.be.eql(files);
    });

    it('enregistre chaque fichier avec la bonne transaction', async () => {
        const files = [fakeFile()];
        await create(fakeQuestion(), fakeUser(), files);
        expect(attachmentService.upload.getCall(0).args[4]).to.be.eql(transaction);
    });

    it('n\'appelle pas le service d\'upload si aucun fichier n\'est fourni', async () => {
        await create(fakeQuestion(), fakeUser(), []);
        expect(attachmentService.upload).to.not.have.been.called;
    });

    it('ne commit l\'enregistrement de la question qu\'une fois les fichiers uploadés', async () => {
        const files = [fakeFile()];
        await create(fakeQuestion(), fakeUser(), files);
        expect(transaction.commit).to.have.been.calledAfter(attachmentService.upload);
    });

    it('fait un rollback si l\'upload des fichiers échoue', async () => {
        const files = [fakeFile()];
        attachmentService.upload.rejects(new Error('une erreur'));
        try {
            await create(fakeQuestion(), fakeUser(), files);
        } catch (error) {
            // ignore
        }

        expect(transaction.rollback).to.have.been.calledOnce;
    });

    it('lance une exception upload_failed si l\'upload des fichiers échoue', async () => {
        const files = [fakeFile()];
        const originalError = new Error('une erreur');
        attachmentService.upload.rejects(originalError);

        try {
            await create(fakeQuestion(), fakeUser(), files);
        } catch (error) {
            expect(error).to.be.an.instanceof(ServiceError);
            expect(error.code, 'Le code de l\'exception est incorrect').to.be.eql('upload_failed');
            expect(error.nativeError, 'L\'erreur native associée à l\'exception incorrect').to.be.eql(originalError);
            return;
        }

        expect.fail('Une exception aurait dû être lancée');
    });
});
