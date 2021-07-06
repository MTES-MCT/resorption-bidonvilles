const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');

chai.use(sinonChai);

const { expect } = chai;
const { sequelize } = require('#db/models');
const shantytownCommentModel = require('#server/models/shantytownComment');
const shantytownModel = require('#server/models/shantytownModel')(sequelize);
const mattermostUtils = require('#server/utils/mattermost');
const userModel = require('#server/models/userModel')(sequelize);
const mailService = require('#server/services/mailService');
const ServiceError = require('#server/errors/ServiceError');

const createComment = proxyquire('#server/services/shantytownComment/createComment', {
    '#server/models/shantytownModel': () => shantytownModel,
    '#server/models/userModel': () => userModel,
});
const { serialized: fakeUser } = require('#test/utils/user');
const { serialized: fakeComment } = require('#test/utils/shantytownComment');


describe.only('services/shantytownComment', () => {
    const dependencies = {
        createComment: undefined,
        findOneComment: undefined,
        getComments: undefined,
        triggerNewComment: undefined,
        getShantytownWatchers: undefined,
        sendMail: undefined,
    };
    beforeEach(() => {
        dependencies.createComment = sinon.stub(shantytownCommentModel, 'create');
        dependencies.findOneComment = sinon.stub(shantytownCommentModel, 'findOne');
        dependencies.getComments = sinon.stub(shantytownModel, 'getComments');
        dependencies.triggerNewComment = sinon.stub(mattermostUtils, 'triggerNewComment');
        dependencies.getShantytownWatchers = sinon.stub(userModel, 'getShantytownWatchers');
        dependencies.sendMail = sinon.stub(mailService, 'send');
    });
    afterEach(() => {
        Object.values(dependencies).forEach(stub => stub && stub.restore());
    });

    describe('createComment()', () => {
        describe('', () => {
            let input;
            let output;
            let response;
            beforeEach(async () => {
                // input data
                input = {
                    comment: { description: 'description', private: true },
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

                // getComments() retourne une liste de commentaires
                dependencies.getComments
                    .withArgs(input.user, [input.shantytown.id], false)
                    .resolves({
                        [input.shantytown.id]: output.commentList,
                    });

                // findOneComment() retourne un commentaire
                dependencies.findOneComment
                    .withArgs(1)
                    .resolves(output.comment);

                // getShantytownWatchers() retourne une liste d'utilisateurs
                dependencies.getShantytownWatchers
                    .withArgs(input.shantytown.id, input.comment.private)
                    .resolves(output.watchers);

                response = await createComment(input.comment, input.shantytown, input.user);
            });

            it('insère le commentaire en base de données via le modèle shantytownComment/create', () => {
                expect(dependencies.createComment).to.have.been.calledOnceWith({
                    description: 'description',
                    private: true,
                    fk_shantytown: 1,
                    created_by: 2,
                });
            });

            it('envoie une notification mattermost', () => {
                expect(dependencies.triggerNewComment).to.have.been.calledOnceWith(
                    'description',
                    input.shantytown,
                    input.user,
                );
            });

            it('envoie une notification mail', () => {
                const annuaireUrl = 'undefined/annuaire/2?pk_campaign=utilisateur-email&pk_kwd=nouveau-commentaire';
                const messageUrl = 'undefined/site/1#newComment';
                const frontUrl = 'undefined?pk_campaign=utilisateur-email&pk_kwd=nouveau-commentaire';
                const backUrl = undefined;
                const recipientName = 'Jean DUPONT';

                expect(dependencies.sendMail.callCount).to.be.eql(3);
                expect(dependencies.sendMail).to.have.been.calledWithExactly('user_new_comment',
                    {
                        recipient: output.watchers[0],
                        variables: {
                            shantytown: input.shantytown, comment: output.comment, annuaireUrl, messageUrl, backUrl, recipientName, frontUrl,
                        },
                        preserveRecipient: false,
                    });
                expect(dependencies.sendMail).to.have.been.calledWithExactly('user_new_comment',
                    {
                        recipient: output.watchers[1],
                        variables: {
                            shantytown: input.shantytown, comment: output.comment, annuaireUrl, messageUrl, backUrl, recipientName, frontUrl,
                        },
                        preserveRecipient: false,
                    });
                expect(dependencies.sendMail).to.have.been.calledWithExactly('user_new_comment',
                    {
                        recipient: output.watchers[2],
                        variables: {
                            shantytown: input.shantytown, comment: output.comment, annuaireUrl, messageUrl, backUrl, recipientName, frontUrl,
                        },
                        preserveRecipient: false,
                    });
            });

            it('collecte et retourne la liste des commentaires actualisés', async () => {
                expect(response).to.be.eql(output.commentList);
            });
        });

        describe('si l\'insertion de commentaires échoue', () => {
            const comment = { description: 'description', private: true };
            const user = fakeUser();
            const nativeError = new Error('une erreur');
            beforeEach(() => {
                dependencies.createComment
                    .withArgs({
                        description: comment.description,
                        private: comment.private,
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
            const comment = { description: 'description', private: true };
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
            const comment = { description: 'description', private: true };
            const user = fakeUser();
            const nativeError = new Error('une erreur');
            beforeEach(() => {
                dependencies.getComments
                    .withArgs(user, [1], false)
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
