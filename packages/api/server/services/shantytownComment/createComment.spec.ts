import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import SequelizeMock from 'sequelize-mock';
import ServiceError from '#server/errors/ServiceError';
import shantytownCommentModel from '#server/models/shantytownCommentModel';
import shantytownCommentTagModel from '#server/models/shantytownCommentTagModel';
import shantytownModel from '#server/models/shantytownModel';
import userModel from '#server/models/userModel';
import attachment from '#server/services/attachment';
import mattermostUtils from '#server/utils/mattermost';
import mails from '#server/mails/mails';

import createComment from '#server/services/shantytownComment/createComment';

import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeComment } from '#test/utils/shantytownComment';
import { serialized as fakeShantytown } from '#test/utils/shantytown';

import {fakeFile } from '#test/utils/file';
import { Transaction } from 'sequelize';

chai.use(sinonChai);

const { expect } = chai;


const sequelizeStub = new SequelizeMock();

describe('services/shantytownComment.create', () => {
    const dependencies = {
        createComment: undefined,
        createCommentTag: undefined,
        findOneComment: undefined,
        getComments: undefined,
        triggerNewComment: undefined,
        getShantytownWatchers: undefined,
        sendMail: undefined,
        uploadFiles: undefined,
    };
    beforeEach(() => {
        dependencies.getComments = sinon.stub(shantytownModel, 'getComments');
        dependencies.getShantytownWatchers = sinon.stub(userModel, 'getShantytownWatchers');
        dependencies.createComment = sinon.stub(shantytownCommentModel, 'create');
        dependencies.createCommentTag = sinon.stub(shantytownCommentTagModel, 'create');
        dependencies.findOneComment = sinon.stub(shantytownCommentModel, 'findOne');
        dependencies.triggerNewComment = sinon.stub(mattermostUtils, 'triggerNewComment');
        dependencies.sendMail = sinon.stub(mails, 'sendUserNewComment');
        dependencies.uploadFiles = sinon.stub(attachment, 'upload');
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
                        description: 'description',
                        targets: {
                            users: [{ id: 1 }],
                            organizations: [],
                        },
                        tags: [
                            { uid: 'conditions_de_vie', label: 'Conditions de vie', type: 'ordinaire' },
                            { uid: 'passage_sur_site', label: 'Passage sur site', type: 'ordinaire' },
                        ],
                        files: [],
                    },
                    shantytown: { id: 1 },
                    user: fakeUser(),
                };

                // output data
                output = {
                    watchers: [fakeUser(), fakeUser({ id: 3 }), fakeUser({ id: 4 })],
                    comment: fakeComment(),
                    commentList: [],
                };

                // createComment() retourne un id de commentaire
                dependencies.createComment
                    .resolves(1);

                // createCommentTag() retourne un tableau d'objet identifiant chaque tag du commentaire
                dependencies.createCommentTag
                    .resolves();

                // getComments() retourne une liste de commentaires
                dependencies.getComments
                    .withArgs(input.user, [input.shantytown.id])
                    .resolves({
                        [input.shantytown.id]: output.commentList,
                    });

                // findOneComment() retourne un commentaire
                dependencies.findOneComment
                    .withArgs(1)
                    .resolves(output.comment);

                // getShantytownWatchers() retourne une liste d'utilisateurs
                dependencies.getShantytownWatchers
                    .withArgs(input.shantytown.id)
                    .resolves(output.watchers);

                sequelizeStub.$queueResult([[{ shantytown_comment_id: output.comment.id }]]);
                response = await createComment(input.comment, input.shantytown, input.user);
            });

            it('insère le commentaire en base de données via le modèle shantytownComment/create', () => {
                expect(dependencies.createComment).to.have.been.calledOnceWith({
                    description: 'description',
                    targets: {
                        users: [{ id: 1 }],
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
                    'description',
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
                    comments: output.commentList,
                    numberOfWatchers: output.watchers.length,
                });
            });
        });

        it('les pièces sont bien uploadées', async () => {
            const files = [fakeFile()];
            dependencies.getComments.resolves({});
            dependencies.getShantytownWatchers.resolves([]);
            dependencies.createComment.resolves(1);
            await createComment(fakeComment({
                files,
            }), fakeShantytown(), fakeUser({ id: 5 }));
            expect(dependencies.uploadFiles).to.have.been.calledOnceWith('shantytown_comment', 1, 5, files);
            expect(dependencies.uploadFiles.getCall(0).args[4]).to.be.instanceOf(Transaction);
        });

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
                tags: ['conditions_de_vie'],
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
    });
});
