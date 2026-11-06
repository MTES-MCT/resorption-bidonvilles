import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';

import { rewiremock } from '#test/rewiremock';
import { serialized as fakeUser } from '#test/utils/user';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();

const BASE_URL = 'https://tchap.test';

// clés logiques réelles de la table TCHAP_CHANNELS (contrat : la variable d'environnement
// de chaque salon est RB_API_TCHAP_<CLE EN MAJUSCULES, tirets remplacés par des underscores>)
const CHANNEL_KEYS = [
    'notif-dev-test',
    'notif-invitations-intervenants',
    'notif-nettoyage-pieces-jointes',
    'notif-intervenants-declares',
    'notif-canicule',
    'notif-requetes-cadastre',
    'notif-action-nouveau-commentaire',
    'notif-site-nouveau-commentaire',
    'notif-nouveaux-utilisateurs',
    'tech',
    'notif-auto-desactivations',
    'notif-anonymisation',
    'notif-personnes-invitees',
    'notif-absence-pilote-action',
    'notif-fermeture-sites',
    'notif-reinstallation',
    'notif-ouverture-sites',
];

function envVarName(channelKey: string): string {
    return `RB_API_TCHAP_${channelKey.toUpperCase().replaceAll('-', '_')}`;
}

// room IDs fournis par variable d'environnement
const FROM_ENV = {
    devTest: '!envDevTest:serveur.test',
    autoDesactivations: '!envAutoDesactivations:serveur.test',
    tech: '!envTech:serveur.test',
};

const ENV_VARS = {
    devTest: 'RB_API_TCHAP_NOTIF_DEV_TEST',
    autoDesactivations: 'RB_API_TCHAP_NOTIF_AUTO_DESACTIVATIONS',
    tech: 'RB_API_TCHAP_TECH',
};

// chaînes distinctives portées par l'utilisateur de test : elles ne doivent jamais fuiter vers Sentry
const DISTINCTIVE_FIRST_NAME = 'PrenomDistinctifQwerty';
const DISTINCTIVE_LAST_NAME = 'NomDistinctifAzerty';

const MANAGED_ENV_KEYS = [
    'NODE_ENV',
    'RB_API_TCHAP_TOKEN',
    'RB_API_TCHAP_BASE_URL',
    ...new Set([...Object.values(ENV_VARS), ...CHANNEL_KEYS.map(envVarName)]),
];

type TchapTrigger = (...args: unknown[]) => Promise<unknown>;

type TchapModule = {
    default: Record<string, TchapTrigger>,
};

function distinctiveUser(): ReturnType<typeof fakeUser> {
    return fakeUser({ first_name: DISTINCTIVE_FIRST_NAME, last_name: DISTINCTIVE_LAST_NAME });
}

const fakeTown = {
    id: 42,
    name: 'Site de test',
    usename: 'Site de test',
    status: 'open',
    populationTotal: 10,
    builtAt: 1700000000,
    declaredAt: 1700000000,
    closedAt: 1700000000,
    reinstallationIncomingTowns: [],
};

const fakeAction = { id: 7, name: 'Action de test' };

// pour chaque clé logique : fonction trigger* qui l'utilise (null = aucune fonction trigger*, salon utilisé uniquement via la redirection de développement)
const TRIGGERS_BY_KEY: Record<string, ((tchap: TchapModule['default']) => Promise<unknown>) | null> = {
    'notif-dev-test': null,
    'notif-invitations-intervenants': tchap => tchap.triggerActorInvitedAlert(fakeTown, distinctiveUser(), 'invite@test.fr'),
    'notif-nettoyage-pieces-jointes': tchap => tchap.triggerAttachmentArchiveCleanup(3, 0),
    'notif-intervenants-declares': tchap => tchap.triggerDeclaredActor(fakeTown, distinctiveUser()),
    'notif-canicule': tchap => tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true),
    'notif-requetes-cadastre': tchap => tchap.triggerLandRegistryRequest(distinctiveUser(), 'AB 123', '2024'),
    'notif-action-nouveau-commentaire': tchap => tchap.triggerNewActionComment('Commentaire', fakeAction, distinctiveUser()),
    'notif-site-nouveau-commentaire': tchap => tchap.triggerNewComment('Commentaire', [], fakeTown, distinctiveUser()),
    'notif-nouveaux-utilisateurs': tchap => tchap.triggerNewUserAlert(distinctiveUser()),
    tech: tchap => tchap.triggerNotifyNewUserFromRectorat(distinctiveUser()),
    'notif-auto-desactivations': tchap => tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser()),
    'notif-anonymisation': tchap => tchap.triggerNotifyOwnersAnonymization(1, 2),
    'notif-personnes-invitees': tchap => tchap.triggerPeopleInvitedAlert([distinctiveUser()], distinctiveUser(), 'Message'),
    'notif-absence-pilote-action': tchap => tchap.triggerRequestActionPilot(fakeAction, distinctiveUser()),
    'notif-fermeture-sites': tchap => tchap.triggerShantytownCloseAlert(fakeTown, distinctiveUser()),
    'notif-reinstallation': tchap => tchap.triggerReinstallationAlert(fakeTown, distinctiveUser()),
    'notif-ouverture-sites': tchap => tchap.triggerShantytownCreationAlert(fakeTown, distinctiveUser()),
};

const stubs = {
    fetch: sandbox.stub(),
    statusDetails: {},
    formatActionFullName: { getActionFullName: sandbox.stub() },
    sentry: { captureMessage: sandbox.stub(), captureException: sandbox.stub() },
};

// dotenv neutralisé : seul l'environnement passé à loadTchap existe, indépendamment du .env local
// (config.ts appelle dotenv.config() à l'import ; config est en passBy, donc rewiremock ne peut pas le remplacer)

const initialEnv: Record<string, string | undefined> = {};
MANAGED_ENV_KEYS.forEach((key) => {
    initialEnv[key] = process.env[key];
});

const originalFetch = global.fetch;

/**
 * Retire config et tchap du cache require, pour forcer une relecture de l'environnement
 * au prochain import et ne rien laisser derrière soi.
 */
function clearModulesCache(): void {
    ['/server/config.ts', '/server/utils/tchap.ts'].forEach((suffix) => {
        Object.keys(require.cache)
            .filter(path => path.endsWith(suffix))
            .forEach((path) => {
                delete require.cache[path];
            });
    });
}

/**
 * Applique l'environnement demandé (undefined = variable absente), puis recharge
 * config et tchap pour que la lecture à l'import tienne compte de cet environnement.
 */
function loadTchap(env: Record<string, string | undefined>): TchapModule {
    const fullEnv: Record<string, string | undefined> = {
        RB_API_TCHAP_TOKEN: 'token-de-test',
        RB_API_TCHAP_BASE_URL: BASE_URL,
        ...env,
    };

    Object.entries(fullEnv).forEach(([key, value]) => {
        if (value === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = value;
        }
    });

    clearModulesCache();

    rewiremock('#server/utils/statusDetails').with(stubs.statusDetails);
    rewiremock('#server/utils/formatActionFullName').with(stubs.formatActionFullName);
    rewiremock('@sentry/node').with(stubs.sentry);
    rewiremock('node:crypto').callThrough();

    rewiremock.enable();
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const module = require('./tchap') as TchapModule;
    rewiremock.disable();

    return module;
}

/**
 * Vérifie qu'un salon non configuré a été signalé une fois à Sentry (niveau error),
 * avec le libellé `Salon "<clé>" non configuré` (sans rien révéler de la configuration
 * d'environnement), un extra limité au canal, et sans aucune donnée du message ni de l'utilisateur.
 */
function expectMissingVariableReported(channelKey: string): void {
    expect(stubs.sentry.captureMessage).to.have.been.calledOnce;
    const [message, options] = stubs.sentry.captureMessage.firstCall.args as [string, { level: string, extra: Record<string, unknown> }];
    expect(message).to.include(`[Tchap] Salon "${channelKey}" non configuré : notification non envoyée`);
    expect(message).to.not.include('RB_API_TCHAP_');
    expect(options.level).to.be.eql('error');
    expect(options.extra).to.be.eql({ channel: channelKey });

    const serialized = JSON.stringify(stubs.sentry.captureMessage.firstCall.args);
    expect(serialized).to.not.include(DISTINCTIVE_FIRST_NAME);
    expect(serialized).to.not.include(DISTINCTIVE_LAST_NAME);
    expect(serialized).to.not.include('Alerte Résorption');
    expect(serialized).to.not.include('formatted_body');
    expect(stubs.sentry.captureException).to.not.have.been.called;
}

function sentRoomId(): string {
    expect(stubs.fetch).to.have.been.calledOnce;
    const [url, options] = stubs.fetch.firstCall.args as [string, { method: string }];
    expect(options.method).to.be.eql('PUT');

    const match = /\/rooms\/([^/]+)\/send\//.exec(url);
    expect(match, `URL inattendue : ${url}`).to.not.be.null;
    return decodeURIComponent((match as RegExpExecArray)[1]);
}

type SentryEvent = { message: string, extra: unknown };

/**
 * Liste les événements envoyés à Sentry, que le module ait utilisé captureMessage
 * (message = 1er argument) ou captureException (message = message de l'Error passée).
 */
function sentryEvents(): SentryEvent[] {
    const fromMessages = stubs.sentry.captureMessage.getCalls().map((call) => {
        const [message, options] = call.args as [string, { extra?: unknown } | undefined];
        return { message, extra: options?.extra };
    });
    const fromExceptions = stubs.sentry.captureException.getCalls().map((call) => {
        const [error, options] = call.args as [Error, { extra?: unknown } | undefined];
        return { message: error?.message, extra: options?.extra };
    });
    return [...fromMessages, ...fromExceptions];
}

/**
 * Vérifie qu'exactement un événement Sentry porte ce message, avec un extra strictement égal à { channel }.
 */
function expectSentryEvent(message: string, channelKey: string): void {
    const events = sentryEvents().filter(event => event.message === message);
    expect(events, `événements Sentry reçus : ${JSON.stringify(sentryEvents())}`).to.have.lengthOf(1);
    expect(events[0].extra).to.be.eql({ channel: channelKey });
}

/**
 * Sérialise tous les arguments reçus par les stubs Sentry, en incluant message, stack et cause des Error
 * (JSON.stringify seul les ignorerait).
 */
function serializeSentryArgs(): string {
    const replacer = (_key: string, value: unknown): unknown => {
        if (value instanceof Error) {
            return {
                name: value.name,
                message: value.message,
                stack: value.stack,
                cause: (value as Error & { cause?: unknown }).cause,
                ...value,
            };
        }
        return value;
    };
    return JSON.stringify([
        ...stubs.sentry.captureMessage.getCalls().map(call => call.args),
        ...stubs.sentry.captureException.getCalls().map(call => call.args),
    ], replacer);
}

describe('utils/tchap (résolution des salons)', () => {
    before(() => {
        sandbox.stub(dotenv, 'config').returns({});
    });

    beforeEach(() => {
        stubs.fetch.resolves({ ok: true, status: 200, statusText: 'OK' });
        global.fetch = stubs.fetch as unknown as typeof fetch;
    });

    afterEach(() => {
        sandbox.resetHistory();
        global.fetch = originalFetch;
        clearModulesCache();
        MANAGED_ENV_KEYS.forEach((key) => {
            if (initialEnv[key] === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = initialEnv[key];
            }
        });
    });

    after(() => {
        sandbox.restore();
    });

    describe('en production (NODE_ENV="production")', () => {
        it('utilise la valeur (trimée) de la variable d\'environnement du salon quand elle est définie', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [ENV_VARS.autoDesactivations]: `  ${FROM_ENV.autoDesactivations}  `,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(sentRoomId()).to.be.eql(FROM_ENV.autoDesactivations);
            expect(stubs.sentry.captureMessage).to.not.have.been.called;
        });

        it('applique la variable propre à la clé demandée, pas celle d\'une autre clé', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [ENV_VARS.tech]: FROM_ENV.tech,
                [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
                [ENV_VARS.devTest]: FROM_ENV.devTest,
            });

            await tchap.triggerNotifyNewUserFromRectorat(distinctiveUser());
            expect(sentRoomId()).to.be.eql(FROM_ENV.tech);

            stubs.fetch.resetHistory();
            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
            expect(sentRoomId()).to.be.eql(FROM_ENV.autoDesactivations);
        });

        it('n\'utilise pas la variable du salon de test pour une autre clé quand la variable de cette clé est absente', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [ENV_VARS.devTest]: FROM_ENV.devTest,
                [ENV_VARS.autoDesactivations]: undefined,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(stubs.fetch).to.not.have.been.called;
            expect(stubs.sentry.captureMessage).to.have.been.calledOnce;
        });

        it('n\'envoie rien et ne lève pas d\'exception quand la variable du salon est absente', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [ENV_VARS.autoDesactivations]: undefined,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(stubs.fetch).to.not.have.been.called;
        });

        it('n\'envoie rien quand la variable du salon est vide', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [ENV_VARS.autoDesactivations]: '',
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(stubs.fetch).to.not.have.been.called;
            expectMissingVariableReported('notif-auto-desactivations');
        });

        it('n\'envoie rien quand la variable du salon est composée uniquement d\'espaces', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [ENV_VARS.autoDesactivations]: '   ',
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(stubs.fetch).to.not.have.been.called;
            expectMissingVariableReported('notif-auto-desactivations');
        });

        it('signale à Sentry le salon non configuré (sans citer de variable d\'environnement), sans y envoyer le contenu du message ni de données personnelles', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [envVarName('notif-canicule')]: undefined,
            });

            await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);

            expect(stubs.fetch).to.not.have.been.called;
            expectMissingVariableReported('notif-canicule');
        });

        it('n\'utilise jamais un room ID codé en dur en l\'absence de variable', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [ENV_VARS.autoDesactivations]: undefined,
                [ENV_VARS.tech]: undefined,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
            await tchap.triggerNotifyNewUserFromRectorat(distinctiveUser());

            stubs.fetch.getCalls().forEach((call) => {
                const url = String(call.args[0]);
                expect(url).to.not.include('!');
                expect(url).to.not.include('%21');
                expect(url).to.not.include('dev01');
            });
            expect(stubs.fetch).to.not.have.been.called;
        });

        it('la clé tech correspond à RB_API_TCHAP_TECH (et non RB_API_TCHAP_NOTIF_TECH)', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                RB_API_TCHAP_NOTIF_TECH: '!mauvaiseVariable:serveur.test',
                RB_API_TCHAP_TECH: FROM_ENV.tech,
            });

            await tchap.triggerNotifyNewUserFromRectorat(distinctiveUser());

            expect(sentRoomId()).to.be.eql(FROM_ENV.tech);
        });

        CHANNEL_KEYS.forEach((channelKey) => {
            const trigger = TRIGGERS_BY_KEY[channelKey];
            if (!trigger) {
                return;
            }

            it(`la variable ${envVarName(channelKey)} pilote le salon de la clé ${channelKey}`, async () => {
                const env: Record<string, string> = { NODE_ENV: 'production' };
                CHANNEL_KEYS.forEach((key) => {
                    env[envVarName(key)] = `!salon-${key}:serveur.test`;
                });
                const { default: tchap } = loadTchap(env);

                await trigger(tchap);

                expect(sentRoomId()).to.be.eql(`!salon-${channelKey}:serveur.test`);
            });
        });
    });

    describe('contenu du message envoyé (repli texte brut et HTML)', () => {
        type SentContent = { msgtype: string, body: string, format: string, formatted_body: string };

        function sentContent(): SentContent {
            expect(stubs.fetch).to.have.been.calledOnce;
            const [, init] = stubs.fetch.firstCall.args as [string, { body: string }];
            return JSON.parse(init.body) as SentContent;
        }

        function loadForContent(): TchapModule['default'] {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
                [envVarName('notif-requetes-cadastre')]: '!envCadastre:serveur.test',
            });
            return tchap;
        }

        it('remplace le lien du texte par son libellé seul dans body, sans balise HTML', async () => {
            const tchap = loadForContent();

            await tchap.triggerNotifyNewUserSelfDeactivation(fakeUser({ first_name: 'Jeanne', last_name: 'Dupont' }));

            const { body } = sentContent();
            expect(body).to.include('L\'utilisateur(ice) Jeanne Dupont vient de désactiver son accès à la plateforme');
            expect(body).to.not.include('<a');
            expect(body).to.not.include('</a>');
            expect(body).to.not.include('href');
            expect(body).to.not.match(/<[^>]+>/);
        });

        it('décode dans body les entités produites par escapeHtml (apostrophe et esperluette)', async () => {
            const tchap = loadForContent();

            await tchap.triggerNotifyNewUserSelfDeactivation(fakeUser({ first_name: 'Jean', last_name: 'O\'Brien & Fils' }));

            const { body, formatted_body: formattedBody } = sentContent();
            expect(body).to.include('Jean O\'Brien & Fils');
            expect(body).to.not.match(/&(amp|lt|gt|quot|#0?39);/);
            // le HTML reste échappé
            expect(formattedBody).to.include('O&#039;Brien &amp; Fils');
            expect(formattedBody).to.not.include('O\'Brien & Fils');
        });

        it('conserve littéralement dans body un texte saisi `<b>x</b>` (balises retirées avant le décodage des entités)', async () => {
            const tchap = loadForContent();

            await tchap.triggerNotifyNewUserSelfDeactivation(fakeUser({ first_name: 'Jean', last_name: '<b>x</b>' }));

            const { body, formatted_body: formattedBody } = sentContent();
            expect(body).to.include('Jean <b>x</b> vient de désactiver');
            expect(body).to.not.include('&lt;');
            // le HTML reste échappé : le texte saisi n'est jamais interprété comme une balise
            expect(formattedBody).to.include('&lt;b&gt;x&lt;/b&gt;');
            expect(formattedBody).to.not.include('<b>x</b>');
        });

        it('ne modifie pas formatted_body : lien et gras sont conservés', async () => {
            const tchap = loadForContent();

            await tchap.triggerNotifyNewUserSelfDeactivation(fakeUser({ first_name: 'Jeanne', last_name: 'Dupont' }));

            const { formatted_body: formattedBody, format, msgtype } = sentContent();
            expect(msgtype).to.be.eql('m.text');
            expect(format).to.be.eql('org.matrix.custom.html');
            expect(formattedBody).to.include('<a href="');
            expect(formattedBody).to.include('>Jeanne Dupont</a>');
            expect(formattedBody).to.include('<strong>Alerte Résorption bidonvilles</strong>');
        });

        it('conserve dans body l\'en-tête texte et l\'emoji de niveau', async () => {
            const tchap = loadForContent();

            await tchap.triggerNotifyNewUserSelfDeactivation(fakeUser());

            const { body } = sentContent();
            expect(body).to.match(/^🤖 Alerte Résorption bidonvilles - \d{2}\/\d{2}\/\d{4} à \d{2}:\d{2}\nℹ️ /);
        });

        it('rend les champs en « Label: texte » sur des lignes séparées, sans balise ni entité brute dans body', async () => {
            const tchap = loadForContent();

            await tchap.triggerLandRegistryRequest(
                fakeUser({ first_name: 'Jeanne', last_name: 'Dupont' }),
                'AB <12> & "C" l\'un',
                '2024',
            );

            const { body, formatted_body: formattedBody } = sentContent();
            const lines = body.split('\n');
            expect(lines).to.include('Parcelle concernée: AB <12> & "C" l\'un');
            expect(lines).to.include('Millésime des données du cadastre: 2024');
            expect(body).to.include('Demande d\'information cadastre de: Jeanne Dupont');
            expect(body).to.not.include('href');
            expect(body).to.not.include('<br');
            expect(body).to.not.include('<strong>');
            expect(body).to.not.match(/&(amp|lt|gt|quot|#0?39);/);
            // le HTML reste échappé et mis en forme
            expect(formattedBody).to.include('<strong>Parcelle concernée</strong>: AB &lt;12&gt; &amp; &quot;C&quot; l&#039;un');
            expect(formattedBody).to.include('<a href=');
        });
    });

    describe('config.tchap.channels', () => {
        it('expose exactement les 17 clés logiques, chacune valant la variable RB_API_TCHAP_<CLE> correspondante', () => {
            const env: Record<string, string> = { NODE_ENV: 'production' };
            CHANNEL_KEYS.forEach((key) => {
                env[envVarName(key)] = `!config-${key}:serveur.test`;
            });
            loadTchap(env);
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            const { default: config } = require('#server/config') as { default: { tchap: { channels: Record<string, string> } } };

            expect(CHANNEL_KEYS).to.have.lengthOf(17);
            expect(Object.keys(config.tchap.channels).sort()).to.be.eql([...CHANNEL_KEYS].sort());
            CHANNEL_KEYS.forEach((key) => {
                expect(config.tchap.channels[key], key).to.be.eql(`!config-${key}:serveur.test`);
            });
            expect(new Set(Object.values(config.tchap.channels)).size).to.be.eql(17);
        });
    });

    describe('en environnement de développement', () => {
        it('redirige vers le salon défini par RB_API_TCHAP_NOTIF_DEV_TEST', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'development',
                [ENV_VARS.devTest]: FROM_ENV.devTest,
                [ENV_VARS.autoDesactivations]: undefined,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(sentRoomId()).to.be.eql(FROM_ENV.devTest);
        });

        it('redirige vers le salon de test quelle que soit la clé demandée, même si la variable de cette clé est définie', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'development',
                [ENV_VARS.devTest]: FROM_ENV.devTest,
                [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
                [ENV_VARS.tech]: FROM_ENV.tech,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
            expect(sentRoomId()).to.be.eql(FROM_ENV.devTest);

            stubs.fetch.resetHistory();
            await tchap.triggerNotifyNewUserFromRectorat(distinctiveUser());
            expect(sentRoomId()).to.be.eql(FROM_ENV.devTest);
        });

        it('n\'envoie rien et signale à Sentry quand RB_API_TCHAP_NOTIF_DEV_TEST est absente, même si la variable de la clé demandée est définie', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'development',
                [ENV_VARS.devTest]: undefined,
                [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(stubs.fetch).to.not.have.been.called;
            expectMissingVariableReported('notif-dev-test');
        });

        it('n\'envoie rien et signale à Sentry quand RB_API_TCHAP_NOTIF_DEV_TEST est vide ou composée d\'espaces', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'development',
                [ENV_VARS.devTest]: '  ',
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(stubs.fetch).to.not.have.been.called;
            expectMissingVariableReported('notif-dev-test');
        });

        it('n\'utilise jamais un room ID codé en dur quand RB_API_TCHAP_NOTIF_DEV_TEST est absente', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'development',
                [ENV_VARS.devTest]: undefined,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(stubs.fetch).to.not.have.been.called;
        });
    });

    describe('bascule vers le salon de test selon NODE_ENV', () => {
        ['development', 'test', 'staging'].forEach((nodeEnv) => {
            it(`NODE_ENV="${nodeEnv}" redirige vers notif-dev-test, même si le salon de la clé demandée est configuré`, async () => {
                const { default: tchap } = loadTchap({
                    NODE_ENV: nodeEnv,
                    [ENV_VARS.devTest]: FROM_ENV.devTest,
                    [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
                });

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(sentRoomId()).to.be.eql(FROM_ENV.devTest);
                expect(stubs.sentry.captureMessage).to.not.have.been.called;
            });
        });

        // seule la valeur exacte "production" active les vrais salons : en cas de doute, on n'écrit jamais dedans
        it('NODE_ENV absent redirige vers notif-dev-test (défaut sûr), même si le salon de la clé demandée est configuré', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: undefined,
                [ENV_VARS.devTest]: FROM_ENV.devTest,
                [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(sentRoomId()).to.be.eql(FROM_ENV.devTest);
            expect(stubs.sentry.captureMessage).to.not.have.been.called;
        });

        [
            { label: 'vide', value: '' },
            { label: 'avec une autre casse', value: 'Production' },
            { label: 'avec un espace en tête', value: ' production' },
            { label: 'avec un espace en fin', value: 'production ' },
            { label: 'en majuscules', value: 'PRODUCTION' },
            { label: 'abrégé', value: 'prod' },
        ].forEach(({ label, value }) => {
            it(`NODE_ENV="${value}" (${label}) redirige vers notif-dev-test, jamais vers le vrai salon`, async () => {
                const { default: tchap } = loadTchap({
                    NODE_ENV: value,
                    [ENV_VARS.devTest]: FROM_ENV.devTest,
                    [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
                });

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(sentRoomId()).to.be.eql(FROM_ENV.devTest);
                expect(stubs.sentry.captureMessage).to.not.have.been.called;
            });
        });

        it('NODE_ENV="production" utilise le vrai salon de la clé, pas notif-dev-test', async () => {
            const { default: tchap } = loadTchap({
                NODE_ENV: 'production',
                [ENV_VARS.devTest]: FROM_ENV.devTest,
                [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
            });

            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

            expect(sentRoomId()).to.be.eql(FROM_ENV.autoDesactivations);
        });
    });

    describe('signalement des échecs d\'envoi à Sentry (aucune donnée du message ni room ID)', () => {
        const SECRET_ROOM_ID = '!roomSecretXyz789:serveur.test';
        const SECRET_EMAIL = 'secret.email@distinctif.test';
        const SECRET_COMMENT = 'CommentaireLibreConfidentiel <b>gras</b>';
        const NETWORK_ERROR_MESSAGE = 'connect ECONNREFUSED 10.0.0.1:443';

        function productionEnv(): Record<string, string | undefined> {
            const env: Record<string, string | undefined> = { NODE_ENV: 'production' };
            CHANNEL_KEYS.forEach((key) => {
                env[envVarName(key)] = SECRET_ROOM_ID;
            });
            return env;
        }

        function expectNoLeak(): void {
            const serialized = serializeSentryArgs();
            [
                SECRET_ROOM_ID,
                'roomSecretXyz789',
                encodeURIComponent(SECRET_ROOM_ID),
                'roomId',
                DISTINCTIVE_FIRST_NAME,
                DISTINCTIVE_LAST_NAME,
                SECRET_EMAIL,
                'CommentaireLibreConfidentiel',
                '<b>',
                '&lt;b&gt;',
                '<strong>',
                '<a href',
                'Alerte Résorption',
                'formatted_body',
                'plainTextFallback',
                'token-de-test',
            ].forEach((forbidden) => {
                expect(serialized, `"${forbidden}" ne doit pas partir vers Sentry`).to.not.include(forbidden);
            });
        }

        describe('exception pendant l\'envoi', () => {
            beforeEach(() => {
                stubs.fetch.rejects(new Error(NETWORK_ERROR_MESSAGE));
            });

            it('signale le salon en production avec le message exact et un extra limité au canal', async () => {
                const { default: tchap } = loadTchap(productionEnv());

                await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);

                expectSentryEvent('[Tchap] Une erreur est survenue lors de la tentative d\'envoi d\'une notification vers le salon "notif-canicule"', 'notif-canicule');
            });

            ['development', 'test'].forEach((nodeEnv) => {
                it(`signale le salon notif-dev-test quand NODE_ENV="${nodeEnv}"`, async () => {
                    const { default: tchap } = loadTchap({ ...productionEnv(), NODE_ENV: nodeEnv });

                    await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);

                    expectSentryEvent('[Tchap] Une erreur est survenue lors de la tentative d\'envoi d\'une notification vers le salon "notif-dev-test"', 'notif-dev-test');
                });
            });

            CHANNEL_KEYS.forEach((channelKey) => {
                const trigger = TRIGGERS_BY_KEY[channelKey];
                if (!trigger) {
                    return;
                }

                it(`en production, le nom signalé est la clé effective ${channelKey} (pas une valeur codée en dur)`, async () => {
                    const { default: tchap } = loadTchap(productionEnv());

                    await trigger(tchap);

                    expectSentryEvent(`[Tchap] Une erreur est survenue lors de la tentative d'envoi d'une notification vers le salon "${channelKey}"`, channelKey);
                });
            });

            it('n\'envoie aucune donnée du message ni room ID à Sentry (nom, prénom, e-mail, HTML)', async () => {
                const { default: tchap } = loadTchap(productionEnv());
                const user = fakeUser({
                    first_name: DISTINCTIVE_FIRST_NAME,
                    last_name: DISTINCTIVE_LAST_NAME,
                    email: SECRET_EMAIL,
                });

                await tchap.triggerNewUserAlert(user);

                expect(stubs.fetch).to.have.been.calledOnce;
                expect(sentryEvents()).to.not.be.empty;
                expectNoLeak();
            });

            it('n\'envoie aucun commentaire libre ni donnée d\'auteur à Sentry', async () => {
                const { default: tchap } = loadTchap(productionEnv());

                await tchap.triggerNewComment(SECRET_COMMENT, [], fakeTown, distinctiveUser());

                expect(stubs.fetch).to.have.been.calledOnce;
                expect(sentryEvents()).to.not.be.empty;
                expectNoLeak();
            });

            it('n\'envoie aucune donnée hors production non plus', async () => {
                const { default: tchap } = loadTchap({ ...productionEnv(), NODE_ENV: 'development' });

                await tchap.triggerNewComment(SECRET_COMMENT, [], fakeTown, distinctiveUser());

                expect(sentryEvents()).to.not.be.empty;
                expectNoLeak();
            });
        });

        describe('exception pendant l\'envoi : captureException relié à l\'erreur d\'origine par cause', () => {
            type ErrorWithCause = Error & { cause?: unknown };

            const EXPECTED_MESSAGE = '[Tchap] Une erreur est survenue lors de la tentative d\'envoi d\'une notification vers le salon "notif-canicule"';
            const INVALID_URL_MESSAGE = `Failed to parse URL from https://matrix.example.test/_matrix/client/v3/rooms/${encodeURIComponent(SECRET_ROOM_ID)}/send/m.room.message/123`;
            // formes sous lesquelles le room ID ne doit jamais apparaître (brute, encodée, à demi encodée, identifiant seul)
            const ROOM_ID_FORMS = [
                SECRET_ROOM_ID,
                encodeURIComponent(SECRET_ROOM_ID),
                encodeURIComponent(SECRET_ROOM_ID).toLowerCase(),
                '%21roomSecretXyz789:serveur.test',
                '!roomSecretXyz789%3Aserveur.test',
                'roomSecretXyz789',
            ];

            function capturedError(): ErrorWithCause {
                expect(stubs.sentry.captureException).to.have.been.calledOnce;
                const [error] = stubs.sentry.captureException.firstCall.args as [unknown];
                expect(error).to.be.instanceOf(Error);
                return error as ErrorWithCause;
            }

            function capturedCause(): Error {
                const { cause } = capturedError();
                expect(cause).to.be.instanceOf(Error);
                return cause as Error;
            }

            function expectNoRoomId(text: string, where: string): void {
                ROOM_ID_FORMS.forEach((form) => {
                    expect(text, `"${form}" ne doit pas apparaître dans ${where}`).to.not.include(form);
                });
            }

            async function triggerHeatwave(): Promise<void> {
                const { default: tchap } = loadTchap(productionEnv());
                await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);
            }

            it('capture l\'événement via captureException (et non captureMessage), avec une Error dont cause est l\'erreur d\'origine et porte une stack', async () => {
                stubs.fetch.rejects(new Error(NETWORK_ERROR_MESSAGE));

                await triggerHeatwave();

                expect(stubs.sentry.captureMessage).to.not.have.been.called;
                const cause = capturedCause();
                expect(cause.stack).to.be.a('string').and.not.be.empty;
            });

            it('conserve le message exact d\'avant et limite l\'extra à { channel }', async () => {
                stubs.fetch.rejects(new Error(NETWORK_ERROR_MESSAGE));

                await triggerHeatwave();

                expect(capturedError().message).to.be.eql(EXPECTED_MESSAGE);
                const [, options] = stubs.sentry.captureException.firstCall.args as [unknown, { extra: unknown }];
                expect(options.extra).to.be.eql({ channel: 'notif-canicule' });
            });

            it('conserve le message de la cause tel quel pour une erreur réseau (ECONNREFUSED)', async () => {
                stubs.fetch.rejects(new Error('connect ECONNREFUSED 127.0.0.1:443'));

                await triggerHeatwave();

                expect(capturedCause().message).to.be.eql('connect ECONNREFUSED 127.0.0.1:443');
            });

            describe('URL invalide dont le message cite le room ID encodé', () => {
                beforeEach(() => {
                    stubs.fetch.rejects(new TypeError(INVALID_URL_MESSAGE));
                });

                it('ne laisse apparaître le room ID (brut, encodé ou à demi encodé) nulle part dans les arguments Sentry sérialisés', async () => {
                    await triggerHeatwave();

                    expect(capturedError().message).to.be.eql(EXPECTED_MESSAGE);
                    expectNoRoomId(serializeSentryArgs(), 'les arguments Sentry');
                    expectNoLeak();
                });

                it('conserve dans le message de la cause le reste du texte, room ID remplacé', async () => {
                    await triggerHeatwave();

                    const { message } = capturedCause();
                    expect(message).to.include('Failed to parse URL');
                    expectNoRoomId(message, 'le message de la cause');
                });

                it('ne laisse pas le room ID dans la stack de la cause, qui reste renseignée', async () => {
                    await triggerHeatwave();

                    const { stack } = capturedCause();
                    expect(stack).to.be.a('string').and.not.be.empty;
                    expect(stack).to.include('Failed to parse URL');
                    expectNoRoomId(stack as string, 'la stack de la cause');
                });

                it('ne laisse pas le room ID dans la stack de l\'événement lui-même', async () => {
                    await triggerHeatwave();

                    expectNoRoomId(capturedError().stack ?? '', 'la stack de l\'événement');
                });
            });

            it('ne laisse pas le room ID dans une cause imbriquée portant l\'URL (propriété input), comme le fait undici', async () => {
                const url = `https://matrix.example.test/_matrix/client/v3/rooms/${encodeURIComponent(SECRET_ROOM_ID)}/send/m.room.message/123`;
                const inner = Object.assign(new TypeError('Invalid URL'), { input: url, code: 'ERR_INVALID_URL' });
                stubs.fetch.rejects(Object.assign(new TypeError(INVALID_URL_MESSAGE), { cause: inner }));

                await triggerHeatwave();

                expect(capturedCause().message).to.include('Failed to parse URL');
                expectNoRoomId(serializeSentryArgs(), 'les arguments Sentry');
            });

            it('ne laisse apparaître aucune donnée nominative ni balise dans la cause ni sa stack (test piège)', async () => {
                stubs.fetch.rejects(new Error(NETWORK_ERROR_MESSAGE));
                const { default: tchap } = loadTchap(productionEnv());
                const user = fakeUser({
                    first_name: DISTINCTIVE_FIRST_NAME,
                    last_name: DISTINCTIVE_LAST_NAME,
                    email: SECRET_EMAIL,
                });

                await tchap.triggerNewComment(SECRET_COMMENT, [], fakeTown, user);

                const cause = capturedCause();
                [cause.message, cause.stack ?? ''].forEach((text) => {
                    [
                        DISTINCTIVE_FIRST_NAME,
                        DISTINCTIVE_LAST_NAME,
                        SECRET_EMAIL,
                        'CommentaireLibreConfidentiel',
                        '<b>',
                        '&lt;b&gt;',
                        SECRET_ROOM_ID,
                        'roomSecretXyz789',
                    ].forEach((forbidden) => {
                        expect(text, `"${forbidden}" ne doit pas apparaître dans la cause`).to.not.include(forbidden);
                    });
                });
                expectNoLeak();
            });
        });

        describe('échec HTTP', () => {
            beforeEach(() => {
                stubs.fetch.resolves({ ok: false, status: 500, statusText: 'Internal Server Error' });
            });

            it('conserve le message d\'échec et limite l\'extra au canal (sans roomId)', async () => {
                const { default: tchap } = loadTchap(productionEnv());

                await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);

                expectSentryEvent('[Tchap] Échec d\'envoi (500 Internal Server Error)', 'notif-canicule');
            });

            it('signale notif-dev-test hors production', async () => {
                const { default: tchap } = loadTchap({ ...productionEnv(), NODE_ENV: 'development' });

                await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);

                expectSentryEvent('[Tchap] Échec d\'envoi (500 Internal Server Error)', 'notif-dev-test');
            });

            it('utilise la clé effective pour au moins deux salons différents', async () => {
                const { default: tchap } = loadTchap(productionEnv());

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
                expectSentryEvent('[Tchap] Échec d\'envoi (500 Internal Server Error)', 'notif-auto-desactivations');

                sandbox.resetHistory();
                await tchap.triggerNotifyNewUserFromRectorat(distinctiveUser());
                expectSentryEvent('[Tchap] Échec d\'envoi (500 Internal Server Error)', 'tech');
            });

            it('ne laisse apparaître le room ID nulle part dans les arguments Sentry', async () => {
                const { default: tchap } = loadTchap(productionEnv());

                await tchap.triggerNewComment(SECRET_COMMENT, [], fakeTown, distinctiveUser());

                expect(sentryEvents()).to.not.be.empty;
                expectNoLeak();
            });
        });

        describe('token Tchap absent', () => {
            it('limite l\'extra du message « token non configuré » au canal (sans roomId)', async () => {
                const { default: tchap } = loadTchap({ ...productionEnv(), RB_API_TCHAP_TOKEN: undefined });

                await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);

                expect(stubs.fetch).to.not.have.been.called;
                expectSentryEvent('[Tchap] Impossible d\'envoyer le message HTML : token Tchap non configuré', 'notif-canicule');
                expectNoLeak();
            });

            it('signale notif-dev-test hors production', async () => {
                const { default: tchap } = loadTchap({ ...productionEnv(), NODE_ENV: 'development', RB_API_TCHAP_TOKEN: undefined });

                await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);

                expectSentryEvent('[Tchap] Impossible d\'envoyer le message HTML : token Tchap non configuré', 'notif-dev-test');
            });
        });
    });

    describe('contrôle et nettoyage de RB_API_TCHAP_BASE_URL', () => {
        const INVALID_BASE_URL_MESSAGE = '[Tchap] RB_API_TCHAP_BASE_URL invalide ou non sécurisée (https:// requis) : notification non envoyée';
        const HOST = 'matrix.example.test';

        // NODE_ENV tel que passé à loadTchap : undefined = variable absente
        type NodeEnv = string | undefined;

        function envFor(nodeEnv: NodeEnv, baseUrl: string, roomId = FROM_ENV.autoDesactivations): Record<string, string | undefined> {
            return {
                NODE_ENV: nodeEnv,
                RB_API_TCHAP_BASE_URL: baseUrl,
                [ENV_VARS.devTest]: roomId,
                [ENV_VARS.autoDesactivations]: roomId,
            };
        }

        function nodeEnvLabel(nodeEnv: NodeEnv): string {
            return nodeEnv === undefined ? 'absent' : `"${nodeEnv}"`;
        }

        afterEach(() => {
            stubs.fetch.reset();
        });

        async function sendOnce(env: Record<string, string | undefined>): Promise<void> {
            const { default: tchap } = loadTchap(env);
            await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
        }

        function sentUrl(): string {
            expect(stubs.fetch).to.have.been.calledOnce;
            return String(stubs.fetch.firstCall.args[0]);
        }

        function expectRejectedOnce(): void {
            expect(stubs.fetch).to.not.have.been.called;
            expect(stubs.sentry.captureException).to.not.have.been.called;
            expect(stubs.sentry.captureMessage).to.have.been.calledOnce;
            const [message, options] = stubs.sentry.captureMessage.firstCall.args as [string, unknown];
            expect(message).to.be.eql(INVALID_BASE_URL_MESSAGE);
            // level error, sans extra ni aucune valeur de l'URL
            expect(options).to.be.eql({ level: 'error' });
        }

        describe('URL acceptée', () => {
            it('https nominal : l\'URL appelée est inchangée', async () => {
                await sendOnce(envFor('production', `https://${HOST}`));

                const url = sentUrl();
                expect(url.startsWith(`https://${HOST}/_matrix/client/v3/rooms/`)).to.be.eql(true);
                expect(url).to.include(`/rooms/${encodeURIComponent(FROM_ENV.autoDesactivations)}/send/m.room.message/`);
                expect(stubs.sentry.captureMessage).to.not.have.been.called;
            });

            [
                { label: 'une barre finale', input: `https://${HOST}/`, expected: `https://${HOST}` },
                { label: 'plusieurs barres finales', input: `https://${HOST}///`, expected: `https://${HOST}` },
                { label: 'des espaces autour', input: `  https://${HOST}  `, expected: `https://${HOST}` },
                { label: 'des espaces autour et des barres finales', input: `  https://${HOST}///  `, expected: `https://${HOST}` },
                { label: 'un port et un chemin avec barre finale', input: `https://${HOST}:8448/prefixe/`, expected: `https://${HOST}:8448/prefixe` },
            ].forEach(({ label, input, expected }) => {
                it(`nettoie la valeur (${label}) : jamais de "//_matrix" dans l'URL d'envoi`, async () => {
                    await sendOnce(envFor('production', input));

                    const url = sentUrl();
                    expect(url).to.not.include('//_matrix');
                    expect(url.startsWith(`${expected}/_matrix/client/v3/rooms/`), `URL inattendue : ${url}`).to.be.eql(true);
                    expect(stubs.sentry.captureMessage).to.not.have.been.called;
                });
            });

            it('accepte un schéma en majuscules (HTTPS://)', async () => {
                await sendOnce(envFor('production', `HTTPS://${HOST}`));

                const url = sentUrl();
                expect(url.toLowerCase().startsWith(`https://${HOST}/_matrix/client/v3/rooms/`), `URL inattendue : ${url}`).to.be.eql(true);
                expect(stubs.sentry.captureMessage).to.not.have.been.called;
            });

            ['http://localhost:8008', 'http://127.0.0.1:8008', 'http://[::1]:8008'].forEach((baseUrl) => {
                (['development', 'test', undefined, ''] as NodeEnv[]).forEach((nodeEnv) => {
                    it(`tolère ${baseUrl} hors production (NODE_ENV ${nodeEnvLabel(nodeEnv)})`, async () => {
                        await sendOnce(envFor(nodeEnv, baseUrl));

                        const url = sentUrl();
                        expect(url.startsWith(`${baseUrl}/_matrix/client/v3/rooms/`), `URL inattendue : ${url}`).to.be.eql(true);
                        expect(stubs.sentry.captureMessage).to.not.have.been.called;
                    });
                });
            });

            it('tolère http://localhost:8008/ avec barre finale hors production, sans "//_matrix"', async () => {
                await sendOnce(envFor('development', 'http://localhost:8008/'));

                const url = sentUrl();
                expect(url).to.not.include('//_matrix');
                expect(url.startsWith('http://localhost:8008/_matrix/client/v3/rooms/')).to.be.eql(true);
            });

            it('les 17 salons configurés restent utilisables avec une URL https (barre finale comprise)', async () => {
                const env: Record<string, string | undefined> = { NODE_ENV: 'production', RB_API_TCHAP_BASE_URL: `https://${HOST}/` };
                CHANNEL_KEYS.forEach((key) => {
                    env[envVarName(key)] = `!salon-${key}:serveur.test`;
                });
                const { default: tchap } = loadTchap(env);

                const triggered = CHANNEL_KEYS.filter(key => TRIGGERS_BY_KEY[key] !== null);
                await triggered.reduce(async (previous, key) => {
                    await previous;
                    stubs.fetch.resetHistory();
                    await (TRIGGERS_BY_KEY[key] as (t: TchapModule['default']) => Promise<unknown>)(tchap);
                    expect(sentRoomId(), key).to.be.eql(`!salon-${key}:serveur.test`);
                    expect(String(stubs.fetch.firstCall.args[0])).to.not.include('//_matrix');
                }, Promise.resolve());
                expect(triggered).to.have.lengthOf(16);
                expect(stubs.sentry.captureMessage).to.not.have.been.called;
            });
        });

        describe('URL refusée : aucun fetch, un seul message Sentry', () => {
            const REFUSED: { label: string, nodeEnv: NodeEnv, baseUrl: string }[] = [
                { label: 'http://matrix.example.test en production', nodeEnv: 'production', baseUrl: `http://${HOST}` },
                { label: 'http://matrix.example.test hors production', nodeEnv: 'development', baseUrl: `http://${HOST}` },
                { label: 'http://localhost en production', nodeEnv: 'production', baseUrl: 'http://localhost' },
                { label: 'http://localhost:8008 en production', nodeEnv: 'production', baseUrl: 'http://localhost:8008' },
                { label: 'http://127.0.0.1:8008 en production', nodeEnv: 'production', baseUrl: 'http://127.0.0.1:8008' },
                { label: 'http://[::1]:8008 en production', nodeEnv: 'production', baseUrl: 'http://[::1]:8008' },
                { label: 'http://example.com hors production', nodeEnv: 'development', baseUrl: 'http://example.com' },
                { label: 'http://example.com avec NODE_ENV absent', nodeEnv: undefined, baseUrl: 'http://example.com' },
                { label: 'http://localhost.example.com (faux localhost) hors production', nodeEnv: 'development', baseUrl: 'http://localhost.example.com' },
                { label: 'http://localhost@example.com (hôte réel example.com) hors production', nodeEnv: 'development', baseUrl: 'http://localhost@example.com' },
                { label: 'ftp://matrix.example.test', nodeEnv: 'production', baseUrl: `ftp://${HOST}` },
                { label: 'ftp://matrix.example.test hors production', nodeEnv: 'development', baseUrl: `ftp://${HOST}` },
                { label: 'pas une url', nodeEnv: 'production', baseUrl: 'pas une url' },
                { label: 'pas une url hors production', nodeEnv: 'development', baseUrl: 'pas une url' },
                { label: 'https:// sans hôte', nodeEnv: 'production', baseUrl: 'https://' },
                { label: 'https:// sans hôte hors production', nodeEnv: 'development', baseUrl: 'https://' },
                { label: 'un hôte sans schéma', nodeEnv: 'production', baseUrl: HOST },
            ];

            REFUSED.forEach(({ label, nodeEnv, baseUrl }) => {
                it(`refuse ${label}`, async () => {
                    await sendOnce(envFor(nodeEnv, baseUrl));

                    expectRejectedOnce();
                });
            });

            it('n\'émet un message Sentry qu\'une seule fois pour plusieurs envois successifs avec la même URL invalide', async () => {
                const { default: tchap } = loadTchap(envFor('production', `http://${HOST}`));

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
                await tchap.triggerNotifyNewUserFromRectorat(distinctiveUser());

                expectRejectedOnce();
            });

            it('réinitialise le drapeau au rechargement du module (un message par processus)', async () => {
                await sendOnce(envFor('production', `http://${HOST}`));
                await sendOnce(envFor('production', `http://${HOST}`));

                expect(stubs.fetch).to.not.have.been.called;
                expect(stubs.sentry.captureMessage).to.have.been.calledTwice;
            });

            it('n\'envoie aucune valeur de l\'URL à Sentry, identifiants compris', async () => {
                await sendOnce(envFor('production', `http://utilisateur:motdepasse@${HOST}:8008/prive/`));

                expectRejectedOnce();
                const serialized = serializeSentryArgs();
                ['utilisateur:motdepasse', 'motdepasse', 'utilisateur', HOST, '8008', 'prive', 'token-de-test'].forEach((forbidden) => {
                    expect(serialized, `"${forbidden}" ne doit pas partir vers Sentry`).to.not.include(forbidden);
                });
            });

            it('ne fait jamais circuler le jeton : aucun fetch même hors production avec http vers un hôte quelconque', async () => {
                const { default: tchap } = loadTchap(envFor('development', 'http://example.com'));

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(stubs.fetch).to.not.have.been.called;
            });

            it('ne perturbe pas les autres chemins : un salon non configuré reste signalé comme avant', async () => {
                const { default: tchap } = loadTchap({
                    NODE_ENV: 'production',
                    RB_API_TCHAP_BASE_URL: `https://${HOST}`,
                    [ENV_VARS.autoDesactivations]: undefined,
                });

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(stubs.fetch).to.not.have.been.called;
                expectMissingVariableReported('notif-auto-desactivations');
            });
        });
    });

    describe('contrôle du format du room ID du salon', () => {
        const formatMessage = (channelKey: string): string => `[Tchap] Salon "${channelKey}" : identifiant invalide (un room ID commençant par "!" est attendu) : notification non envoyée`;

        const INVALID_ROOM_IDS: { label: string, value: string }[] = [
            { label: 'un alias (#salon:serveur)', value: '#notif-canicule:serveur.test' },
            { label: 'une URL collée', value: 'https://www.tchap.gouv.fr/#/room/!abc:serveur.test' },
            { label: 'une valeur sans "!"', value: 'abc:serveur.test' },
            { label: 'une clé de salon', value: 'notif-canicule' },
            { label: 'un "!" seul', value: '!' },
            { label: 'un espace après le "!"', value: '! abc:serveur.test' },
            { label: 'un espace interne', value: '!abc:serveur.test salon' },
            { label: 'un retour à la ligne interne', value: '!abc:serveur.test\nsalon' },
        ];

        const VALID_ROOM_IDS: { label: string, value: string }[] = [
            { label: 'un room ID avec serveur', value: '!abc:serveur.test' },
            { label: 'un room ID sans serveur', value: '!abc' },
            { label: 'un room ID entouré d\'espaces (trim)', value: '  !abc:serveur.test  ' },
            { label: 'un room ID suivi d\'un retour à la ligne (trim)', value: '!abc:serveur.test\n' },
            { label: 'un room ID avec majuscules, chiffres, "_" et "-"', value: '!Ab12_cD-34ef:Serveur-1.test' },
        ];

        // clés de salon distinctes, utilisées en production
        const PRODUCTION_KEYS = ['notif-canicule', 'notif-auto-desactivations', 'tech', 'notif-requetes-cadastre'];

        function triggerFor(channelKey: string): (tchap: TchapModule['default']) => Promise<unknown> {
            const trigger = TRIGGERS_BY_KEY[channelKey];
            expect(trigger, `aucune fonction trigger pour ${channelKey}`).to.not.be.null;
            return trigger as (tchap: TchapModule['default']) => Promise<unknown>;
        }

        function productionEnvWith(channelKey: string, value: string): Record<string, string | undefined> {
            return { NODE_ENV: 'production', [envVarName(channelKey)]: value };
        }

        /**
         * Vérifie : un seul message Sentry (captureMessage, options exactes), aucun captureException,
         * aucun fetch, et la valeur invalide absente des arguments Sentry sérialisés.
         */
        function expectFormatRejectedOnce(channelKey: string, value: string): void {
            expect(stubs.fetch).to.not.have.been.called;
            expect(stubs.sentry.captureException).to.not.have.been.called;
            expect(stubs.sentry.captureMessage, `événements Sentry reçus : ${JSON.stringify(sentryEvents())}`).to.have.been.calledOnce;
            const [message, options] = stubs.sentry.captureMessage.firstCall.args as [string, unknown];
            expect(message).to.be.eql(formatMessage(channelKey));
            expect(options).to.be.eql({ level: 'error', extra: { channel: channelKey } });

            const trimmed = value.trim();
            // la valeur « ! » figure légitimement dans le message : seul le reste est contrôlé
            if (!message.includes(trimmed)) {
                const serialized = serializeSentryArgs();
                [trimmed, JSON.stringify(trimmed).slice(1, -1), encodeURIComponent(trimmed)].forEach((forbidden) => {
                    expect(serialized, `"${forbidden}" ne doit pas partir vers Sentry`).to.not.include(forbidden);
                });
                trimmed.split(/\s+/).filter(fragment => fragment.length > 3).forEach((fragment) => {
                    expect(serialized, `"${fragment}" ne doit pas partir vers Sentry`).to.not.include(fragment);
                });
            }
        }

        describe('valeur invalide en production', () => {
            INVALID_ROOM_IDS.forEach(({ label, value }) => {
                it(`n'envoie rien et signale une seule fois à Sentry avec ${label}`, async () => {
                    const { default: tchap } = loadTchap(productionEnvWith('notif-auto-desactivations', value));

                    await triggerFor('notif-auto-desactivations')(tchap);

                    expectFormatRejectedOnce('notif-auto-desactivations', value);
                });
            });

            PRODUCTION_KEYS.forEach((channelKey) => {
                it(`nomme la clé effective ${channelKey} dans le message`, async () => {
                    const { default: tchap } = loadTchap(productionEnvWith(channelKey, '#salon-invalide:serveur.test'));

                    await triggerFor(channelKey)(tchap);

                    expectFormatRejectedOnce(channelKey, '#salon-invalide:serveur.test');
                });
            });

            it('émet un message par tentative d\'envoi (pas de drapeau « une fois »)', async () => {
                const { default: tchap } = loadTchap(productionEnvWith('notif-auto-desactivations', '#alias:serveur.test'));

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(stubs.fetch).to.not.have.been.called;
                expect(stubs.sentry.captureException).to.not.have.been.called;
                expect(stubs.sentry.captureMessage).to.have.been.calledThrice;
                stubs.sentry.captureMessage.getCalls().forEach((call) => {
                    expect(call.args).to.be.eql([
                        formatMessage('notif-auto-desactivations'),
                        { level: 'error', extra: { channel: 'notif-auto-desactivations' } },
                    ]);
                });
            });

            it('rejette une valeur invalide même entourée d\'espaces, sans la citer', async () => {
                const { default: tchap } = loadTchap(productionEnvWith('notif-auto-desactivations', '   #secret-alias:serveur.test   '));

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expectFormatRejectedOnce('notif-auto-desactivations', '#secret-alias:serveur.test');
            });

            it('ne laisse apparaître aucune donnée du message ni de l\'utilisateur dans Sentry', async () => {
                const { default: tchap } = loadTchap(productionEnvWith('notif-canicule', '#alias:serveur.test'));

                await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);

                expectFormatRejectedOnce('notif-canicule', '#alias:serveur.test');
                const serialized = serializeSentryArgs();
                [DISTINCTIVE_FIRST_NAME, DISTINCTIVE_LAST_NAME, 'Alerte Résorption', 'formatted_body', 'token-de-test', 'RB_API_TCHAP_'].forEach((forbidden) => {
                    expect(serialized, `"${forbidden}" ne doit pas partir vers Sentry`).to.not.include(forbidden);
                });
            });
        });

        describe('valeur invalide hors production', () => {
            [
                { label: 'NODE_ENV="development"', nodeEnv: 'development' },
                { label: 'NODE_ENV absent', nodeEnv: undefined },
                { label: 'NODE_ENV="staging"', nodeEnv: 'staging' },
            ].forEach(({ label, nodeEnv }) => {
                it(`valide la valeur de notif-dev-test et nomme notif-dev-test (${label}), quelle que soit la clé demandée`, async () => {
                    const { default: tchap } = loadTchap({
                        NODE_ENV: nodeEnv,
                        [ENV_VARS.devTest]: '#dev:serveur.test',
                        [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
                    });

                    await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                    expectFormatRejectedOnce('notif-dev-test', '#dev:serveur.test');
                });
            });

            it('ignore une valeur invalide dans le salon de la clé demandée quand notif-dev-test est valide', async () => {
                const { default: tchap } = loadTchap({
                    NODE_ENV: 'development',
                    [ENV_VARS.devTest]: FROM_ENV.devTest,
                    [ENV_VARS.autoDesactivations]: '#alias:serveur.test',
                });

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(sentRoomId()).to.be.eql(FROM_ENV.devTest);
                expect(stubs.sentry.captureMessage).to.not.have.been.called;
                expect(stubs.sentry.captureException).to.not.have.been.called;
            });
        });

        describe('valeur valide', () => {
            VALID_ROOM_IDS.forEach(({ label, value }) => {
                it(`envoie le message avec ${label}, sans message de format`, async () => {
                    const { default: tchap } = loadTchap(productionEnvWith('notif-auto-desactivations', value));

                    await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                    expect(sentRoomId()).to.be.eql(value.trim());
                    expect(String(stubs.fetch.firstCall.args[0])).to.include(`/rooms/${encodeURIComponent(value.trim())}/send/`);
                    expect(stubs.sentry.captureMessage).to.not.have.been.called;
                    expect(stubs.sentry.captureException).to.not.have.been.called;
                });
            });

            it('valide aussi la valeur de notif-dev-test hors production', async () => {
                const { default: tchap } = loadTchap({ NODE_ENV: 'development', [ENV_VARS.devTest]: '!abc' });

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(sentRoomId()).to.be.eql('!abc');
                expect(stubs.sentry.captureMessage).to.not.have.been.called;
            });
        });

        describe('isolement entre salons', () => {
            it('une valeur invalide dans un autre salon n\'a aucun effet sur le salon visé', async () => {
                const { default: tchap } = loadTchap({
                    NODE_ENV: 'production',
                    [envVarName('notif-canicule')]: '#notif-canicule:serveur.test',
                    [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
                });

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(sentRoomId()).to.be.eql(FROM_ENV.autoDesactivations);
                expect(stubs.sentry.captureMessage).to.not.have.been.called;
                expect(stubs.sentry.captureException).to.not.have.been.called;
            });

            it('le salon invalide est signalé sans bloquer l\'envoi sur le salon valide dans le même processus', async () => {
                const { default: tchap } = loadTchap({
                    NODE_ENV: 'production',
                    [envVarName('notif-canicule')]: '#notif-canicule:serveur.test',
                    [ENV_VARS.autoDesactivations]: FROM_ENV.autoDesactivations,
                });

                await tchap.triggerHeatwaveStatusChange(distinctiveUser(), fakeTown, true);
                expect(stubs.fetch).to.not.have.been.called;
                expect(stubs.sentry.captureMessage).to.have.been.calledOnce;

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());
                expect(sentRoomId()).to.be.eql(FROM_ENV.autoDesactivations);
                expect(stubs.sentry.captureMessage).to.have.been.calledOnce;
            });
        });

        describe('ordre des contrôles', () => {
            it('URL du serveur refusée et room ID invalide : seul le message BASE_URL est émis', async () => {
                const { default: tchap } = loadTchap({
                    NODE_ENV: 'production',
                    RB_API_TCHAP_BASE_URL: 'http://matrix.example.test',
                    [ENV_VARS.autoDesactivations]: '#alias:serveur.test',
                });

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(stubs.fetch).to.not.have.been.called;
                expect(stubs.sentry.captureException).to.not.have.been.called;
                expect(sentryEvents()).to.have.lengthOf(1);
                expect(stubs.sentry.captureMessage).to.have.been.calledOnceWithExactly(
                    '[Tchap] RB_API_TCHAP_BASE_URL invalide ou non sécurisée (https:// requis) : notification non envoyée',
                    { level: 'error' },
                );
                expect(serializeSentryArgs()).to.not.include('alias');
            });

            it('salon non configuré : seul le message « non configuré » est émis, pas celui du format', async () => {
                const { default: tchap } = loadTchap({
                    NODE_ENV: 'production',
                    [ENV_VARS.autoDesactivations]: '   ',
                });

                await tchap.triggerNotifyNewUserSelfDeactivation(distinctiveUser());

                expect(stubs.fetch).to.not.have.been.called;
                expect(sentryEvents()).to.have.lengthOf(1);
                expectMissingVariableReported('notif-auto-desactivations');
            });
        });
    });
});
