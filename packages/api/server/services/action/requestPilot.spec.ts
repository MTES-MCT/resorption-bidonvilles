import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeAction } from '#test/utils/action';
import { AuthUser } from '#server/middlewares/authMiddleware';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiSubset);

const sandbox = sinon.createSandbox();
const stubs = {
    fetch: sandbox.stub(),
    mattermost: {
        triggerRequestActionPilot: sandbox.stub(),
    },
};

rewiremock('#server/utils/mattermost').with(stubs.mattermost);
rewiremock('./fetch').with(stubs.fetch);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import requestPilot from './requestPilot';
rewiremock.disable();

describe('services/action.requestPilot()', () => {
    let user: AuthUser;
    const action = fakeAction();

    beforeEach(() => {
        user = fakeUser();
        user.permissions.action = { read: { allowed: true, allowed_on: null, allowed_on_national: null } };
        stubs.fetch.resolves([action]);
    });

    afterEach(() => {
        sandbox.resetHistory();
    });

    after(() => {
        sandbox.restore();
    });

    it('déclenche une notification Mattermost de demande de pilote', async () => {
        await requestPilot(action.id, user);

        expect(stubs.mattermost.triggerRequestActionPilot).to.have.been.calledOnce;
        expect(stubs.mattermost.triggerRequestActionPilot).to.have.been.calledOnceWithExactly(action, user);
    });

    it('renvoi \'true\' si la demande est bien transmise par message Mattermost', async () => {
        stubs.mattermost.triggerRequestActionPilot.returns(true);
        const result = await requestPilot(action.id, user);

        expect(stubs.mattermost.triggerRequestActionPilot).to.have.been.calledOnce;
        expect(stubs.mattermost.triggerRequestActionPilot).to.have.been.calledOnceWithExactly(action, user);
        expect(result).to.be.true;
    });

    it('renvoi \'false\' si la notification Mattermost échoue', async () => {
        stubs.mattermost.triggerRequestActionPilot.returns(false);

        const result = await requestPilot(action.id, user);

        expect(stubs.mattermost.triggerRequestActionPilot).to.have.been.calledOnce;
        expect(stubs.mattermost.triggerRequestActionPilot).to.have.been.calledOnceWithExactly(action, user);
        expect(result).to.be.false;
    });

    it('renvoi une ServiceError si la requête ne contient pas d\'action', async () => {
        let caughtError: ServiceError | null = null;
        try {
            await requestPilot(null as any, user);
        } catch (err) {
            caughtError = err as ServiceError;
        }

        expect(caughtError).to.be.instanceOf(ServiceError);
        expect(caughtError?.code).to.equal('action_pilot_request_failed');
        expect(caughtError?.nativeError.message).to.equal('Aucune action spécifiée');
    });

    it('renvoi une ServiceError si la requête ne contient pas d\'utilisateur', async () => {
        let caughtError: ServiceError | null = null;
        try {
            await requestPilot(action.id, null as any);
        } catch (err) {
            caughtError = err as ServiceError;
        }

        expect(caughtError).to.be.instanceOf(ServiceError);
        expect(caughtError?.code).to.equal('action_pilot_request_failed');
        expect(caughtError?.nativeError.message).to.equal('Aucun utilisateur spécifié');
    });
});
