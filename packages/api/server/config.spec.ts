import chai from 'chai';
import sinon from 'sinon';
import dotenv from 'dotenv';

// import à effet de bord : aligne le chargement du spec sur les autres specs (require disponible)
import '#test/rewiremock';

const { expect } = chai;

const sandbox = sinon.createSandbox();

const CONFIG_SUFFIX = '/server/config.ts';
const initialNodeEnv = process.env.NODE_ENV;
const initialEnvLabel = process.env.RB_API_ENV_LABEL;

type LoadedConfig = { environnement: string, envLabel: string };

/**
 * Retire config du cache require, pour forcer une relecture de l'environnement au prochain import.
 */
function clearConfigCache(): void {
    Object.keys(require.cache)
        .filter(path => path.endsWith(CONFIG_SUFFIX))
        .forEach((path) => {
            delete require.cache[path];
        });
}

/**
 * Applique une variable d'environnement (undefined = variable absente).
 */
function setEnv(key: string, value: string | undefined): void {
    if (value === undefined) {
        delete process.env[key];
    } else {
        process.env[key] = value;
    }
}

/**
 * Applique NODE_ENV et RB_API_ENV_LABEL (undefined = variable absente), puis recharge config.
 */
function loadConfig(nodeEnv: string | undefined, envLabel?: string): LoadedConfig {
    setEnv('NODE_ENV', nodeEnv);
    setEnv('RB_API_ENV_LABEL', envLabel);

    clearConfigCache();
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const { default: config } = require('./config') as { default: LoadedConfig };
    return config;
}

function loadEnvironnement(nodeEnv: string | undefined): string {
    return loadConfig(nodeEnv).environnement;
}

function loadEnvLabel(envLabel: string | undefined): string {
    return loadConfig('development', envLabel).envLabel;
}

describe('server/config', () => {
    beforeEach(() => {
        // config.ts appelle dotenv.config() à l'import : on le neutralise pour ignorer le .env local
        sandbox.stub(dotenv, 'config').returns({});
    });

    afterEach(() => {
        sandbox.restore();
        if (initialNodeEnv === undefined) {
            delete process.env.NODE_ENV;
        } else {
            process.env.NODE_ENV = initialNodeEnv;
        }
        setEnv('RB_API_ENV_LABEL', initialEnvLabel);
        clearConfigCache();
    });

    describe('environnement', () => {
        [
            ['production', 'production'],
            ['staging', 'staging'],
            ['preprod', 'preprod'],
            ['development', 'development'],
            ['Production', 'Production'],
        ].forEach(([nodeEnv, expected]) => {
            it(`conserve la valeur de NODE_ENV telle quelle ("${nodeEnv}")`, () => {
                expect(loadEnvironnement(nodeEnv)).to.be.eql(expected);
            });
        });

        it('vaut "development" quand NODE_ENV est absente', () => {
            expect(loadEnvironnement(undefined)).to.be.eql('development');
        });

        it('vaut "development" quand NODE_ENV est vide', () => {
            expect(loadEnvironnement('')).to.be.eql('development');
        });
    });

    describe('envLabel', () => {
        [
            { label: 'absente', value: undefined },
            { label: 'vide', value: '' },
            { label: 'composée uniquement d\'espaces', value: '   ' },
            { label: 'composée de tabulations et d\'espaces', value: ' \t ' },
        ].forEach(({ label, value }) => {
            it(`vaut une chaîne vide quand RB_API_ENV_LABEL est ${label}`, () => {
                expect(loadEnvLabel(value)).to.be.eql('');
            });
        });

        [
            { value: 'PREPROD', expected: 'PREPROD' },
            { value: 'DEVELOPPEMENT', expected: 'DEVELOPPEMENT' },
            { value: ' PREPROD ', expected: 'PREPROD' },
        ].forEach(({ value, expected }) => {
            it(`vaut "${expected}" quand RB_API_ENV_LABEL vaut "${value}"`, () => {
                expect(loadEnvLabel(value)).to.be.eql(expected);
            });
        });

        it('est indépendante de NODE_ENV', () => {
            expect(loadConfig('production', 'PREPROD').envLabel).to.be.eql('PREPROD');
            expect(loadConfig('production', undefined).envLabel).to.be.eql('');
        });
    });
});
