import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeAction } from '#test/utils/action';
import { serialized as fakeActionComment } from '#test/utils/actionComment';

const { expect } = chai;
chai.use(sinonChai);
chai.use(chaiAsPromised);

// stubs
const sandbox = sinon.createSandbox();
const stubs = {
    tchap: {
        triggerNewActionComment: sandbox.stub(),
    },
};

rewiremock('#server/utils/tchap').with(stubs.tchap);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import sendNotification from './createComment.sendNotification';
rewiremock.disable();

function createDeferred(): { promise: Promise<void>, resolve: () => void } {
    let resolve: () => void = () => {};
    const promise = new Promise<void>((resolvePromise) => {
        resolve = resolvePromise;
    });
    return { promise, resolve };
}

function nextTick(): Promise<void> {
    return new Promise<void>((resolve) => {
        setImmediate(resolve);
    });
}

describe('services/actionComment.createComment.sendNotification()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    it('appelle triggerNewActionComment une fois avec la description, l\'action et l\'auteur du commentaire', async () => {
        stubs.tchap.triggerNewActionComment.resolves();
        const action = fakeAction();
        const comment = fakeActionComment();

        await sendNotification(action, comment);

        expect(stubs.tchap.triggerNewActionComment).to.have.been.calledOnceWithExactly(
            comment.description,
            action,
            comment.createdBy,
        );
    });

    it('ne se résout qu\'après la résolution de la promesse du trigger', async () => {
        const deferred = createDeferred();
        stubs.tchap.triggerNewActionComment.returns(deferred.promise);

        let settled = false;
        const result = sendNotification(fakeAction(), fakeActionComment()).then(() => {
            settled = true;
        });

        await nextTick();
        expect(settled).to.be.false;

        deferred.resolve();
        await result;
        expect(settled).to.be.true;
    });

    it('se résout avec undefined', async () => {
        stubs.tchap.triggerNewActionComment.resolves('valeur du trigger');

        const result = await sendNotification(fakeAction(), fakeActionComment());

        expect(result).to.be.undefined;
    });

    it('rejette avec la même erreur si le trigger rejette', async () => {
        const error = new Error('échec');
        stubs.tchap.triggerNewActionComment.rejects(error);

        let caught: unknown;
        try {
            await sendNotification(fakeAction(), fakeActionComment());
        } catch (e) {
            caught = e;
        }

        expect(caught).to.equal(error);
        stubs.tchap.triggerNewActionComment.rejects(new Error('échec'));
        await expect(sendNotification(fakeAction(), fakeActionComment())).to.be.rejectedWith('échec');
    });

    it('n\'émet aucun unhandledRejection quand le trigger rejette', async () => {
        const events: unknown[] = [];
        function onUnhandledRejection(reason: unknown): void {
            events.push(reason);
        }

        stubs.tchap.triggerNewActionComment.rejects(new Error('échec'));
        process.on('unhandledRejection', onUnhandledRejection);
        try {
            await sendNotification(fakeAction(), fakeActionComment()).catch(() => {});
            await nextTick();
            await nextTick();
        } finally {
            process.removeListener('unhandledRejection', onUnhandledRejection);
        }

        expect(events).to.have.length(0);
    });

    it('rejette (sans exception synchrone) si le trigger lève une exception synchrone', async () => {
        stubs.tchap.triggerNewActionComment.throws(new Error('échec synchrone'));

        let returned: Promise<void> | undefined;
        expect(() => {
            returned = sendNotification(fakeAction(), fakeActionComment());
        }).to.not.throw();

        await expect(returned).to.be.rejectedWith('échec synchrone');
    });
});
