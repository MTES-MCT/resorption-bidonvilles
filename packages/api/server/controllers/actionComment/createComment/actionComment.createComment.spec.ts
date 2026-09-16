import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { NextFunction } from 'express';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';

import actionCommentService from '#server/services/actionComment';
import ServiceError from '#server/errors/ServiceError';
import ctlCreate from './actionComment.createComment';

const { expect } = chai;
chai.use(sinonChai);

// un utilisateur avec la permission de créer un commentaire sur une action, à l'échelle nationale
const allowedUser = () => fakeUser({
    permissions: {
        action_comment: {
            create: {
                allowed: true,
                allowed_on_national: true,
                allowed_on: null,
            },
        },
    } as any,
});

// un utilisateur sans la permission de créer un commentaire sur une action
const forbiddenUser = () => fakeUser({
    permissions: {} as any,
});

describe('controllers/actionComment', () => {
    let createCommentService;
    beforeEach(() => {
        createCommentService = sinon.stub(actionCommentService, 'createComment');
    });
    afterEach(() => {
        createCommentService.restore();
    });

    describe('create()', () => {
        it(' fait appel au service actionComment/createComment() pour insérer le commentaire', async () => {
            const user = allowedUser();
            const action = fakeAction();
            createCommentService.resolves({ comment: {}, numberOfObservers: 0 });

            await ctlCreate(
                mockReq({
                    body: {
                        description: 'description',
                        targets: { mode: 'custom', users: [{ id: 1 }], organizations: [] },
                        action,
                    },
                    user,
                    files: [],
                }),
                mockRes(),
                sinon.stub() as unknown as NextFunction,
            );

            expect(createCommentService).to.have.been.calledOnceWith(
                user.id,
                action,
                {
                    description: 'description',
                    targets: { mode: 'custom', users: [{ id: 1 }], organizations: [] },
                    files: [],
                },
            );
        });

        it(' refuse la création avec une 403 si l\'utilisateur n\'a pas les droits suffisants', async () => {
            const res = mockRes();
            const user = forbiddenUser();
            const action = fakeAction();

            await ctlCreate(
                mockReq({
                    body: {
                        description: 'description',
                        targets: { mode: 'public', users: [], organizations: [] },
                        action,
                    },
                    user,
                    files: [],
                }),
                res,
                sinon.stub() as unknown as NextFunction,
            );

            expect(res.status).to.have.been.calledOnceWith(403);
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Vous n\'avez pas les droits suffisants pour créer un commentaire sur cette action',
            });
            expect(createCommentService).to.not.have.been.called;
        });

        it(' répond une 201 et le payload retourné par le service actionComment/createComment()', async () => {
            const response = { comment: { id: 1, description: 'description' }, numberOfObservers: 2 };
            createCommentService.resolves(response);

            const res = mockRes();
            await ctlCreate(
                mockReq({
                    body: {
                        description: 'description',
                        targets: { mode: 'public', users: [], organizations: [] },
                        action: fakeAction(),
                    },
                    user: allowedUser(),
                    files: [],
                }),
                res,
                sinon.stub() as unknown as NextFunction,
            );

            expect(res.status).to.have.been.calledOnceWith(201);
            expect(res.send).to.have.been.calledOnceWith(response);
        });

        describe(' si le service échoue à insérer le commentaire', () => {
            let res;
            let next;
            let error;
            beforeEach(async () => {
                error = new Error('write_fail');
                createCommentService.rejects(new ServiceError('write_fail', error));

                res = mockRes();
                next = sinon.stub();

                await ctlCreate(
                    mockReq({
                        body: {
                            description: '',
                            targets: { mode: 'public', users: [], organizations: [] },
                            action: fakeAction(),
                        },
                        user: allowedUser(),
                        files: [],
                    }),
                    res,
                    next,
                );
            });

            it(' répond une 500', () => {
                expect(res.status).to.have.been.calledOnceWith(500);
            });

            it(' répond un message d\'erreur spécifique', () => {
                expect(res.send).to.have.been.calledOnceWith({
                    user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
                });
            });

            it(' passe l\'erreur native à next() pour enregistrement auprès de Sentry', () => {
                expect(next).to.have.been.calledOnceWith(error);
            });
        });
    });
});
