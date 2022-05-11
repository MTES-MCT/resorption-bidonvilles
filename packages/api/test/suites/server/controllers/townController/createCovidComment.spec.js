/* eslint-disable global-require */

/* **************************************************************************************************
 * TOOLS
 * *********************************************************************************************** */

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);


const { mockReq, mockRes } = require('sinon-express-mock');


const shantytownService = require('#server/services/shantytown');


const createCovidCommentController = require('#server/controllers/townController/createCovidComment');

const ServiceError = require('#server/errors/ServiceError');


/* **************************************************************************************************
 * TESTS
 * *********************************************************************************************** */

describe.only('townController.createCovidComment()', () => {
    /* *******************
     * Common resources
     * **************** */


    let reqArg;
    let comments;
    let createCovidCommentStub;
    beforeEach(() => {
        comments = [{}, {}, {}];
        reqArg = {
            user: {
                id: 42,
            },
            params: {
                id: 42,
            },
            body: {
                date: (new Date(2000, 0, 1)).toString(),
                action_mediation_sante: true,
                sensibilisation_vaccination: true,
                equipe_mobile_depistage: true,
                equipe_mobile_vaccination: true,
                personnes_orientees: true,
                personnes_avec_symptomes: true,
                besoin_action: true,
                description: 'lorem ipsum',
            },
        };
        createCovidCommentStub = sinon.stub(shantytownService, 'createCovidComment');
    });

    afterEach(() => {
        createCovidCommentStub.restore();
    });


    /* *******************
     * Success case
     * **************** */
    it('saves the new comment in database', async () => {
        // setup
        createCovidCommentStub.withArgs(reqArg.user, reqArg.params.id, reqArg.body).resolves([{}, {}, {}]);
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        await createCovidCommentController(req, res);

        // assert
        expect(createCovidCommentStub).to.have.been.calledOnceWith(
            req.user,
            req.params.id,
            reqArg.body,
        );
    });

    it('responds with status 200', async () => {
        // setup
        createCovidCommentStub.withArgs(reqArg.user, reqArg.params.id, reqArg.body).resolves([{}, {}, {}]);
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        await createCovidCommentController(req, res);

        // assert
        expect(createCovidCommentStub).to.have.been.calledOnceWith(
            req.user,
            req.params.id,
            reqArg.body,
        ); expect(res.status).to.have.been.calledOnceWith(200);
    });

    it('responds with the refreshed list of comments', async () => {
        // setup
        createCovidCommentStub.withArgs(reqArg.user, reqArg.params.id, reqArg.body).resolves([{}, {}, {}]);
        const req = mockReq(reqArg);
        const res = mockRes();


        // execute
        await createCovidCommentController(req, res);

        // assert
        expect(createCovidCommentStub).to.have.been.calledOnceWith(
            req.user,
            req.params.id,
            reqArg.body,
        ); expect(res.send).to.have.been.calledOnceWith(comments);
    });

    it('returns the response object', async () => {
        // setup
        createCovidCommentStub.withArgs(reqArg.user, reqArg.params.id, reqArg.body).resolves([{}, {}, {}]);
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        const returnValue = await createCovidCommentController(req, res);

        // assert
        expect(returnValue).to.be.eql(res);
    });


    /* *******************
     * Error case
     * **************** */
    describe('En cas de dysfonctionnement du service', () => {
        let next;
        beforeEach(async () => {
            next = sinon.stub();
        });

        it('répond une 400 si le service renvoie une exception fetch_failed', async () => {
            const req = mockReq(reqArg);
            const res = mockRes();

            createCovidCommentStub.rejects(new ServiceError('fetch_failed', {}));
            await createCovidCommentController(req, res, next);
            expect(res.status).to.have.been.calledOnceWith(400);
        });

        it('répond une 400 si le service renvoie une exception data_incomplete', async () => {
            const req = mockReq(reqArg);
            const res = mockRes();

            createCovidCommentStub.rejects(new ServiceError('data_incomplete', {}));
            await createCovidCommentController(req, res, next);
            expect(res.status).to.have.been.calledOnceWith(400);
        });

        it('répond une 500 si le service renvoie une exception fetch_failed', async () => {
            const req = mockReq(reqArg);
            const res = mockRes();

            createCovidCommentStub.rejects(new ServiceError('write_failed', {}));
            await createCovidCommentController(req, res, next);
            expect(res.status).to.have.been.calledOnceWith(500);
        });

        it('retourne un message d\'erreur générique dans les autres cas d\'erreur', async () => {
            const req = mockReq(reqArg);
            const res = mockRes();
            createCovidCommentStub.rejects(new Error('Une erreur'));
            await createCovidCommentController(req, res, next);
            expect(res.send).to.have.been.calledOnceWith({
                error: {
                    user_message: 'Une erreur inconnue est survenue',
                },
            });
        });
    });
});
