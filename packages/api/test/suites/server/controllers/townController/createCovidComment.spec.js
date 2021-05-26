/* eslint-disable global-require */

/* **************************************************************************************************
 * TOOLS
 * *********************************************************************************************** */

const sinon = require('sinon');
const { expect } = require('chai');
const { mockReq, mockRes } = require('sinon-express-mock');


/* **************************************************************************************************
 * FIXTURES
 * *********************************************************************************************** */

const models = {
    shantytown: require('#server/models/shantytownModel')({}),
};
const stubs = {};
const { createCovidComment } = require('#server/controllers/townController')(stubs);


/* **************************************************************************************************
 * TESTS
 * *********************************************************************************************** */

describe.only('townController.createCovidComment()', () => {
    /* *******************
     * Common resources
     * **************** */

    const metadata = {
        date: {
            label: 'La date',
            badFormat: global.generate().not('stringdate'),
        },
        equipe_maraude: {
            label: 'Le champ "Équipe de maraude"',
            badFormat: global.generate().not('boolean'),
        },
        equipe_sanitaire: {
            label: 'Le champ "Équipe sanitaire"',
            badFormat: global.generate().not('boolean'),
        },
        equipe_accompagnement: {
            label: 'Le champ "Équipe d\'accompagnement"',
            badFormat: global.generate().not('boolean'),
        },
        distribution_alimentaire: {
            label: 'Le champ "Distribution d\'aide alimentaire"',
            badFormat: global.generate().not('boolean'),
        },
        personnes_orientees: {
            label: 'Le champ "Personne(s) orientée(s) vers un centre d\'hébergement spécialisé (desserrement)"',
            badFormat: global.generate().not('boolean'),
        },
        personnes_avec_symptomes: {
            label: 'Le champ "Personnes avec des symptômes Covid-19"',
            badFormat: global.generate().not('boolean'),
        },
        besoin_action: {
            label: 'Le champ "Besoin d\'une action prioritaire"',
            badFormat: global.generate().not('boolean'),
        },
        description: {
            label: 'Le commentaire',
            badFormat: global.generate().not(['string', 'stringdate']),
        },
    };

    let reqArg;
    beforeEach(() => {
        reqArg = {
            user: {
                id: 42,
            },
            params: {
                id: 42,
            },
            body: {
                date: (new Date(2000, 0, 1)).toString(),
                equipe_maraude: true,
                equipe_sanitaire: true,
                equipe_accompagnement: true,
                distribution_alimentaire: true,
                personnes_orientees: true,
                personnes_avec_symptomes: true,
                besoin_action: true,
                description: 'lorem ipsum',
            },
        };

        stubs.shantytown = sinon.stub(models.shantytown);

        stubs.shantytown.findOne.withArgs(reqArg.user, reqArg.params.id).resolves({
            builtAt: (new Date(1999, 0, 1)).getTime() / 1000,
        });
    });

    afterEach(() => {
        Object.keys(stubs).forEach((key) => {
            Object.keys(stubs[key]).forEach((method) => {
                stubs[key][method].restore();
            });
        });
    });


    /* *******************
     * Success case
     * **************** */
    it('saves the new comment in database', async () => {
        // setup
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        await createCovidComment(req, res);

        // assert
        expect(stubs.shantytown.createCovidComment).to.have.been.calledOnceWith(
            req.user,
            req.params.id,
            Object.assign({}, reqArg.body, { date: new Date(reqArg.body.date) }),
        );
    });

    it('trims the description', async () => {
        // setup
        reqArg.body.description = `  
           lorem ipsum     `;
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        await createCovidComment(req, res);

        // assert
        expect(stubs.shantytown.createCovidComment).to.have.been.calledOnceWith(
            req.user,
            req.params.id,
            Object.assign({}, reqArg.body, {
                date: new Date(reqArg.body.date),
                description: 'lorem ipsum',
            }),
        );
    });

    it('responds with status 200', async () => {
        // setup
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        await createCovidComment(req, res);

        // assert
        expect(res.status).to.have.been.calledOnceWith(200);
    });

    it('responds with the refreshed list of comments', async () => {
        // setup
        const req = mockReq(reqArg);
        const res = mockRes();

        const comments = [{}, {}, {}];
        stubs.shantytown.getComments
            .withArgs(reqArg.user, [reqArg.params.id], true)
            .resolves({
                [reqArg.params.id]: comments,
            });

        // execute
        await createCovidComment(req, res);

        // assert
        expect(stubs.shantytown.getComments).to.have.been.calledAfter(
            stubs.shantytown.createCovidComment,
        );
        expect(res.send).to.have.been.calledOnceWith(comments);
    });

    it('returns the response object', async () => {
        // setup
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        const returnValue = await createCovidComment(req, res);

        // assert
        expect(returnValue).to.be.eql(res);
    });


    /* *******************
     * Error cases
     * **************** */

    describe('if the shantytown id does not match an existing town', () => {
        let req;
        let res;
        let returnValue;
        beforeEach(async () => {
            // setup
            req = mockReq(reqArg);
            res = mockRes();
            stubs.shantytown.findOne.withArgs(reqArg.user, reqArg.params.id).resolves(null);

            // execute
            returnValue = await createCovidComment(req, res);
        });

        it('does not try to save the comment in database', () => {
            expect(stubs.shantytown.createCovidComment).to.not.have.been.called;
        });

        it('responds with status 404', () => {
            expect(res.status).to.have.been.calledOnceWith(404);
        });

        it('responds with a proper error message', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: `Le site #${reqArg.params.id} n'existe pas`,
                developer_message: `Shantytown #${reqArg.params.id} does not exist`,
            });
        });

        it('returns the response object', () => {
            expect(returnValue).to.be.eql(res);
        });
    });

    // --
    describe('if fetching the town from database fails', () => {
        let req;
        let res;
        beforeEach(async () => {
            // setup
            req = mockReq(reqArg);
            res = mockRes();
            stubs.shantytown.findOne.withArgs(reqArg.user, reqArg.params.id).rejects(
                new Error('Something went wrong'),
            );

            // execute
            await createCovidComment(req, res, sinon.stub());
        });

        it('responds with status 500', () => {
            expect(res.status).to.have.been.calledOnceWith(500);
        });

        it('responds with a proper error message', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: `Une erreur est survenue lors de la vérification de l'existence du site #${reqArg.params.id} en base de données`,
                developer_message: `Failed fetching shantytown #${reqArg.params.id}`,
                details: {
                    error_message: 'Something went wrong',
                },
            });
        });
    });

    // --
    Object.keys(metadata).forEach((name) => {
        describe(`if argument "${name}" is missing`, () => {
            let req;
            let res;
            let returnValue;
            beforeEach(async () => {
                // setup
                delete reqArg.body[name];
                req = mockReq(reqArg);
                res = mockRes();

                // execute
                returnValue = await createCovidComment(req, res);
            });

            it('responds with status 400', () => {
                expect(res.status).to.have.been.calledOnceWith(400);
            });

            it('responds with the proper error message', () => {
                expect(res.send).to.have.been.calledOnceWith({
                    user_message: 'Certains champs du formulaire comportent des erreurs',
                    developer_message: 'Submitted data contains errors',
                    fields: {
                        [name]: [`${metadata[name].label} est obligatoire`],
                    },
                });
            });

            it('returns the response object', () => {
                expect(returnValue).to.be.eql(res);
            });
        });

        describe(`if argument "${name}" is not of good type`, () => {
            let req;
            let res;
            let returnValue;
            beforeEach(async () => {
                // setup
                reqArg.body[name] = metadata[name].badFormat;
                req = mockReq(reqArg);
                res = mockRes();

                // execute
                returnValue = await createCovidComment(req, res);
            });

            it('responds with status 400', () => {
                expect(res.status).to.have.been.calledOnceWith(400);
            });

            it('responds with the proper error message', () => {
                expect(res.send).to.have.been.calledOnceWith({
                    user_message: 'Certains champs du formulaire comportent des erreurs',
                    developer_message: 'Submitted data contains errors',
                    fields: {
                        [name]: [`${metadata[name].label} est obligatoire`],
                    },
                });
            });

            it('returns the response object', () => {
                expect(returnValue).to.be.eql(res);
            });
        });
    });

    // --
    describe('if the date is future', () => {
        let req;
        let res;
        beforeEach(async () => {
            // setup
            const today = new Date();
            reqArg.body.date = (new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())).toString();
            req = mockReq(reqArg);
            res = mockRes();

            // execute
            await createCovidComment(req, res);
        });

        it('responds with status 400', () => {
            expect(res.status).to.have.been.calledOnceWith(400);
        });

        it('responds with the proper error message', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Certains champs du formulaire comportent des erreurs',
                developer_message: 'Submitted data contains errors',
                fields: {
                    date: ['La date ne peut être future'],
                },
            });
        });
    });

    // --
    describe('if the date is older than the town\'s declaration date', () => {
        let req;
        let res;
        beforeEach(async () => {
            // setup
            reqArg.body.date = (new Date(1900, 0, 1)).toString();
            req = mockReq(reqArg);
            res = mockRes();

            // execute
            await createCovidComment(req, res);
        });

        it('responds with status 400', () => {
            expect(res.status).to.have.been.calledOnceWith(400);
        });

        it('responds with the proper error message', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Certains champs du formulaire comportent des erreurs',
                developer_message: 'Submitted data contains errors',
                fields: {
                    date: ['La date ne peut être antérieure à la date d\'installation du site'],
                },
            });
        });
    });

    // --
    describe('if the description is empty', () => {
        let req;
        let res;
        beforeEach(async () => {
            // setup
            reqArg.body.description = '                 ';
            req = mockReq(reqArg);
            res = mockRes();

            // execute
            await createCovidComment(req, res);
        });

        it('responds with status 400', () => {
            expect(res.status).to.have.been.calledOnceWith(400);
        });

        it('responds with the proper error message', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Certains champs du formulaire comportent des erreurs',
                developer_message: 'Submitted data contains errors',
                fields: {
                    description: ['Le commentaire est obligatoire'],
                },
            });
        });
    });

    // --
    describe('if saving the comment in database fails', () => {
        let req;
        let res;
        beforeEach(async () => {
            // setup
            req = mockReq(reqArg);
            res = mockRes();

            stubs.shantytown.createCovidComment
                .withArgs(
                    req.user,
                    req.params.id,
                    Object.assign({}, reqArg.body, {
                        date: new Date(reqArg.body.date),
                        description: 'lorem ipsum',
                    }),
                )
                .rejects(new Error('Something went really wrong'));

            // execute
            await createCovidComment(req, res, sinon.stub());
        });

        it('responds with status 500', () => {
            expect(res.status).to.have.been.calledOnceWith(500);
        });

        it('responds with a proper error message', async () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Une erreur est survenue lors de l\'écriture du commentaire en base de données',
                developer_message: `Failed writing a covid comment for shantytown #${reqArg.params.id}`,
                details: {
                    error_message: 'Something went really wrong',
                },
            });
        });
    });

    // --
    describe('if fetching the refreshed list of comments fails', () => {
        let req;
        let res;
        let returnValue;
        beforeEach(async () => {
            // setup
            req = mockReq(reqArg);
            res = mockRes();

            stubs.shantytown.getComments
                .withArgs(reqArg.user, [reqArg.params.id], true)
                .rejects(new Error('Something went awfully wrong'));

            // execute
            returnValue = await createCovidComment(req, res);
        });

        it('responds with status 200', () => {
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('responds with an empty array', async () => {
            expect(res.send).to.have.been.calledOnceWith([]);
        });

        it('returns the response object', async () => {
            expect(returnValue).to.be.eql(res);
        });
    });
});
