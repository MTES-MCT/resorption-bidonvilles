import models from '#server/models';
import userModelFactory from '#server/models/userModel';
import mattermostUtils from '#server/utils/mattermost';
import mails from '#server/mails/mails';
import userUtils from '#test/utils/user';
import shantytownWatcherUtils from '#test/utils/shantytownWatcher';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';

import proxyquire from 'proxyquire';

const { serialized: generateUser } = userUtils;

const { default: generateWatcher } = shantytownWatcherUtils;

const userModel = userModelFactory();

const { close } = proxyquire('#server/controllers/townController', {
    '#server/models/userModel': () => userModel,
}).default(models);

const { expect } = chai;
chai.use(sinonChai);

describe('townController.close()', () => {
    const dependencies = {
        shantytownUpdate: undefined,
        shantytownFindOne: undefined,
        triggerShantytownCloseAlert: undefined,
        getLocationWatchers: undefined,
        sendUserShantytownClosed: undefined,
    };
    beforeEach(() => {
        dependencies.shantytownUpdate = sinon.stub(models.shantytown, 'update');
        dependencies.shantytownFindOne = sinon.stub(models.shantytown, 'findOne');
        dependencies.triggerShantytownCloseAlert = sinon.stub(mattermostUtils, 'triggerShantytownCloseAlert');
        dependencies.getLocationWatchers = sinon.stub(userModel, 'getLocationWatchers');
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
                watchers: [
                    generateWatcher(),
                    generateWatcher({ user_id: 3 }),
                    generateWatcher({ user_id: 4 }),
                ],
                shantytown: {
                    id: 1,
                    ...location,
                    closedAt: input.body.closed_at.getTime() / 1000,
                }, // @todo: remplacer par une donnée générée via utils/shantytown dès que cet utils sera mergé dans develop...
            };

            dependencies.getLocationWatchers
                .withArgs({ type: 'city', ...location }, true)
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
