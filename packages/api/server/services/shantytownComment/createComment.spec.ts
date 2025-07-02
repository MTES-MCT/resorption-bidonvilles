import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import fakeFile from '#test/utils/file';
import fakeCommentInput from '#test/utils/shantytownCommentInput';
import { ShantytownCommentAuthor } from '#root/types/resources/ShantytownCommentGeneric.d';
import { ShantytownEnrichedComment } from '#root/types/resources/ShantytownCommentEnriched.d';
import scanAttachmentErrors from '../attachment/scanAttachmentErrors';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    shantytownCommentModel: {
        create: sandbox.stub(),
        findOne: sandbox.stub(),
    },
    shantytownCommentTagModel: {
        create: sandbox.stub(),
    },
    shantytownModel: {
        getComments: sandbox.stub(),
    },
    userModel: {
        getShantytownWatchers: sandbox.stub(),
    },
    attachment: {
        upload: sandbox.stub(),
        serializeAttachment: sandbox.stub(),
    },
    mattermostUtils: {
        triggerNewComment: sandbox.stub(),
    },
    mails: {
        sendUserNewComment: sandbox.stub(),
    },
    sequelize: {
        transaction: sandbox.stub(),
    },
    transaction: {
        commit: sandbox.stub(),
        rollback: sandbox.stub(),
    },
    enrichCommentsAttachments: sandbox.stub(),
};

rewiremock('#server/models/shantytownCommentModel').with(stubs.shantytownCommentModel);
rewiremock('#server/models/shantytownCommentTagModel').with(stubs.shantytownCommentTagModel);
rewiremock('#server/models/shantytownModel').with(stubs.shantytownModel);
rewiremock('#server/models/userModel').with(stubs.userModel);
rewiremock('#server/services/attachment').with(stubs.attachment);
rewiremock('#server/utils/mattermost').with(stubs.mattermostUtils);
rewiremock('#server/mails/mails').with(stubs.mails);
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock('../shantytown/_common/enrichCommentsAttachments').with(stubs.enrichCommentsAttachments);
rewiremock('#server/services/attachment/scanAttachmentErrors').with(scanAttachmentErrors);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import createComment from './createComment';
rewiremock.disable();


describe('services/shantytownComment.create', () => {
    let fakeEnrichedComment: () => ShantytownEnrichedComment;
    let fakeAuthor: () => ShantytownCommentAuthor;

    beforeEach(() => {
        fakeAuthor = (): ShantytownCommentAuthor => ({
            id: fakeUser().id,
            first_name: fakeUser().first_name,
            last_name: fakeUser().last_name,
            organization: fakeUser().organization.name,
            organization_id: fakeUser().organization.id,
            position: fakeUser().position,
        });

        fakeEnrichedComment = (): ShantytownEnrichedComment => ({
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
                        original: '',
                        preview: '',
                    },
                    extension: 'text/plain',
                    created_by: '2',
                },
            ],
        });
        stubs.sequelize.transaction.resolves(stubs.transaction);
    });
    afterEach(() => {
        sandbox.reset();
    });

    describe.skip('createComment()', () => {
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
                stubs.shantytownCommentModel.create
                    .resolves(1);

                // createCommentTag() retourne un tableau d'objet identifiant chaque tag du commentaire
                stubs.shantytownCommentTagModel.create
                    .resolves();

                // uploadFiles() retourne une liste d'objets identifiant chaque fichier uploadé
                stubs.attachment.upload.resolves();

                // getComments() retourne une liste de commentaires
                stubs.shantytownModel.getComments
                    .withArgs(input.user, { shantytown: [input.shantytown.id] })
                    .resolves(fakeCommentInput);

                // findOneComment() retourne un commentaire
                stubs.shantytownCommentModel.findOne
                    .withArgs(1)
                    .resolves(output.comment);

                // getShantytownWatchers() retourne une liste d'utilisateurs
                stubs.userModel.getShantytownWatchers
                    .withArgs(input.shantytown.id)
                    .resolves(output.watchers);

                stubs.sequelize.transaction
                    .withArgs([[{ shantytown_comment_id: output.comment.id }]])
                    .resolves(stubs.transaction);
                response = await createComment(input.comment, input.shantytown, input.user);
            });

            it('insère le commentaire en base de données via le modèle shantytownComment/create', () => {
                expect(stubs.shantytownCommentModel.create).to.have.been.calledOnceWith({
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
                expect(stubs.shantytownCommentTagModel.create).to.have.been.calledOnceWith(1, [
                    'conditions_de_vie',
                    'passage_sur_site',
                ]);
            });

            it('envoie une notification mattermost', () => {
                expect(stubs.mattermostUtils.triggerNewComment).to.have.been.calledOnceWith(
                    'Un commentaire',
                    ['Conditions de vie', 'Passage sur site'],
                    input.shantytown,
                    input.user,
                );
            });

            it('envoie une notification mail', () => {
                expect(stubs.mails.sendUserNewComment.callCount).to.be.eql(3);
                expect(stubs.mails.sendUserNewComment).to.have.been.calledWithExactly(output.watchers[0], {
                    variables: {
                        shantytown: input.shantytown,
                        comment: output.comment,
                    },

                });
                expect(stubs.mails.sendUserNewComment).to.have.been.calledWithExactly(output.watchers[1], {
                    variables: {
                        shantytown: input.shantytown,
                        comment: output.comment,
                    },
                });
                expect(stubs.mails.sendUserNewComment).to.have.been.calledWithExactly(output.watchers[2], {
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
            stubs.shantytownModel.getComments.resolves({
                1: [fakeCommentInput()],
            });
            stubs.userModel.getShantytownWatchers.resolves([]);
            stubs.shantytownCommentModel.create.resolves(1);
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
            expect(stubs.attachment.upload).to.have.been.calledOnceWith('shantytown_comment', 1, 2, files, sinon.match.same(stubs.transaction));
            expect(stubs.attachment.upload.getCall(0).args[4]).to.be.eql(stubs.transaction);
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
