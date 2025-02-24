import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import SequelizeMock from 'sequelize-mock';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import shantytownCommentTagModel from '#server/models/shantytownCommentTagModel';
import shantytownModel from '#server/models/shantytownModel';
import userModel from '#server/models/userModel';
import attachmentService from '#server/services/attachment';
import mattermostUtils from '#server/utils/mattermost';
import mails from '#server/mails/mails';
import createComment from '#server/services/shantytownComment/createComment';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import fakeFile from '#test/utils/file';
import { Transaction } from 'sequelize';
import { serialized as fakeCommentInput } from '#test/utils/shantytownCommentInput';
import { ShantytownCommentAuthor } from '#root/types/resources/ShantytownCommentGeneric.d';
import * as enrichCommentsAttachments from '../shantytown/_common/enrichCommentsAttachments';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';

chai.use(sinonChai);

const { expect } = chai;


const sequelizeStub = new SequelizeMock();

const fakeAuthor = (): ShantytownCommentAuthor => ({
    id: fakeUser().id,
    first_name: fakeUser().first_name,
    last_name: fakeUser().last_name,
    organization: fakeUser().organization.name,
    organization_id: fakeUser().organization.id,
    position: fakeUser().position,
});

const fakeEnrichedComment = (): ShantytownEnrichedComment => ({
    id: 1,
    description: 'Un commentaire',
    createdAt: 1723539551.172,
    organization_target_name: [],
    user_target_name: [],
    createdBy: fakeAuthor(),
    shantytown: 1,
    tags: [
        { uid: 'conditions_de_vie', tag: 'Conditions de vie' },
        { uid: 'passage_sur_site', tag: 'Passage sur site' },
    ],
    attachments: [
        {
            state: 'uploaded',
            id: 1,
            name: 'test1.txt',
            size: 2048,
            urls: {
                original: 'https://s3.gra.io.cloud.ovh.net/rb-attachments-preprod/shantytown_comment_author1_comment1_file1_4c3dba6a-2083-482e-bd43-125086876e7f.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=b4bbbcf0ffb84fbba630c535a349c69e%2F20240813%2Fgra%2Fs3%2Faws4_request&X-Amz-Date=20240813T093044Z&X-Amz-Expires=3600&X-Amz-Signature=92bf82e2119cbe8e074dbba28dc3f085d435ec9df26b62a3c66efaa52ec448f9&X-Amz-SignedHeaders=host&x-id=GetObject',
                preview: '',
            },
            extension: 'text/plain',
            created_by: '2',
        },
    ],
});

describe.skip('services/shantytownComment.create', () => {
    const dependencies = {
        createComment: undefined,
        createCommentTag: undefined,
        findOneComment: undefined,
        getComments: undefined,
        triggerNewComment: undefined,
        getShantytownWatchers: undefined,
        sendMail: undefined,
        uploadFiles: undefined,
        enrichCommentsAttachments: undefined,
        serializeAttachment: undefined,
    };
    beforeEach(() => {
        dependencies.getComments = sinon.stub(shantytownModel, 'getComments');
        dependencies.getShantytownWatchers = sinon.stub(userModel, 'getShantytownWatchers');
        dependencies.createComment = sinon.stub(shantytownCommentModel, 'create');
        dependencies.createCommentTag = sinon.stub(shantytownCommentTagModel, 'create');
        dependencies.findOneComment = sinon.stub(shantytownCommentModel, 'findOne');
        dependencies.triggerNewComment = sinon.stub(mattermostUtils, 'triggerNewComment');
        dependencies.sendMail = sinon.stub(mails, 'sendUserNewComment');
        dependencies.uploadFiles = sinon.stub(attachmentService, 'upload');
        dependencies.serializeAttachment = sinon.stub(attachmentService, 'serializeAttachment');
        dependencies.enrichCommentsAttachments = sinon.stub(enrichCommentsAttachments, 'default');
    });
    afterEach(() => {
        sinon.restore();
    });

    describe('createComment()', () => {
        describe('', () => {
            let input;
            let output;
            let response;
            beforeEach(async () => {
                // input data
                input = {
                    comment: {
                        description: 'Un commentaire',
                        targets: {
                            users: [{ id: 2 }],
                            organizations: [],
                        },
                        tags: [
                            { uid: 'conditions_de_vie', label: 'Conditions de vie', type: 'ordinaire' },
                            { uid: 'passage_sur_site', label: 'Passage sur site', type: 'ordinaire' },
                        ],
                        files: [fakeFile()],
                    },
                    shantytown: { id: 1 },
                    user: fakeUser(),
                };

                // output data
                output = {
                    returnedComment: {
                        1:
                            [
                                {
                                    id: 1,
                                    description: 'Un commentaire',
                                    createdAt: 1723539551.172,
                                    organization_target_name: [],
                                    user_target_name: [],
                                    createdBy: fakeAuthor(),
                                    shantytown: 1,
                                    tags: [
                                        {
                                            uid: 'conditions_de_vie',
                                            label: 'Conditions de vie',
                                        },
                                        {
                                            uid: 'passage_sur_site',
                                            label: 'Passage sur site',
                                        },
                                    ],
                                    attachments: [
                                        '1@.;.@shantytown_comment_author1_comment1_file1_4c3dba6a-2083-482e-bd43-125086876e7f.txt@.;.@@.;.@test1.txt@.;.@text/plain@.;.@1024@.;.@2',
                                    ],
                                },
                            ],
                    },
                    watchers: [fakeUser({ id: 3 }), fakeUser({ id: 4 }), fakeUser({ id: 5 })],
                    comment: fakeEnrichedComment(),
                    commentList: [fakeEnrichedComment()],
                };

                // createComment() retourne un id de commentaire
                dependencies.createComment
                    .resolves(1);

                // createCommentTag() retourne un tableau d'objet identifiant chaque tag du commentaire
                dependencies.createCommentTag
                    .resolves();

                // uploadFiles() retourne une liste d'objets identifiant chaque fichier uploadé
                dependencies.uploadFiles.resolves();

                // getComments() retourne une liste de commentaires
                dependencies.getComments
                    .withArgs(input.user, { shantytown: [input.shantytown.id] })
                    .resolves(fakeCommentInput);

                // findOneComment() retourne un commentaire
                dependencies.findOneComment
                    .withArgs(1)
                    .resolves(output.comment);

                // getShantytownWatchers() retourne une liste d'utilisateurs
                dependencies.getShantytownWatchers
                    .withArgs(input.shantytown.id)
                    .resolves(output.watchers);

                // dependencies.enrichCommentsAttachments
                //     .resolves(fakeEnrichedComment());

                // dependencies.serializeAttachment.resolves({
                //     "state":"uploaded",
                //     "id":1,
                //     "name":"test1.txt",
                //     "size":1024,
                //     "urls": {
                //         "original":"https://s3.gra.io.cloud.ovh.net/rb-attachments-preprod/shantytown_comment_author1_comment1_file1_4c3dba6a-2083-482e-bd43-125086876e7f.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=b4bbbcf0ffb84fbba630c535a349c69e%2F20240813%2Fgra%2Fs3%2Faws4_request&X-Amz-Date=20240813T093044Z&X-Amz-Expires=3600&X-Amz-Signature=92bf82e2119cbe8e074dbba28dc3f085d435ec9df26b62a3c66efaa52ec448f9&X-Amz-SignedHeaders=host&x-id=GetObject",
                //     },
                //     "extension":"text/plain",
                //     "created_by":"2"
                // });

                sequelizeStub.$queueResult([[{ shantytown_comment_id: output.comment.id }]]);
                response = await createComment(input.comment, input.shantytown, input.user);
            });

            it('insère le commentaire en base de données via le modèle shantytownComment/create', () => {
                expect(dependencies.createComment).to.have.been.calledOnceWith({
                    description: 'Un commentaire',
                    targets: {
                        users: [],
                        organizations: [],
                    },
                    fk_shantytown: 1,
                    created_by: 2,
                });
            });

            it('insère les tags du commentaire en base de données via le modèle shantytownCommentTag/create', () => {
                expect(dependencies.createCommentTag).to.have.been.calledOnceWith(1, [
                    'conditions_de_vie',
                    'passage_sur_site',
                ]);
            });

            it('envoie une notification mattermost', () => {
                expect(dependencies.triggerNewComment).to.have.been.calledOnceWith(
                    'Un commentaire',
                    ['Conditions de vie', 'Passage sur site'],
                    input.shantytown,
                    input.user,
                );
            });

            it('envoie une notification mail', () => {
                expect(dependencies.sendMail.callCount).to.be.eql(3);
                expect(dependencies.sendMail).to.have.been.calledWithExactly(output.watchers[0], {
                    variables: {
                        shantytown: input.shantytown,
                        comment: output.comment,
                    },

                });
                expect(dependencies.sendMail).to.have.been.calledWithExactly(output.watchers[1], {
                    variables: {
                        shantytown: input.shantytown,
                        comment: output.comment,
                    },
                });
                expect(dependencies.sendMail).to.have.been.calledWithExactly(output.watchers[2], {
                    variables: {
                        shantytown: input.shantytown,
                        comment: output.comment,
                    },
                });
            });

            it('collecte et retourne la liste des commentaires actualisés', async () => {
                expect(response).to.be.eql({
                    comments: [fakeEnrichedComment()],
                    numberOfWatchers: output.watchers.length,
                });
            });
        });

        it('les pièces sont bien uploadées', async () => {
            const files = [fakeFile()];
            dependencies.getComments.resolves({
                1: [fakeCommentInput()],
            });
            dependencies.getShantytownWatchers.resolves([]);
            dependencies.createComment.resolves(1);
            await createComment(fakeCommentInput({
                files,
            }), fakeShantytown(), fakeUser({ id: 2 }));
            /*
            upload(
                'shantytown_comment',
                commentId,
                author.id,
                comment.files,
                transaction,
            );
            */
            expect(dependencies.uploadFiles).to.have.been.calledOnceWith('shantytown_comment', 1, 2, files, sinon.match.instanceOf(Transaction));
            expect(dependencies.uploadFiles.getCall(0).args[4]).to.be.instanceOf(Transaction);
        });

        /*
        describe('si l\'insertion de commentaires échoue', () => {
            const comment = {
                description: 'description',
                targets: {
                    users: [{ id: 1 }],
                    organizations: [],
                },
            };
            const user = fakeUser();
            const nativeError = new Error('une erreur');
            beforeEach(() => {
                dependencies.createComment
                    .withArgs({
                        description: comment.description,
                        targets: comment.targets,
                        fk_shantytown: 1,
                        created_by: user.id,
                    })
                    .rejects(nativeError);

                dependencies.getShantytownWatchers.resolves([]);
            });

            it('lance une exception de type ServiceError', async () => {
                let exception;
                try {
                    await createComment(comment, { id: 1 }, user);
                } catch (error) {
                    exception = error;
                }

                expect(exception).to.be.instanceOf(ServiceError);
                expect(exception.code).to.be.eql('insert_failed');
                expect(exception.nativeError).to.be.eql(nativeError);
            });
        });

        describe('si la notification mattermost échoue', () => {
            const comment = {
                description: 'description',
                targets: {
                    users: [{ id: 1 }],
                    organizations: [],
                },
                tags: ['conditions_de_vie'],
                tagLabels: ['Conditions de vie'],
                files: [],
            };
            const user = fakeUser();
            const nativeError = new Error('une erreur');
            beforeEach(() => {
                dependencies.triggerNewComment.rejects(nativeError);
                dependencies.getComments.resolves({ 1: [] });
                dependencies.getShantytownWatchers.resolves([]);
            });

            it('aucune exception est lancée ', async () => {
                let exception;
                try {
                    await createComment(comment, { id: 1 }, user);
                } catch (error) {
                    exception = error;
                }

                expect(exception).to.be.undefined;
            });
        });

        describe('si le fetch de commentaires échoue', () => {
            const comment = {
                description: 'description',
                targets: {
                    users: [{ id: 1 }],
                    organizations: [],
                },
                tags: [{ uid: 'conditions_de_vie' }],
                tagLabels: ['Conditions de vie'],
                files: [],
            };
            const user = fakeUser();
            const nativeError = new Error('une erreur');
            beforeEach(() => {
                dependencies.getComments
                    .withArgs(user, [1])
                    .rejects(nativeError);

                dependencies.getShantytownWatchers.resolves([]);
            });


            it('lance une exception de type ServiceError', async () => {
                let exception;
                try {
                    await createComment(comment, { id: 1 }, user);
                } catch (error) {
                    exception = error;
                }

                expect(exception).to.be.instanceOf(ServiceError);
                expect(exception.code).to.be.eql('fetch_failed');
                expect(exception.nativeError).to.be.eql(nativeError);
            });
        });
        */
    });
});
