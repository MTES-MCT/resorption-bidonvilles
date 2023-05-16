import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import fakeFile from '#test/utils/file';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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
    createLinkedAttachment: sandbox.stub(),
};
rewiremock('#server/config').withDefault(config);
rewiremock('#server/utils/s3').with({ S3 });
rewiremock('#server/models/attachmentModel').with(attachmentModel);
rewiremock.passBy('@aws-sdk/client-s3');

describe('services/attachment/upload', () => {
    let upload;
    beforeEach(async () => {
        rewiremock.enable();
        ({ default: upload } = await rewiremock.module(() => import('./upload')));
    });
    afterEach(() => {
        rewiremock.disable();
        sandbox.reset();
    });

    it('envoie chaque fichier reçu sur le bucket S3', async () => {
        await upload('shantytown_comment', 1, 1, [fakeFile(), fakeFile(), fakeFile()]);
        expect(S3.send).to.have.been.calledThrice;
    });

    it('les paramètres d\'envoi vers S3 (nom du bucket, du fichier, etc.) sont corrects pour chaque fichier envoyé', async () => {
        const file = fakeFile({
            buffer: global.generate('string'),
        });
        await upload('shantytown_comment', 42, 35, [file]);

        const command = S3.send.getCall(0).args[0];
        expect(command).to.be.an.instanceOf(PutObjectCommand);

        expect(command.input.Bucket, 'Le nom du 1er fichier dans le bucket est incorrect').to.be.eql('fake-bucket');
        expect(command.input.ACL, 'L\'ACL est incorrect').to.be.eql('public-read');
        expect(command.input.Key, 'Le nom du fichier dans le bucket est incorrect').to.be.eql(
            'shantytown_comment_author35_comment42_file1.png',
        );
        expect(command.input.Body, 'Le contenu du fichier est incorrect').to.be.eql(file.buffer);
    });

    it('le nom du fichier inclut le bon préfixe', async () => {
        await upload('action_comment', 1, 1, [fakeFile()]);

        const commands = S3.send.getCalls();
        expect(commands[0].args[0].input.Key).to.be.eql('action_comment_author1_comment1_file1.png');
    });

    it('le nom du fichier inclut la bonne extension en fonction du type mime', async () => {
        await upload('shantytown_comment', 1, 1, [
            fakeFile({ mimetype: 'image/png' }),
            fakeFile({ mimetype: 'image/jpeg' }),
            fakeFile({ mimetype: 'application/pdf' }),
        ]);

        const commands = S3.send.getCalls();

        expect(commands[0].args[0].input.Key).to.be.eql('shantytown_comment_author1_comment1_file1.png');
        expect(commands[1].args[0].input.Key).to.be.eql('shantytown_comment_author1_comment1_file2.jpg');
        expect(commands[2].args[0].input.Key).to.be.eql('shantytown_comment_author1_comment1_file3.pdf');
    });

    it('enregistre chaque attachment en base de données', async () => {
        await upload('shantytown_comment', 1, 1, [fakeFile(), fakeFile(), fakeFile()]);
        expect(attachmentModel.createLinkedAttachment).to.have.been.calledThrice;
    });

    it('les paramètres d\'appel au modèle sont corrects pour chaque fichier', async () => {
        await upload('shantytown_comment', 42, 35, [fakeFile({
            originalname: 'je suis une image.png',
            mimetype: 'image/png',
            size: 1024,
        })]);

        const { args } = attachmentModel.createLinkedAttachment.getCall(0);
        expect(args[0], 'Le nom de l\'entité est incorrect').to.be.eql('shantytown_comment');
        expect(args[1], 'L\'identifiant de l\'entité est incorrect').to.be.eql(42);
        expect(args[2], 'Le nom du fichier S3 est incorrect').to.be.eql(
            'shantytown_comment_author35_comment42_file1.png',
        );
        expect(args[3], 'Le nom original du fichier est incorrect').to.be.eql('je suis une image.png');
        expect(args[4], 'Le type MIME du fichier est incorrect').to.be.eql('image/png');
        expect(args[5], 'La taille du fichier est incorrecte').to.be.eql(1024);
        expect(args[6], 'L\'identifiant de l\'auteur est incorrect').to.be.eql(35);
    });

    it('si une transaction est passée en paramètre, elle est transférée au modèle', async () => {
        await upload('shantytown_comment', 1, 1, [fakeFile()], 'fake-transaction');

        const { args } = attachmentModel.createLinkedAttachment.getCall(0);
        expect(args[7], 'La transaction est manquante').to.be.eql('fake-transaction');
    });

    it('retourne une promesse globale pour l\'ensemble des requêtes', async () => {
        S3.send.resolves(true);
        attachmentModel.createLinkedAttachment.resolves(false);

        const response = await upload('shantytown_comment', 1, 1, [fakeFile(), fakeFile()]);
        expect(response, 'La promesse retournée n\'était pas un Promise.all').to.be.an('array');
        expect(response.length, 'Certaines promesses sont manquantes').to.be.eql(4);
        expect(response, 'La réponse des promesses n\'est pas correcte').to.be.eql([false, true, false, true]);
    });
});
