import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();
const getArchivedAttachments = sandbox.stub();
const deleteArchivedAttachments = sandbox.stub();
const mattermost = {
    triggerAttachmentArchiveCleanup: sandbox.stub(),
    triggerAttachmentArchiveCleanupError: sandbox.stub(),
};
const S3 = {
    send: sandbox.stub(),
};
const SUCCESSFUL_DELETE_RESPONSE = {
    $metadata: {
        httpStatusCode: 204,
        requestId: 'tx66ddfeec88af4a8a8dd44-0065afa886',
        extendedRequestId: 'tx66ddfeec88af4a8a8dd44-0065afa886',
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0,
    },
};

rewiremock('#server/models/attachmentModel/getArchives').with(getArchivedAttachments);
rewiremock('#server/models/attachmentModel/deleteArchives').with(deleteArchivedAttachments);
rewiremock('#server/utils/mattermost').with(mattermost);
rewiremock('#server/utils/s3').with({ S3 });
rewiremock.passBy('@aws-sdk/client-s3');

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import cleanArchives from './cleanArchives';
rewiremock.disable();

describe('services/attachment/cleanArchives', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('supprime de S3 tous les fichiers archivés depuis plus de 72h', async () => {
        getArchivedAttachments.resolves([
            { id: 1, key: 'key1', previewKey: 'previewKey1' },
            { id: 2, key: 'key2', previewKey: null },
        ]);
        S3.send.resolves(SUCCESSFUL_DELETE_RESPONSE);

        await cleanArchives();

        expect(S3.send).to.have.been.calledThrice;
        expect(S3.send.getCalls()[0].args[0]).to.be.an.instanceOf(DeleteObjectCommand);
        expect(S3.send.getCalls()[0].args[0].input.Key).to.be.eql('key1');
        expect(S3.send.getCalls()[1].args[0]).to.be.an.instanceOf(DeleteObjectCommand);
        expect(S3.send.getCalls()[1].args[0].input.Key).to.be.eql('previewKey1');
        expect(S3.send.getCalls()[2].args[0]).to.be.an.instanceOf(DeleteObjectCommand);
        expect(S3.send.getCalls()[2].args[0].input.Key).to.be.eql('key2');
    });

    it('supprime de la table des archives les attachments dont tous les fichiers ont pu être supprimés de S3', async () => {
        getArchivedAttachments.resolves([
            { id: 1, key: 'key1', previewKey: 'previewKey1' },
            { id: 2, key: 'key2', previewKey: null },
        ]);
        S3.send.resolves(SUCCESSFUL_DELETE_RESPONSE);

        await cleanArchives();

        expect(deleteArchivedAttachments).to.have.been.calledOnce;
        expect(deleteArchivedAttachments).to.have.been.calledWithExactly([1, 2]);
    });

    it('conserve dans la table des archives les attachments dont au moins un fichier n\'a pas pu être supprimé de S3', async () => {
        getArchivedAttachments.resolves([
            { id: 1, key: 'key1', previewKey: 'previewKey1' },
            { id: 2, key: 'key2', previewKey: null },
            { id: 3, key: 'key3', previewKey: null },
        ]);
        S3.send.resolves(SUCCESSFUL_DELETE_RESPONSE);
        S3.send.onFirstCall().rejects(new Error('fake error'));
        S3.send.onThirdCall().rejects(new Error('fake error'));

        await cleanArchives();

        expect(deleteArchivedAttachments).to.have.been.calledOnce;
        expect(deleteArchivedAttachments).to.have.been.calledWithExactly([3]);
    });

    it('ne supprime rien de la table des archives si aucun fichier n\'a été supprimé de S3', async () => {
        getArchivedAttachments.resolves([
            { id: 1, key: 'key1', previewKey: 'previewKey1' },
        ]);
        S3.send.rejects(new Error('fake error'));

        await cleanArchives();

        expect(deleteArchivedAttachments).to.not.have.been.called;
    });

    it('génère une notification mattermost avec le nombre de fichiers supprimés et le nombre d\'erreurs rencontrées', async () => {
        getArchivedAttachments.resolves([
            { id: 1, key: 'key1', previewKey: 'previewKey1' },
            { id: 2, key: 'key2', previewKey: null },
            { id: 3, key: 'key3', previewKey: null },
        ]);
        S3.send.resolves(SUCCESSFUL_DELETE_RESPONSE);
        S3.send.onFirstCall().rejects(new Error('fake error'));
        S3.send.onSecondCall().rejects(new Error('fake error'));
        S3.send.onThirdCall().rejects(new Error('fake error'));

        await cleanArchives();

        expect(mattermost.triggerAttachmentArchiveCleanup).to.have.been.calledOnce;
        expect(mattermost.triggerAttachmentArchiveCleanup).to.have.been.calledWithExactly(
            3, // nombre d'attachments à supprimer
            2, // nombre d'attachments qui n'ont pas pu être supprimés
        );
    });

    it('génère une notification mattermost si la suppression dans la table d\'archive a échoué', async () => {
        getArchivedAttachments.resolves([
            { id: 1, key: 'key1', previewKey: 'previewKey1' },
        ]);
        S3.send.resolves(SUCCESSFUL_DELETE_RESPONSE);
        deleteArchivedAttachments.rejects(new Error('fake error'));

        await cleanArchives();

        expect(mattermost.triggerAttachmentArchiveCleanupError).to.have.been.calledOnce;
    });
});
