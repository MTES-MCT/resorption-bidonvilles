import chai from 'chai';
import sinon from 'sinon';
import dotenv from 'dotenv';

// import à effet de bord : aligne le chargement du spec sur les autres specs (require disponible)
import '#test/rewiremock';

const { expect } = chai;

const sandbox = sinon.createSandbox();

const CONFIG_SUFFIX = '/server/config.ts';
const initialNodeEnv = process.env.NODE_ENV;

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
 * Applique NODE_ENV (undefined = variable absente), puis recharge config.
 */
function loadEnvironnement(nodeEnv: string | undefined): string {
    if (nodeEnv === undefined) {
        delete process.env.NODE_ENV;
    } else {
        process.env.NODE_ENV = nodeEnv;
    }

    clearConfigCache();
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const { default: config } = require('./config') as { default: { environnement: string } };
    return config.environnement;
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
});
