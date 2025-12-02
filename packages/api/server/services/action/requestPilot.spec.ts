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
    mattermost: {
        triggerRequestActionPilot: sandbox.stub(),
    },
};

rewiremock('#server/utils/mattermost').with(stubs.mattermost);

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
    });

    afterEach(() => {
        sandbox.resetHistory();
    });

    after(() => {
        sandbox.restore();
    });

    it('déclenche une notification Mattermost de demande de pilote', async () => {
        await requestPilot(action, user);

        expect(stubs.mattermost.triggerRequestActionPilot).to.have.been.calledOnce;
        expect(stubs.mattermost.triggerRequestActionPilot).to.have.been.calledOnceWithExactly(action, user);
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
            await requestPilot(action, null as any);
        } catch (err) {
            caughtError = err as ServiceError;
        }

        expect(caughtError).to.be.instanceOf(ServiceError);
        expect(caughtError?.code).to.equal('action_pilot_request_failed');
        expect(caughtError?.nativeError.message).to.equal('Aucun utilisateur spécifié');
    });

    it('renvoi une ServiceError si la notification Mattermost échoue', async () => {
        stubs.mattermost.triggerRequestActionPilot.rejects(new Error('Mattermost error'));

        let caughtError: ServiceError | null = null;
        try {
            await requestPilot(action, user);
        } catch (err) {
            caughtError = err as ServiceError;
        }

        expect(caughtError).to.be.instanceOf(ServiceError);
        expect(caughtError?.code).to.equal('action_pilot_request_failed');
        expect(caughtError?.nativeError.message).to.equal('Mattermost error');
    });
});
