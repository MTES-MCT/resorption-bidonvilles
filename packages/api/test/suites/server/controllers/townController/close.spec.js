const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { mockReq, mockRes } = require('sinon-express-mock');
const { serialized: generateUser } = require('#test/utils/user');

const shantytownService = require('#server/services/shantytown');

const closeStub = sinon.stub(shantytownService, 'close');

const closeController = require('#server/controllers/townController/close');

const { expect } = chai;
chai.use(sinonChai);

describe.only('townController.close()', () => {
    afterEach(() => {
        closeStub.restore();
    });

    describe('Avec un input valide', () => {
        let input;
        let output;
        let res;
        beforeEach(async () => {
            const location = {
                city: {
                    name: 'Chatou',
                    code: '78146',
                },
                epci: {
                    code: '200058519',
                    name: 'CA Saint-Germain Boucles de Seine',
                },
                departement: {
                    name: 'Yvelines',
                    code: '78',
                },
                region: {
                    name: 'Île-de-France',
                    code: '11',
                },
            };

            input = {
                params: { id: 1 },

                body: {
                    closed_at: new Date(2021, 0, 1, 12, 0, 0, 0),
                    closed_with_solutions: true,
                    status: 'closed_by_justice',
                    solutions: [
                        { id: 1, people_affected: 10, households_affected: 5 },
                        { id: 2, people_affected: 20, households_affected: 10 },
                    ],
                    shantytown: {
                        id: 1,
                        ...location,
                        closedAt: null,
                    }, // @todo: remplacer par une donnée générée via utils/shantytown dès que cet utils sera mergé dans develop...
                },

                user: generateUser(),
            };

            output = {
                id: 1,
                ...location,
                closedAt: input.body.closed_at.getTime() / 1000,
            };// @todo: remplacer par une donnée générée via utils/shantytown dès que cet utils sera mergé dans develop...

            closeStub.resolves(output);

            res = mockRes();
            await closeController(mockReq(input), res);
        });

        it('fait appel au service shantytown/close', async () => {
            expect(closeStub).to.have.been.calledOnceWithExactly(
                input.user,
                input.body,
            );
        });


        it('répond une 200', () => {
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('retourne le site en question mis à jour', () => {
            expect(res.send).to.have.been.calledOnceWith(output);
        });
    });

    describe('En cas de dysfonctionnement du service', () => {
        let res;
        let next;
        beforeEach(async () => {
            const input = {
                params: { id: 1 },

                body: {
                    closed_at: new Date(2021, 0, 1, 12, 0, 0, 0),
                    closed_with_solutions: true,
                    status: 'closed_by_justice',
                    solutions: [
                        { id: 1, people_affected: 10, households_affected: 5 },
                        { id: 2, people_affected: 20, households_affected: 10 },
                    ],

                    shantytown: {
                        id: 1,
                        departement: {
                            name: 'Yvelines',
                            code: '78',
                        },
                        closedAt: null,
                    }, // @todo: remplacer par une donnée générée via utils/shantytown dès que cet utils sera mergé dans develop...
                },

                user: generateUser(),
            };

            closeStub.rejects(new Error('Une erreur'));

            res = mockRes();
            next = sinon.stub();
            await closeController(mockReq(input), res, next);
        });

        it('répond une 500', () => {
            expect(res.status).to.have.been.calledOnceWith(500);
        });

        it('retourne un message d\'erreur générique', () => {
            expect(res.send).to.have.been.calledOnceWith({
                error: {
                    user_message: 'Une erreur est survenue dans l\'enregistrement du site en base de données',
                },
            });
        });
    });
});
