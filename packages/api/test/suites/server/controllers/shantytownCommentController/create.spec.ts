import shantytownCommentService from '#server/services/shantytownComment';
import ctlCreate from '#server/controllers/shantytownCommentController/create';

import ServiceError from '#server/errors/ServiceError';
import userUtils from '#test/utils/user';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { mockReq, mockRes } from 'sinon-express-mock';

const { serialized: fakeUser } = userUtils;

const { expect } = chai;
chai.use(sinonChai);

describe.only('controllers/shantytownComment', () => {
    let createCommentService;
    beforeEach(() => {
        createCommentService = sinon.stub(shantytownCommentService, 'createComment');
    });
    afterEach(() => {
        createCommentService.restore();
    });

    describe('create()', () => {
        it('fait appel au service shantytownComment/createComment() pour insérer le commentaire', async () => {
            const user = fakeUser();
            const shantytown = { id: 1 };

            await ctlCreate(
                mockReq({
                    body: {
                        description: 'description',
                        private: true,
                        shantytown,
                    },
                    user,
                }),
                mockRes(),
                sinon.stub(),
            );

            expect(createCommentService).to.have.been.calledOnceWith(
                { description: 'description', private: true },
                shantytown,
                user,
            );
        });

        it('répond une 200 et la liste des commentaires retournée par le service shantytownComment/createComment()', async () => {
            // le service createComment() retourne une liste de commentaires
            const comments = []; // @todo: utiliser une liste de fakeComments() dès que l'utilitaire est mergé dans develop
            createCommentService.resolves(comments);

            const res = mockRes();
            await ctlCreate(
                mockReq({
                    body: {
                        description: 'description',
                        private: true,
                        shantytown: { id: 1 },
                    },
                    user: fakeUser(),
                }),
                res,
                sinon.stub(),
            );

            expect(res.status).to.have.been.calledOnceWith(200);
            expect(res.send).to.have.been.calledOnceWith({
                comments,
            });
        });

        describe('si le service échoue à insérer le commentaire', () => {
            let res;
            let next;
            let error;
            beforeEach(async () => {
                error = new Error('Une erreur');
                createCommentService.rejects(new ServiceError('insert_failed', error));

                res = mockRes();
                next = sinon.stub();

                await ctlCreate(
                    mockReq({
                        body: { description: '', private: true, shantytown: { id: 1 } },
                        user: fakeUser(),
                    }),
                    res,
                    next,
                );
            });

            it('répond une 500', () => {
                expect(res.status).to.have.been.calledOnceWith(500);
            });

            it('répond un message d\'erreur spécifique', () => {
                expect(res.send).to.have.been.calledOnceWith({
                    user_message: 'Votre commentaire n\'a pas pu être enregistré.',
                });
            });

            it('passe l\'erreur native à next() pour enregistrement auprès de Sentry', () => {
                expect(next).to.have.been.calledOnceWith(error);
            });
        });

        describe('si le service échoue à fetch la liste des commentaires', () => {
            let res;
            let next;
            let error;
            beforeEach(async () => {
                error = new Error('Une erreur');
                createCommentService.rejects(new ServiceError('fetch_failed', error));

                res = mockRes();
                next = sinon.stub();

                await ctlCreate(
                    mockReq({
                        body: { description: '', private: true, shantytown: { id: 1 } },
                        user: fakeUser(),
                    }),
                    res,
                    next,
                );
            });

            it('répond une 500', () => {
                expect(res.status).to.have.been.calledOnceWith(500);
            });

            it('répond un message d\'erreur spécifique', () => {
                expect(res.send).to.have.been.calledOnceWith({
                    user_message: 'Votre commentaire a bien été enregistré mais la liste des commentaires n\'a pas pu être actualisée.',
                });
            });

            it('passe l\'erreur native à next() pour enregistrement auprès de Sentry', () => {
                expect(next).to.have.been.calledOnceWith(error);
            });
        });

        describe('si le service échoue pour une raison inconnue', () => {
            let res;
            let next;
            let error;
            beforeEach(async () => {
                error = new Error('Une erreur');
                createCommentService.rejects(error);

                res = mockRes();
                next = sinon.stub();

                await ctlCreate(
                    mockReq({
                        body: { description: '', private: true, shantytown: { id: 1 } },
                        user: fakeUser(),
                    }),
                    res,
                    next,
                );
            });

            it('répond une 500', () => {
                expect(res.status).to.have.been.calledOnceWith(500);
            });

            it('répond un message d\'erreur spécifique', () => {
                expect(res.send).to.have.been.calledOnceWith({
                    user_message: 'Une erreur inconnue est survenue.',
                });
            });

            it('passe l\'erreur native à next() pour enregistrement auprès de Sentry', () => {
                expect(next).to.have.been.calledOnceWith(error);
            });
        });
    });
});
