import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';

import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeActivity } from '#test/utils/activity';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();

const userModel = {
    getHistory: sandbox.stub(),
};
const shantytownModel = {
    getHistory: sandbox.stub(),
};
const shantytownCommentModel = {
    getHistory: sandbox.stub(),
};

const actionModel = {
    getCommentHistory: sandbox.stub(),
};


rewiremock('#server/models/userModel').withDefault(userModel);
rewiremock('#server/models/shantytownModel').withDefault(shantytownModel);
rewiremock('#server/models/shantytownCommentModel').withDefault(shantytownCommentModel);
rewiremock('#server/models/actionModel').withDefault(actionModel);

describe('services/userActivity.getHistory()', () => {
    let activityTypeFilter = [];
    const user = fakeUser();
    const location = {};
    const resorbedFilter = {};
    const myTownsFilter = {};
    let numberOfActivities = -1;
    const maxDate = 0;
    const lastDate = 0;
    let getHistory;
    beforeEach(async () => {
        rewiremock.enable();
        ({ default: getHistory } = await rewiremock.module(() => import('./getHistory')));
    });
    afterEach(() => {
        rewiremock.disable();
        sandbox.reset();
    });

    it('le service appelle les modèles correspondant au filtre', async () => {
        activityTypeFilter = ['shantytownCreation', 'actionComment'];

        await getHistory(user, location, activityTypeFilter, resorbedFilter, myTownsFilter, numberOfActivities, lastDate, maxDate);
        expect(shantytownModel.getHistory).to.have.been.calledOnce;
        expect(actionModel.getCommentHistory).to.have.been.calledOnce;
        expect(userModel.getHistory).to.not.have.been.called;
        expect(shantytownCommentModel.getHistory).to.not.have.been.called;
    });

    it('le service appelle les modèles  et renvoie la liste triée par date des activités', async () => {
        shantytownModel.getHistory.resolves([fakeActivity({ entity: 'shantytown', date: 11 }), fakeActivity({ entity: 'shantytown', date: 7 })]);
        actionModel.getCommentHistory.resolves([fakeActivity({ entity: 'actionComment', date: 12 }), fakeActivity({ entity: 'actionComment', date: 10 })]);
        userModel.getHistory.resolves([]);
        shantytownCommentModel.getHistory.resolves([fakeActivity({ entity: 'shantytownComment', date: 20 })]);

        activityTypeFilter = ['shantytownCreation', 'actionComment', 'shantytownComment', 'user'];
        const response = await getHistory(user, location, activityTypeFilter, resorbedFilter, myTownsFilter, numberOfActivities, lastDate, maxDate);
        expect(response).to.deep.equal([
            { entity: 'shantytownComment', date: 20 },
            { entity: 'actionComment', date: 12 },
            { entity: 'shantytown', date: 11 },
            { entity: 'actionComment', date: 10 },
            { entity: 'shantytown', date: 7 },
        ]);
    });

    it('coupe le résultat correspondant au nombre d\'activités demandé si le nombre d\'activités est spécifié en paramètres', async () => {
        shantytownModel.getHistory.resolves([fakeActivity({ entity: 'shantytown', date: 11 }), fakeActivity({ entity: 'shantytown', date: 7 })]);
        actionModel.getCommentHistory.resolves([fakeActivity({ entity: 'actionComment', date: 12 }), fakeActivity({ entity: 'actionComment', date: 10 })]);
        userModel.getHistory.resolves([]);
        shantytownCommentModel.getHistory.resolves([fakeActivity({ entity: 'shantytownComment', date: 20 })]);

        numberOfActivities = 3;

        activityTypeFilter = ['shantytownCreation', 'actionComment', 'shantytownComment', 'user'];
        const response = await getHistory(user, location, activityTypeFilter, resorbedFilter, myTownsFilter, numberOfActivities, lastDate, maxDate);
        expect(response).to.deep.equal([
            { entity: 'shantytownComment', date: 20 },
            { entity: 'actionComment', date: 12 },
            { entity: 'shantytown', date: 11 },
        ]);
    });
    it('renvoie une exception ServiceError \'fetch_failed\'  si l\'un des modèles échoue', async () => {
        shantytownModel.getHistory.rejects(new Error('Une erreur'));
        try {
            await getHistory(user, location, activityTypeFilter, resorbedFilter, myTownsFilter, numberOfActivities, lastDate, maxDate);
        } catch (error) {
            expect(error).to.be.instanceOf(ServiceError);
            expect(error.code).to.be.equal('fetch_failed');
            expect(error.message).to.be.equal('Une erreur');
            return;
        }

        expect.fail('Une exception était attendue');
    });
});
