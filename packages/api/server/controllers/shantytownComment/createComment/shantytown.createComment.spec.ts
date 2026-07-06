import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as fakeUser } from '#test/utils/user';

import shantytownCommentService from '#server/services/shantytownComment';
import ServiceError from '#server/errors/ServiceError';
import { NextFunction } from 'express';
import ctlCreate from './shantytown.createComment';


const { expect } = chai;
chai.use(sinonChai);

describe.skip('controllers/shantytownComment', () => {
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
                        comment: 'description',
                        targets: { users: [], organizations: [] },
                        shantytown,
                    },
                    tags: [{ uid: 'conditions_de_vie', label: 'Conditions de vie' }, { uid: 'passage_sur_site', label: 'Passage sur site' }],
                    user,
                    files: [],
                }),
                mockRes(),
                sinon.stub() as unknown as NextFunction,
            );

            expect(createCommentService).to.have.been.calledOnceWith(
                {
                    description: 'description',
                    targets: { users: [], organizations: [] },
                    tags: [{ uid: 'conditions_de_vie', label: 'Conditions de vie' }, { uid: 'passage_sur_site', label: 'Passage sur site' }],
                    files: [],
                },
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
                        comment: 'description',
                        targets: { users: [{ id: 1 }], organizations: [] },
                        tags: [{ uid: 'conditions_de_vie', label: 'Conditions de vie' }, { uid: 'passage_sur_site', label: 'Passage sur site' }],
                        shantytown: { id: 1 },
                    },
                    user: fakeUser(),
                    files: [],
                }),
                res,
                sinon.stub() as unknown as NextFunction,
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
                error = new Error('insert_failed');
                createCommentService.rejects(new ServiceError('insert_failed', error));

                res = mockRes();
                next = sinon.stub();

                await ctlCreate(
                    mockReq({
                        body: {
                            comment: '',
                            targets: { users: [], organizations: [] },
                            tags: [{ uid: 'conditions_de_vie', label: 'Conditions de vie' }, { uid: 'passage_sur_site', label: 'Passage sur site' }],
                            shantytown: { id: 1 },
                        },
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
                error = new Error('fetch_failed');
                createCommentService.rejects(new ServiceError('fetch_failed', error));

                res = mockRes();
                next = sinon.stub();

                await ctlCreate(
                    mockReq({
                        body: {
                            comment: '',
                            targets: { users: [], organizations: [] },
                            tags: [{ uid: 'conditions_de_vie', label: 'Conditions de vie' }, { uid: 'passage_sur_site', label: 'Passage sur site' }],
                            shantytown: { id: 1 },
                        },
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
                        body: {
                            comment: '',
                            targets: { users: [], organizations: [] },
                            tags: [{ uid: 'conditions_de_vie', label: 'Conditions de vie' }, { uid: 'passage_sur_site', label: 'Passage sur site' }],
                            shantytown: { id: 1 },
                        },
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
