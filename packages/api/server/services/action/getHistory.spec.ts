import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

// stubs
const sandbox = sinon.createSandbox();
const stubs = {
    getHistoryModel: sandbox.stub(),
};

rewiremock('#server/models/actionModel/index').with({
    getHistory: stubs.getHistoryModel,
});

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import getHistory from './getHistory';
rewiremock.disable();

describe('services/action', () => {
    describe('getHistory()', () => {
        afterEach(() => {
            sandbox.reset();
        });

        it(' retourne l\'historique de l\'action', async () => {
            const fakeUser = { id: 1, email: 'test@example.com' };
            const fakeActionId = 186;
            const fakeHistory = [
                {
                    entity: 'action',
                    action: 'update',
                    date: 1711287440,
                    author: {
                        name: 'John Doe',
                        organization: 1,
                    },
                    actionEntity: {
                        id: 186,
                        name: 'Test Action',
                    },
                    diff: [
                        {
                            fieldKey: 'finances',
                            field: 'Financements',
                            oldValue: '2022: 10000€',
                            newValue: '2022: 10000€, 2023: 11000€',
                        },
                    ],
                },
            ];

            stubs.getHistoryModel.withArgs(fakeUser, fakeActionId).resolves(fakeHistory);

            const result = await getHistory(fakeUser as any, fakeActionId);

            expect(stubs.getHistoryModel).to.have.been.calledOnceWith(fakeUser, fakeActionId);
            expect(result).to.deep.equal(fakeHistory);
        });

        it(' lance une ServiceError si le modèle échoue', async () => {
            const fakeUser = { id: 1, email: 'test@example.com' };
            const fakeActionId = 186;
            const fakeError = new Error('Database error');

            stubs.getHistoryModel.withArgs(fakeUser, fakeActionId).rejects(fakeError);

            let error;
            try {
                await getHistory(fakeUser as any, fakeActionId);
            } catch (e) {
                error = e;
            }

            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.equal('fetch_failed');
            expect(error.nativeError).to.equal(fakeError);
        });

        it(' retourne un tableau vide si l\'utilisateur n\'a pas les permissions', async () => {
            const fakeUser = { id: 1, email: 'test@example.com' };
            const fakeActionId = 186;

            stubs.getHistoryModel.withArgs(fakeUser, fakeActionId).resolves([]);

            const result = await getHistory(fakeUser as any, fakeActionId);

            expect(result).to.deep.equal([]);
        });

        it(' retourne l\'historique avec plusieurs modifications', async () => {
            const fakeUser = { id: 1, email: 'test@example.com' };
            const fakeActionId = 186;
            const fakeHistory = [
                {
                    entity: 'action',
                    action: 'update',
                    date: 1711287440,
                    author: {
                        name: 'John Doe',
                        organization: 1,
                    },
                    actionEntity: {
                        id: 186,
                        name: 'Test Action',
                    },
                    diff: [
                        {
                            fieldKey: 'name',
                            field: 'Nom de l\'action',
                            oldValue: 'Ancien nom',
                            newValue: 'Nouveau nom',
                        },
                    ],
                },
                {
                    entity: 'action',
                    action: 'update',
                    date: 1711373840,
                    author: {
                        name: 'Jane Smith',
                        organization: 2,
                    },
                    actionEntity: {
                        id: 186,
                        name: 'Test Action',
                    },
                    diff: [
                        {
                            fieldKey: 'finances',
                            field: 'Financements',
                            oldValue: 'non renseignés',
                            newValue: '2022: 10000€',
                        },
                    ],
                },
            ];

            stubs.getHistoryModel.withArgs(fakeUser, fakeActionId).resolves(fakeHistory);

            const result = await getHistory(fakeUser as any, fakeActionId);

            expect(result).to.have.lengthOf(2);
            expect(result[0].diff[0].fieldKey).to.equal('name');
            expect(result[1].diff[0].fieldKey).to.equal('finances');
        });
    });
});
