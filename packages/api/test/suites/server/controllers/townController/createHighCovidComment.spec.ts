/* **************************************************************************************************
 * TOOLS
 * *********************************************************************************************** */

import sinon from 'sinon';
import { expect } from 'chai';
import { mockReq, mockRes } from 'sinon-express-mock';


/* **************************************************************************************************
 * FIXTURES
 * *********************************************************************************************** */

import geoModel from '#server/models/geoModel';
import highCovidCommentModel from '#server/models/highCovidCommentModel';

const stubs = {
    getDepartementsFor: undefined,
    create: undefined
};
import townController from '#server/controllers/townController';
const createHighCovidComment = townController.createHighCovidComment();

/* **************************************************************************************************
 * TESTS
 * *********************************************************************************************** */

describe.only('townController.createHighCovidComment()', () => {
    /* *******************
     * Common resources
     * **************** */

    const locations = {
        nation: {
            type: 'nation',
            region: null,
            departement: null,
            epci: null,
            city: null,
        },
        region: {
            type: 'region',
            region: {
                code: '11',
                name: 'Île-de-France',
            },
            departement: null,
            epci: null,
            city: null,
        },
        departement: {
            type: 'departement',
            regionregion: {
                code: '11',
                name: 'Île-de-France',
            },
            departement: {
                code: '78',
                name: 'Yvelines',
            },
            epci: null,
            city: null,
        },
        epci: {
            type: 'epci',
            regionregion: {
                code: '11',
                name: 'Île-de-France',
            },
            departement: {
                code: '75',
                name: 'Paris',
            },
            epci: {
                code: '247800618',
                name: 'CC Coeur d\'Yvelines',
            },
            city: null,
        },
        city: {
            type: 'city',
            regionregion: {
                code: '11',
                name: 'Île-de-France',
            },
            departement: {
                code: '78',
                name: 'Yvelines',
            },
            epci: {
                code: '247800618',
                name: 'CC Coeur d\'Yvelines',
            },
            city: {
                code: '78034',
                name: 'Auteuil',
            },
        },
    };

    const departements = {
        region: [
            { code: '75', name: 'Paris' },
            { code: '77', name: 'Seine-et-Marne' },
            { code: '78', name: 'Yvelines' },
            { code: '91', name: 'Essonne' },
            { code: '92', name: 'Hauts-de-Seine' },
            { code: '93', name: 'Seine-Saint-Denis' },
            { code: '94', name: 'Val-de-Marne' },
            { code: '95', name: 'Val-d\'Oise' },
        ],
        epci: [
            { code: '78', name: 'Yvelines' },
            { code: '75', name: 'Paris' },
        ],
    };

    let reqArg;
    beforeEach(() => {
        reqArg = {
            user: {
                id: 42,
                organization: {
                    id: 666,
                },
            },
            body: {
                description: 'lorem ipsum',
            },
        };

        stubs.getDepartementsFor = sinon.stub(geoModel, 'getDepartementsFor');
        stubs.create = sinon.stub(highCovidCommentModel, 'create');

        stubs.getDepartementsFor.rejects(
            new Error('getDepartementsFor() should not have been called'),
        );
    });

    afterEach(() => {
        sinon.restore();
    });


    /* *******************
     * Success case
     * **************** */
    describe('saves the comment into database', () => {
        ['departement', 'city'].forEach((level) => {
            describe(`if the user is at a ${level} level`, () => {
                it('saves the comment, using the user\'s departement', async () => {
                    // setup
                    reqArg.user.organization.location = Object.assign({}, locations[level]);
                    const req = mockReq(reqArg);
                    const res = mockRes();

                    // execute
                    await createHighCovidComment(req, res, () => { });

                    // assert
                    expect(stubs.create).to.have.been.calledOnceWith(
                        req.user,
                        {
                            description: 'lorem ipsum',
                            departements: ['78'],
                        },
                    );
                });

                it('ignores passed departements', async () => {
                    // setup
                    reqArg.user.organization.location = Object.assign({}, locations[level]);
                    reqArg.body.departements = ['42'];
                    const req = mockReq(reqArg);
                    const res = mockRes();

                    // execute
                    await createHighCovidComment(req, res, () => { });

                    // assert
                    expect(stubs.create).to.have.been.calledOnceWith(
                        req.user,
                        {
                            description: 'lorem ipsum',
                            departements: ['78'],
                        },
                    );
                });
            });
        });

        ['region', 'epci'].forEach((level) => {
            describe(`if the user is at a ${level} level`, () => {
                it('saves the comment, using the departements passed in the request', async () => {
                    // setup
                    reqArg.user.organization.location = Object.assign({}, locations[level]);
                    stubs.getDepartementsFor.withArgs(level, locations[level][level].code).resolves(
                        departements[level],
                    );
                    reqArg.body.departements = ['78'];

                    const req = mockReq(reqArg);
                    const res = mockRes();

                    // execute
                    await createHighCovidComment(req, res, () => { });

                    // assert
                    expect(stubs.create).to.have.been.calledOnceWith(
                        req.user,
                        {
                            description: 'lorem ipsum',
                            departements: ['78'],
                        },
                    );
                });
            });
        });
    });

    it('trims the description', async () => {
        // setup
        reqArg.user.organization.location = locations.departement;
        reqArg.body.description = '   lorem ipsum    ';
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        await createHighCovidComment(req, res, () => { });

        // assert
        expect(stubs.create).to.have.been.calledOnceWith(
            req.user,
            {
                description: 'lorem ipsum',
                departements: ['78'],
            },
        );
    });

    it('responds with a 204', async () => {
        // setup
        reqArg.user.organization.location = locations.departement;
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        await createHighCovidComment(req, res, () => { });

        // assert
        expect(res.status).to.have.been.calledOnceWith(204);
    });

    it('responds with an empty answer', async () => {
        // setup
        reqArg.user.organization.location = locations.departement;
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        await createHighCovidComment(req, res, () => { });

        // assert
        expect(res.send).to.have.been.calledOnceWith({});
    });

    it('returns the response object', async () => {
        // setup
        reqArg.user.organization.location = locations.departement;
        const req = mockReq(reqArg);
        const res = mockRes();

        // execute
        const returnValue = await createHighCovidComment(req, res, () => { });

        // assert
        expect(returnValue).to.be.eql(res);
    });


    /* *******************
     * Error cases
     * **************** */

    describe('if the user is at a nation level', () => {
        let req;
        let res;
        let returnValue;
        beforeEach(async () => {
            // setup
            reqArg.user.organization.location = locations.nation;
            req = mockReq(reqArg);
            res = mockRes();

            // execute
            returnValue = await createHighCovidComment(req, res, () => { });
        });

        it('responds with a 401', async () => {
            expect(res.status).to.have.been.calledOnceWith(401);
        });

        it('responds with the proper error message', async () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Vous n\'avez pas les droits nécessaires pour créer un commentaire',
            });
        });

        it('returns the response object', async () => {
            expect(returnValue).to.be.eql(res);
        });
    });

    ['region', 'epci'].forEach((level) => {
        describe(`if the passed departements does not match the user's ${level}`, () => {
            let req;
            let res;
            let returnValue;
            beforeEach(async () => {
                // setup
                reqArg.user.organization.location = locations[level];
                stubs.getDepartementsFor.withArgs(level, locations[level][level].code).resolves(
                    departements[level],
                );
                reqArg.body.departements = ['33', '78', '52'];
                req = mockReq(reqArg);
                res = mockRes();

                // execute
                returnValue = await createHighCovidComment(req, res, () => { });
            });

            it('responds with a 400', () => {
                expect(res.status).to.have.been.calledOnceWith(400);
            });

            it('responds with the proper error message', () => {
                expect(res.send).to.have.been.calledOnceWith({
                    user_message: 'Vous ne pouvez pas déposer un commentaire pour le(s) département(s) : 33, 52',
                });
            });

            it('returns the response object', () => {
                expect(returnValue).to.be.eql(res);
            });
        });
    });

    describe('if the description is blank', () => {
        let req;
        let res;
        let returnValue;
        beforeEach(async () => {
            // setup
            reqArg.user.organization.location = locations.departement;
            reqArg.body.description = '           ';
            req = mockReq(reqArg);
            res = mockRes();

            // execute
            returnValue = await createHighCovidComment(req, res, () => { });
        });

        it('responds with a 400', () => {
            expect(res.status).to.have.been.calledOnceWith(400);
        });

        it('responds with the proper error message', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Le commentaire ne peut être vide',
            });
        });

        it('returns the response object', () => {
            expect(returnValue).to.be.eql(res);
        });
    });

    describe('if the description is not a string', () => {
        let req;
        let res;
        let returnValue;
        beforeEach(async () => {
            // setup
            reqArg.user.organization.location = locations.departement;
            reqArg.body.description = global.generate().not(['string', 'stringdate']);
            req = mockReq(reqArg);
            res = mockRes();

            // execute
            returnValue = await createHighCovidComment(req, res, () => { });
        });

        it('responds with a 400', () => {
            expect(res.status).to.have.been.calledOnceWith(400);
        });

        it('responds with the proper error message', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Le commentaire ne peut être vide',
            });
        });

        it('returns the response object', () => {
            expect(returnValue).to.be.eql(res);
        });
    });

    describe('if departements are required but...', () => {
        const badValues = [
            {
                value: undefined,
                label: 'undefined',
                error: 'Departements are missing',
            },
            {
                value: [],
                label: 'empty',
                error: 'Departements are empty',
            },
            {
                value: global.generate().not(['undefined', 'array']),
                label: 'not an array',
                error: 'Departements are invalid',
            },
        ];

        badValues.forEach(({ value, label }) => {
            describe(`departements are ${label}`, () => {
                let req;
                let res;
                let returnValue;
                beforeEach(async () => {
                    // setup
                    reqArg.user.organization.location = locations.region;
                    reqArg.body.departements = value;
                    req = mockReq(reqArg);
                    res = mockRes();

                    // execute
                    returnValue = await createHighCovidComment(req, res, () => { });
                });

                it('responds with a 400', () => {
                    expect(res.status).to.have.been.calledOnceWith(400);
                });

                it('responds with the proper error message', () => {
                    expect(res.send).to.have.been.calledOnceWith({
                        user_message: 'Vous devez désigner les départements concernés par ce commentaire',
                    });
                });

                it('returns the response object', () => {
                    expect(returnValue).to.be.eql(res);
                });
            });
        });
    });

    describe('if saving the comment fails', () => {
        let req;
        let res;
        beforeEach(async () => {
            // setup
            reqArg.user.organization.location = locations.departement;
            stubs.create.withArgs(
                reqArg.user,
                {
                    description: 'lorem ipsum',
                    departements: ['78'],
                },
            ).rejects(new Error('Something bad happened'));
            req = mockReq(reqArg);
            res = mockRes();

            // execute
            await createHighCovidComment(req, res, sinon.stub());
        });

        it('responds with a 500', () => {
            expect(res.status).to.have.been.calledOnceWith(500);
        });

        it('responds with the proper error message', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Une erreur est survenue lors de l\'écriture en base de données',
            });
        });
    });
});
