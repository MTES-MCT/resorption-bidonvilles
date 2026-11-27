import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { NextFunction } from 'express';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `controllers/action/exportList/action.exportList.ts`.
 *
 * Le controller lit `req.query` DÉJÀ validé, appelle `extractReportFilters(req.query)` (export nommé de
 * `./action.exportList.validator`), puis `actionService.exportActions(req.user, req.params.year, filters)` et
 * termine par `res.end(buffer)`.
 *
 * Contrat de route (non testé ici, aucun pattern de spec de route dans le repo) : `action.exportList.route.ts`
 * DOIT brancher les validateurs de `./action.exportList.validator` (export par défaut) avant le controller,
 * faute de quoi `req.query` n'est pas validé.
 *
 * En cas d'erreur du service, le controller répond avec le code et le `user_message` associés à `error.code`
 * (défaut : 500), puis appelle `next(error.nativeError ?? error)`.
 */
const sandbox = sinon.createSandbox();
const stubs = {
    exportActions: sandbox.stub(),
    extractReportFilters: sandbox.stub(),
};

rewiremock('#server/services/action').with({ exportActions: stubs.exportActions });
rewiremock('./action.exportList.validator').with({ extractReportFilters: stubs.extractReportFilters });

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import ctlExportList from './action.exportList';
rewiremock.disable();

describe('controllers/action/exportList()', () => {
    const buffer = Buffer.from('excel file');

    beforeEach(() => {
        sandbox.reset();
        stubs.exportActions.resolves(buffer);
        stubs.extractReportFilters.returns({});
    });

    after(() => {
        sandbox.restore();
    });

    describe('cas nominal', () => {
        it('extrait les filtres de req.query et les transmet tels quels au service, avec l\'utilisateur et l\'année', async () => {
            const user = fakeUser();
            const query = { status: 'open', topic: 'health' };
            const filters = { status: 'open', topic: ['health'] };
            stubs.extractReportFilters.returns(filters);

            await ctlExportList(
                mockReq({ user, query, params: { year: '2024' } }),
                mockRes(),
                sinon.stub() as unknown as NextFunction,
            );

            expect(stubs.extractReportFilters).to.have.been.calledOnceWith(query);
            expect(stubs.exportActions).to.have.been.calledOnce;
            const [passedUser, passedYear, passedFilters] = stubs.exportActions.firstCall.args;
            expect(passedUser).to.equal(user);
            expect(passedYear).to.equal('2024');
            expect(passedFilters).to.equal(filters);
        });

        it('transmet un objet de filtres vide quand aucun filtre n\'est fourni', async () => {
            await ctlExportList(
                mockReq({ user: fakeUser(), query: {}, params: { year: '2024' } }),
                mockRes(),
                sinon.stub() as unknown as NextFunction,
            );

            expect(stubs.exportActions.firstCall.args[2]).to.deep.equal({});
        });

        it('ne transmet plus de booléen dihalFinancing issu de la query', async () => {
            await ctlExportList(
                mockReq({ user: fakeUser(), query: { dihalFinancing: 'true' }, params: { year: '2024' } }),
                mockRes(),
                sinon.stub() as unknown as NextFunction,
            );

            expect(stubs.exportActions.firstCall.args).to.have.lengthOf(3);
            expect(stubs.exportActions.firstCall.args[2]).to.not.equal(true);
        });

        it('termine la réponse avec le buffer binaire, sans status ni send, et n\'appelle pas next', async () => {
            const res = mockRes();
            const next = sinon.stub();

            await ctlExportList(
                mockReq({ user: fakeUser(), query: {}, params: { year: '2024' } }),
                res,
                next as unknown as NextFunction,
            );

            expect(res.end).to.have.been.calledOnceWith(buffer);
            expect(res.status).to.not.have.been.called;
            expect(res.send).to.not.have.been.called;
            expect(next).to.not.have.been.called;
        });
    });

    describe('erreurs du service', () => {
        const cases = [
            { code: 'no_action_to_export', status: 404, message: 'Aucune action ne correspond aux filtres de la liste : il n\'y a rien à exporter.' },
            { code: 'fetch_failed', status: 400, message: 'Une lecture en base de données a échoué' },
            { code: 'permission_denied', status: 403, message: 'Accès refusé' },
            { code: 'write_failed', status: 500, message: 'Une écriture en base de données a échoué' },
            { code: 'export_failed', status: 500, message: 'Une erreur est survenue lors de la génération du fichier d\'export' },
        ];

        cases.forEach(({ code, status, message }) => {
            describe(`code ${code}`, () => {
                let res;
                let next;
                let nativeError;

                beforeEach(async () => {
                    nativeError = new Error('boom');
                    stubs.exportActions.rejects(new ServiceError(code, nativeError));
                    res = mockRes();
                    next = sinon.stub();

                    await ctlExportList(
                        mockReq({ user: fakeUser(), query: {}, params: { year: '2024' } }),
                        res,
                        next as unknown as NextFunction,
                    );
                });

                it(`répond une ${status} avec le message associé, une seule fois`, () => {
                    expect(res.status).to.have.been.calledOnceWith(status);
                    expect(res.send).to.have.been.calledOnceWith({ user_message: message });
                    expect(res.end).to.not.have.been.called;
                });

                it('passe l\'erreur native à next()', () => {
                    expect(next).to.have.been.calledOnceWith(nativeError);
                });
            });
        });

        it('répond une 500 « Une erreur inconnue est survenue » pour une erreur sans code', async () => {
            const error = new Error('boom');
            stubs.exportActions.rejects(error);
            const res = mockRes();
            const next = sinon.stub();

            await ctlExportList(
                mockReq({ user: fakeUser(), query: {}, params: { year: '2024' } }),
                res,
                next as unknown as NextFunction,
            );

            expect(res.status).to.have.been.calledOnceWith(500);
            expect(res.send).to.have.been.calledOnceWith({ user_message: 'Une erreur inconnue est survenue' });
            expect(res.end).to.not.have.been.called;
            expect(next).to.have.been.calledOnceWith(error);
        });

        it('répond une 500 pour un code inconnu et passe l\'erreur native à next()', async () => {
            const nativeError = new Error('boom');
            const error = new ServiceError('autre_code', nativeError);
            stubs.exportActions.rejects(error);
            const res = mockRes();
            const next = sinon.stub();

            await ctlExportList(
                mockReq({ user: fakeUser(), query: {}, params: { year: '2024' } }),
                res,
                next as unknown as NextFunction,
            );

            expect(res.status).to.have.been.calledOnceWith(500);
            expect(res.send).to.have.been.calledOnceWith({ user_message: 'Une erreur inconnue est survenue' });
            expect(res.end).to.not.have.been.called;
            expect(next).to.have.been.calledOnceWith(nativeError);
        });
    });
});
