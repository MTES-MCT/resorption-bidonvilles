import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { S3 } from '#server/utils/s3';
import attachmentModel from '#server/models/attachmentModel';
import axios from 'axios';
import { Readable } from 'stream';
import scanAttachment from './scanAttachment';

const { expect } = chai;
chai.use(sinonChai);

describe('scanAttachment', () => {
    let sandbox: sinon.SinonSandbox;
    const mockFile = {
        buffer: Buffer.from('some content'),
        mimetype: 'image/jpeg',
        originalname: 'image.jpg',
        fieldname: 'file',
        encoding: '7bit',
        size: 12345,
        stream: new Readable(),
        destination: 'mock/destination',
        filename: 'mockFilename.jpg',
        path: 'mock/path/image.jpg',
    };

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('ne doit pas uploader un fichier infecté dans le bucket et ne doit pas enregistrer l\'attachment en base de données', async () => {
        // Stub axios pour simuler une réponse de ClamAV indiquant que le fichier est infecté
        sandbox.stub(axios, 'post').resolves({
            status: 406,
            data: { Status: 'FOUND', Description: 'Eicar-Test-Signature' },
        });

        // Stub S3.send pour simuler l'appel et permettre la vérification du nombre d'appels
        const sendStub = sandbox.stub(S3, 'send').resolves();

        // Stub attachmentModel.createLinkedAttachment pour permettre la vérification du nombre d'appels
        const createLinkedAttachmentStub = sandbox.stub(attachmentModel, 'createLinkedAttachment').resolves();

        // Appel à la fonction de scan avec le fichier simulé
        await scanAttachment(mockFile);

        // S'assurer que le fichier n'a pas été téléchargé et qu'aucune entrée n'a été créée
        // Par exemple, on peut vérifier que S3.send n'a pas été appelé
        expect(sendStub.callCount).to.equal(0);
        // Et que attachmentModel.createLinkedAttachment n'a pas été appelé
        expect(createLinkedAttachmentStub.callCount).to.equal(0);
    });
});
