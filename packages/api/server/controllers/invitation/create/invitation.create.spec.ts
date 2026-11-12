import chai from 'chai';
import sinon from 'sinon';
import { type Response } from 'express';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { InvitationCreateRequest } from '#root/types/resources/InvitationCreateRequestInterface.d';

const { expect } = chai;
chai.use(sinonChai);

type Deferred = {
    promise: Promise<void>,
    resolve: () => void,
};

// stubs
const sandbox = sinon.createSandbox();
const stubs = {
    mails: {
        sendUserPlatformInvitation: sandbox.stub(),
    },
    tchap: {
        triggerPeopleInvitedAlert: sandbox.stub(),
    },
    userModel: {
        formatName: sandbox.stub(),
        findOneByEmail: sandbox.stub(),
    },
    sentry: {
        captureException: sandbox.stub(),
    },
};

rewiremock('#server/mails/mails').with(stubs.mails);
rewiremock('#server/utils/tchap').with(stubs.tchap);
rewiremock('#server/models/userModel').with(stubs.userModel);
rewiremock('@sentry/node').with(stubs.sentry);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import invitationCreate from './invitation.create';
rewiremock.disable();

function createDeferred(): Deferred {
    let resolve: () => void;
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

function callController(req: unknown, res: unknown): Promise<void | Response> {
    return invitationCreate(req as InvitationCreateRequest, res as Response);
}

const greeter = {
    first_name: 'Alice',
    last_name: 'Inviteuse',
    email: 'alice.inviteuse@example.test',
};

const guests = [
    { first_name: 'Bob', last_name: 'Invité', email: 'bob.invite@example.test' },
    { first_name: 'Carole', last_name: 'Invitée', email: 'carole.invitee@example.test' },
];

describe('controllers/invitation.create()', () => {
    let res: { status: sinon.SinonStub, send: sinon.SinonStub };
    let consoleErrorStub: sinon.SinonStub;

    function buildReq(overrides: Record<string, unknown> = {}) {
        return {
            body: {
                greeter,
                guests: guests.map(guest => ({ ...guest, extra: 'à ignorer' })),
                invite_from: 'navbar',
                ...overrides,
            },
        };
    }

    beforeEach(() => {
        sandbox.reset();
        res = {
            status: sandbox.stub(),
            send: sandbox.stub(),
        };
        res.status.returns(res);
        consoleErrorStub = sinon.stub(console, 'error');

        stubs.mails.sendUserPlatformInvitation.resolves();
        stubs.tchap.triggerPeopleInvitedAlert.resolves();
        stubs.userModel.formatName.returns('Alice Inviteuse');
        stubs.userModel.findOneByEmail.resolves({ id: 42 });
    });

    afterEach(() => {
        consoleErrorStub.restore();
        sandbox.reset();
    });

    describe('cas nominal', () => {
        it('envoie à chaque invité un e-mail ne contenant que son prénom, son nom et son e-mail', async () => {
            await callController(buildReq(), res);

            expect(stubs.mails.sendUserPlatformInvitation).to.have.been.calledTwice;
            expect(stubs.mails.sendUserPlatformInvitation).to.have.been.calledWith(
                { first_name: 'Bob', last_name: 'Invité', email: 'bob.invite@example.test' },
                { variables: { inviterName: 'Alice Inviteuse' } },
            );
            expect(stubs.mails.sendUserPlatformInvitation).to.have.been.calledWith(
                { first_name: 'Carole', last_name: 'Invitée', email: 'carole.invitee@example.test' },
                { variables: { inviterName: 'Alice Inviteuse' } },
            );
            expect(stubs.userModel.formatName).to.have.been.calledWith(greeter);
        });

        it('notifie Tchap une seule fois avec tous les invités et l\'invitant identifié', async () => {
            await callController(buildReq(), res);

            expect(stubs.tchap.triggerPeopleInvitedAlert).to.have.been.calledOnceWithExactly(
                guests,
                { ...greeter, id: 42 },
                'via le menu de navigation',
            );
        });

        it('répond 200 avec un objet vide', async () => {
            await callController(buildReq(), res);

            expect(res.status).to.have.been.calledOnceWithExactly(200);
            expect(res.send).to.have.been.calledOnceWithExactly({});
            expect(stubs.sentry.captureException).not.to.have.been.called;
        });
    });

    describe('attente des envois', () => {
        it('ne répond qu\'une fois toutes les promesses d\'envoi réglées', async () => {
            const deferredA = createDeferred();
            const deferredB = createDeferred();
            stubs.mails.sendUserPlatformInvitation.onCall(0).returns(deferredA.promise);
            stubs.mails.sendUserPlatformInvitation.onCall(1).returns(deferredB.promise);

            const pending = callController(buildReq(), res);

            await nextTick();
            expect(stubs.mails.sendUserPlatformInvitation).to.have.been.calledTwice;
            expect(res.status).not.to.have.been.called;

            deferredA.resolve();
            await nextTick();
            expect(res.status).not.to.have.been.called;

            deferredB.resolve();
            await pending;
            expect(res.status).to.have.been.calledOnceWithExactly(200);
            expect(res.send).to.have.been.calledOnceWithExactly({});
        });
    });

    describe('échec asynchrone de l\'envoi pour un invité sur deux', () => {
        const smtpError = new Error('SMTP indisponible');

        beforeEach(() => {
            stubs.mails.sendUserPlatformInvitation.onCall(0).rejects(smtpError);
            stubs.mails.sendUserPlatformInvitation.onCall(1).resolves();
        });

        it('signale l\'erreur à Sentry une fois, sans donnée personnelle de l\'invité', async () => {
            await callController(buildReq(), res);

            expect(stubs.sentry.captureException).to.have.been.calledOnceWithExactly(smtpError);
            const serialized = JSON.stringify(stubs.sentry.captureException.args);
            guests.forEach((guest) => {
                expect(serialized).not.to.include(guest.email);
                expect(serialized).not.to.include(guest.last_name);
            });
        });

        it('traite quand même l\'autre invité, notifie Tchap et répond 200', async () => {
            await callController(buildReq(), res);

            expect(stubs.mails.sendUserPlatformInvitation).to.have.been.calledTwice;
            expect(stubs.tchap.triggerPeopleInvitedAlert).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledOnceWithExactly(200);
            expect(res.send).to.have.been.calledOnceWithExactly({});
        });

        it('n\'émet aucun événement unhandledRejection', async () => {
            const unhandled: unknown[] = [];
            function onUnhandled(reason: unknown) {
                unhandled.push(reason);
            }
            process.on('unhandledRejection', onUnhandled);

            try {
                await callController(buildReq(), res);
                await nextTick();
            } finally {
                process.removeListener('unhandledRejection', onUnhandled);
            }

            expect(unhandled).to.have.lengthOf(0);
        });
    });

    describe('échec synchrone de l\'envoi pour un invité sur deux', () => {
        const syncError = new Error('Template illisible');

        beforeEach(() => {
            stubs.mails.sendUserPlatformInvitation.onCall(0).throws(syncError);
            stubs.mails.sendUserPlatformInvitation.onCall(1).resolves();
        });

        it('signale l\'erreur à Sentry une fois, sans donnée personnelle de l\'invité', async () => {
            await callController(buildReq(), res);

            expect(stubs.sentry.captureException).to.have.been.calledOnceWithExactly(syncError);
            const serialized = JSON.stringify(stubs.sentry.captureException.args);
            guests.forEach((guest) => {
                expect(serialized).not.to.include(guest.email);
                expect(serialized).not.to.include(guest.last_name);
            });
        });

        it('traite quand même l\'autre invité, notifie Tchap et répond 200', async () => {
            await callController(buildReq(), res);

            expect(stubs.mails.sendUserPlatformInvitation).to.have.been.calledTwice;
            expect(stubs.tchap.triggerPeopleInvitedAlert).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledOnceWithExactly(200);
            expect(res.send).to.have.been.calledOnceWithExactly({});
        });
    });

    describe('échec de tous les envois', () => {
        it('répond 200, signale chaque erreur à Sentry et notifie Tchap', async () => {
            const firstError = new Error('Échec A');
            const secondError = new Error('Échec B');
            stubs.mails.sendUserPlatformInvitation.onCall(0).rejects(firstError);
            stubs.mails.sendUserPlatformInvitation.onCall(1).rejects(secondError);

            await callController(buildReq(), res);

            expect(stubs.sentry.captureException).to.have.been.calledTwice;
            expect(stubs.sentry.captureException).to.have.been.calledWithExactly(firstError);
            expect(stubs.sentry.captureException).to.have.been.calledWithExactly(secondError);
            expect(stubs.tchap.triggerPeopleInvitedAlert).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledOnceWithExactly(200);
            expect(res.send).to.have.been.calledOnceWithExactly({});
        });
    });

    describe('notification Tchap', () => {
        [
            ['access_request', 'via le formulaire de demande d\'accès'],
            ['contact_others', 'via le formulaire de contact (signaler / aider / demander des infos / demander de l\'aide / demander un accès)'],
            ['push_mail', 'via push mail J+15'],
            ['navbar', 'via le menu de navigation'],
            ['annuaire', 'via l\'annuaire'],
            ['valeur_inconnue', 'via une origine inconnue'],
            [undefined, 'via une origine inconnue'],
        ].forEach(([inviteFrom, expectedLabel]) => {
            it(`transmet le libellé "${expectedLabel}" pour invite_from = ${inviteFrom === undefined ? 'absent' : `"${inviteFrom}"`}`, async () => {
                await callController(buildReq({ invite_from: inviteFrom }), res);

                expect(stubs.tchap.triggerPeopleInvitedAlert).to.have.been.calledOnce;
                expect(stubs.tchap.triggerPeopleInvitedAlert.firstCall.args[2]).to.equal(expectedLabel);
            });
        });

        it('utilise l\'id de l\'invitant trouvé par e-mail', async () => {
            stubs.userModel.findOneByEmail.resolves({ id: 7 });

            await callController(buildReq(), res);

            expect(stubs.userModel.findOneByEmail).to.have.been.calledWith(greeter.email);
            expect(stubs.tchap.triggerPeopleInvitedAlert.firstCall.args[1]).to.deep.equal({ ...greeter, id: 7 });
        });

        it('utilise un id null si l\'invitant n\'est pas trouvé', async () => {
            stubs.userModel.findOneByEmail.resolves(null);

            await callController(buildReq(), res);

            expect(stubs.tchap.triggerPeopleInvitedAlert.firstCall.args[1]).to.deep.equal({ ...greeter, id: null });
        });

        it('répond 200 et signale l\'erreur à Sentry si la notification échoue', async () => {
            const tchapError = new Error('Tchap indisponible');
            stubs.tchap.triggerPeopleInvitedAlert.rejects(tchapError);

            await callController(buildReq(), res);

            expect(stubs.sentry.captureException).to.have.been.calledOnceWithExactly(tchapError);
            expect(consoleErrorStub).not.to.have.been.called;
            expect(res.status).to.have.been.calledOnceWithExactly(200);
            expect(res.send).to.have.been.calledOnceWithExactly({});
        });
    });
});
