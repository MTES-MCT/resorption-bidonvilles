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
const sharp = sandbox.stub();
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
rewiremock('sharp').with(sharp);
rewiremock('#server/models/attachmentModel').with(attachmentModel);
rewiremock.passBy('@aws-sdk/client-s3');

describe('services/attachment/upload', () => {
    let upload;
    const sharpStubs = {
        resize: null,
        toBuffer: null,
    };
    beforeEach(async () => {
        rewiremock.enable();
        ({ default: upload } = await rewiremock.module(() => import('./upload')));

        sharpStubs.resize = sandbox.stub().returns(sharpStubs);
        sharpStubs.toBuffer = sandbox.stub();
        sharp.returns(sharpStubs);
    });
    afterEach(() => {
        rewiremock.disable();
        sandbox.reset();
    });

    it('génère une miniature pour chaque fichier image', async () => {
        const buffer = Buffer.from('une image');
        await upload('shantytown_comment', 1, 1, [fakeFile({ mimetype: 'image/png', buffer })]);
        expect(sharp).to.have.been.calledWithExactly(buffer);
    });

    it('ne génère pas de miniature pour d\'autres fichiers que des images', async () => {
        await upload('shantytown_comment', 1, 1, [
            fakeFile({ mimetype: 'image/png' }),
            fakeFile({ mimetype: 'image/jpeg' }),
            fakeFile({ mimetype: 'application/pdf' }),
        ]);
        expect(sharp).to.have.been.calledTwice;
    });

    it('les miniatures d\'image sont générées à la bonne taille (50px de large)', async () => {
        await upload('shantytown_comment', 1, 1, [fakeFile({ mimetype: 'image/png' })]);
        expect(sharpStubs.resize).to.have.been.calledOnceWithExactly({ width: 50 });
    });

    it('envoie le bon nombre de fichiers vers S3', async () => {
        await upload('shantytown_comment', 1, 1, [
            fakeFile({ mimetype: 'image/png' }),
            fakeFile({ mimetype: 'image/jpeg' }),
            fakeFile({ mimetype: 'application/pdf' }),
        ]);
        expect(S3.send.callCount, 'Le nombre d\'envois à S3 est incorrect').to.be.eql(5); // 3 fichiers + 2 miniatures
    });

    it('les paramètres d\'envoi vers S3 (nom du bucket, ACL, .) sont corrects pour chaque fichier envoyé', async () => {
        const file = fakeFile({
            buffer: global.generate('string'),
        });
        await upload('shantytown_comment', 42, 35, [file]);

        const command = S3.send.getCall(0).args[0];
        expect(command).to.be.an.instanceOf(PutObjectCommand);

        expect(command.input.Bucket, 'Le nom du bucket est incorrect').to.be.eql('fake-bucket');
        expect(command.input.ACL, 'L\'ACL est incorrect').to.be.eql('public-read');
    });

    it('envoie le bon contenu pour chaque fichier et chaque miniature', async () => {
        const buffers = {
            image: Buffer.from('image'),
            miniature: Buffer.from('image miniature'),
            pdf: Buffer.from('pdf'),
        };
        sharp.withArgs(buffers.image).returns({
            resize: sandbox.stub().returns({
                toBuffer: sandbox.stub().resolves(buffers.miniature),
            }),
        });
        await upload('shantytown_comment', 1, 1, [
            fakeFile({ mimetype: 'application/pdf', buffer: buffers.pdf }),
            fakeFile({ mimetype: 'image/png', buffer: buffers.image }),
        ]);

        const calls = S3.send.getCalls();
        expect(calls[0].args[0].input.Body, 'Le contenu du PDF est incorrect').to.be.eql(buffers.pdf);
        expect(calls[1].args[0].input.Body, 'Le contenu de l\'image est incorrect').to.be.eql(buffers.image);
        expect(calls[2].args[0].input.Body, 'Le contenu de la miniature est incorrect').to.be.eql(buffers.miniature);
    });

    it('le nom de chaque fichier envoyé sur S3 est correct', async () => {
        await upload('shantytown_comment', 1, 1, [
            fakeFile({ mimetype: 'image/png' }),
            fakeFile({ mimetype: 'image/jpeg' }),
            fakeFile({ mimetype: 'application/pdf' }),
        ]);

        const commands = S3.send.getCalls();

        expect(
            commands[0].args[0].input.Key,
            'Le nom du PNG original est incorrect',
        ).to.be.eql('shantytown_comment_author1_comment1_file1.png');
        expect(
            commands[1].args[0].input.Key,
            'Le nom de la miniature du PNG est incorrect',
        ).to.be.eql('shantytown_comment_author1_comment1_file1_min.png');
        expect(
            commands[2].args[0].input.Key,
            'Le nom du JPG original est incorrect',
        ).to.be.eql('shantytown_comment_author1_comment1_file2.jpg');
        expect(
            commands[3].args[0].input.Key,
            'Le nom de la miniature du JPG est incorrect',
        ).to.be.eql('shantytown_comment_author1_comment1_file2_min.jpg');
        expect(
            commands[4].args[0].input.Key,
            'Le nom du PDF est incorrect',
        ).to.be.eql('shantytown_comment_author1_comment1_file3.pdf');
    });

    it('enregistre chaque attachment en base de données', async () => {
        await upload('shantytown_comment', 1, 1, [fakeFile(), fakeFile(), fakeFile()]);
        expect(attachmentModel.createLinkedAttachment).to.have.been.calledThrice;
    });

    it('les paramètres d\'appel au modèle sont corrects', async () => {
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
        expect(args[3], 'Le nom de la miniature S3 est incorrect').to.be.eql(
            'shantytown_comment_author35_comment42_file1_min.png',
        );
        expect(args[4], 'Le nom original du fichier est incorrect').to.be.eql('je suis une image.png');
        expect(args[5], 'Le type MIME du fichier est incorrect').to.be.eql('image/png');
        expect(args[6], 'La taille du fichier est incorrecte').to.be.eql(1024);
        expect(args[7], 'L\'identifiant de l\'auteur est incorrect').to.be.eql(35);
    });

    it('les fichiers qui ne sont pas des images n\'envoient pas de preview', async () => {
        await upload('shantytown_comment', 1, 1, [fakeFile({ mimetype: 'application/pdf' })]);

        const { args } = attachmentModel.createLinkedAttachment.getCall(0);
        expect(args[3], 'Le nom de la miniature S3 ne devrait pas être renseignée').to.be.null;
    });

    it('si une transaction est passée en paramètre, elle est transférée au modèle', async () => {
        await upload('shantytown_comment', 1, 1, [fakeFile()], 'fake-transaction');

        const { args } = attachmentModel.createLinkedAttachment.getCall(0);
        expect(args[8], 'La transaction est manquante').to.be.eql('fake-transaction');
    });

    it('retourne une promesse globale pour l\'ensemble des requêtes', async () => {
        S3.send.resolves(true);
        attachmentModel.createLinkedAttachment.resolves(false);

        const response = await upload('shantytown_comment', 1, 1, [fakeFile(), fakeFile()]);
        expect(response, 'La promesse retournée n\'était pas un Promise.all').to.be.an('array');
        expect(response.length, 'Certaines promesses sont manquantes').to.be.eql(6);
        expect(response, 'La réponse des promesses n\'est pas correcte').to.be.eql([true, true, false, true, true, false]);
    });
});