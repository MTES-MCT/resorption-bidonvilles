const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const { mockReq, mockRes } = require('sinon-express-mock');
const { serialized: generateUser } = require('#test/utils/user');
const { default: generateWatcher } = require('#test/utils/shantytownWatcher');

const { sequelize } = require('#db/models');
const models = require('#server/models')(sequelize);
const userModel = require('#server/models/userModel')(sequelize);
const mattermostUtils = require('#server/utils/mattermost');
const mails = require('#server/mails/mails');

const { close } = proxyquire('#server/controllers/townController', {
    '#server/models/userModel': () => userModel,
})(models);

const { expect } = chai;
chai.use(sinonChai);

describe.only('townController.close()', () => {
    const dependencies = {
        shantytownUpdate: undefined,
        shantytownFindOne: undefined,
        triggerShantytownCloseAlert: undefined,
        getDepartementWatchers: undefined,
        sendUserShantytownClosed: undefined,
    };
    beforeEach(() => {
        dependencies.shantytownUpdate = sinon.stub(models.shantytown, 'update');
        dependencies.shantytownFindOne = sinon.stub(models.shantytown, 'findOne');
        dependencies.triggerShantytownCloseAlert = sinon.stub(mattermostUtils, 'triggerShantytownCloseAlert');
        dependencies.getDepartementWatchers = sinon.stub(userModel, 'getDepartementWatchers');
        dependencies.sendUserShantytownClosed = sinon.stub(mails, 'sendUserShantytownClosed');
    });
    afterEach(() => {
        Object.values(dependencies).forEach(stub => stub && stub.restore());
    });

    describe('Avec un input valide', () => {
        let input;
        let output;
        let res;
        beforeEach(async () => {
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
                        departement: {
                            name: 'Yvelines',
                            code: '78',
                        },
                        closedAt: null,
                    }, // @todo: remplacer par une donnée générée via utils/shantytown dès que cet utils sera mergé dans develop...
                },

                user: generateUser(),
            };

            output = {
                watchers: [
                    generateWatcher(),
                    generateWatcher({ user_id: 3 }),
                    generateWatcher({ user_id: 4 }),
                ],
                shantytown: {
                    id: 1,
                    departement: {
                        name: 'Yvelines',
                        code: '78',
                    },
                    closedAt: input.body.closed_at.getTime() / 1000,
                }, // @todo: remplacer par une donnée générée via utils/shantytown dès que cet utils sera mergé dans develop...
            };

            dependencies.getDepartementWatchers
                .withArgs('78')
                .resolves(output.watchers);
            dependencies.shantytownFindOne
                .withArgs(input.user, 1)
                .resolves(output.shantytown);

            res = mockRes();
            await close(mockReq(input), res);
        });

        it('met à jour le site', async () => {
            expect(dependencies.shantytownUpdate).to.have.been.calledOnceWithExactly(
                input.user,
                1,
                {
                    closed_at: input.body.closed_at,
                    closed_with_solutions: input.body.closed_with_solutions,
                    status: input.body.status,
                    closing_solutions: input.body.solutions,
                },
            );
        });

        it('envoie une alerte Mattermost', () => {
            expect(dependencies.triggerShantytownCloseAlert).to.have.been.calledOnce;
        });

        it('envoie une notification mél à tous les watchers, excepté l\'utilisateur courant', () => {
            expect(dependencies.sendUserShantytownClosed).to.have.been.calledWith(
                output.watchers[1],
                sinon.match.any,
            );
            expect(dependencies.sendUserShantytownClosed).to.have.been.calledWith(
                output.watchers[2],
                sinon.match.any,
            );
            expect(dependencies.sendUserShantytownClosed).to.have.been.callCount(2);
        });

        it('répond une 200', () => {
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('retourne le site en question mis à jour', () => {
            expect(res.send).to.have.been.calledOnceWith(output.shantytown);
        });
    });

    describe('En cas de dysfonctionnement de la requête de mise à jour du site', () => {
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

            dependencies.shantytownUpdate.rejects(new Error('Une erreur'));

            res = mockRes();
            next = sinon.stub();
            await close(mockReq(input), res, next);
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
