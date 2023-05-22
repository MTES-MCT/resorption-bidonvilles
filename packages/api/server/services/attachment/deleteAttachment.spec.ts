import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import fakeKeys from '#test/utils/attachmentKeys';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();
const S3 = {
    send: sandbox.stub(),
};
const config = {
    S3: {
        bucket: 'fake-bucket',
    },
};
const attachmentModel = {
    deleteAttachment: sandbox.stub(),
};
rewiremock('#server/config').withDefault(config);
rewiremock('#server/utils/s3').with({ S3 });
rewiremock('#server/models/attachmentModel').with(attachmentModel);
rewiremock.passBy('@aws-sdk/client-s3');

describe('services/attachment/deleteAttachment', () => {
    let deleteAttachment;
    beforeEach(async () => {
        rewiremock.enable();
        ({ default: deleteAttachment } = await rewiremock.module(() => import('./deleteAttachment')));
    });
    afterEach(() => {
        rewiremock.disable();
        sandbox.reset();
    });

    it('supprime l\'attachment de la base de données', async () => {
        await deleteAttachment(fakeKeys({ attachment_id: 1 }));
        expect(attachmentModel.deleteAttachment).to.have.been.calledOnceWithExactly(1);
    });

    it('supprime le fichier original de S3', async () => {
        await deleteAttachment(fakeKeys({
            original_file_key: 'fake-key',
            preview_file_key: null,
        }));
        expect(S3.send, 'La demande de suppression de fichier n\'a pas été faite').to.have.been.calledOnce;

        const { args } = S3.send.getCall(0);
        expect(args[0], 'L\'appel à S3 est incorrect').to.be.an.instanceOf(DeleteObjectCommand);
        expect(args[0].input.Bucket, 'Le bucket est incorrect').to.be.eql(config.S3.bucket);
        expect(args[0].input.Key, 'La clé du fichier à supprimer est incorrect').to.be.eql('fake-key');
    });

    it('supprime le fichier preview de S3', async () => {
        await deleteAttachment(fakeKeys({
            original_file_key: 'fake-key',
            preview_file_key: 'fake-preview-key',
        }));
        expect(S3.send, 'La demande de suppression de fichier n\'a pas été faite').to.have.been.calledTwice;

        const { args } = S3.send.getCall(1);
        expect(args[0], 'L\'appel à S3 est incorrect').to.be.an.instanceOf(DeleteObjectCommand);
        expect(args[0].input.Bucket, 'Le bucket est incorrect').to.be.eql(config.S3.bucket);
        expect(args[0].input.Key, 'La clé du fichier à supprimer est incorrect').to.be.eql('fake-preview-key');
    });

    it('ignore les erreurs S3', async () => {
        S3.send.throws(new Error('fake error'));

        try {
            await deleteAttachment(fakeKeys());
        } catch (error) {
            expect.fail('L\'exception n\'aurait pas du être lancée');
        }
    });

    it('lance une exception si le modèle échoue', async () => {
        const error = new Error('fake error');
        attachmentModel.deleteAttachment.rejects(error);

        try {
            await deleteAttachment(fakeKeys());
        } catch (e) {
            expect(e).to.be.an.instanceOf(ServiceError);
            expect(e.code).to.equal('delete_failed');
            expect(e.nativeError).to.be.an.instanceOf(Error);
            return;
        }

        expect.fail('L\'exception n\'a pas été lancée');
    });
});
