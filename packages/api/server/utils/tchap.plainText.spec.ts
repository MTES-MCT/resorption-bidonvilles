import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dotenv from 'dotenv';

import { rewiremock } from '#test/rewiremock';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();

const MAX_DURATION_MS = 500;

type HtmlToPlainText = (html: string) => string;

type TchapModule = {
    htmlToPlainText?: HtmlToPlainText,
};

const stubs = {
    statusDetails: {},
    formatActionFullName: { getActionFullName: sandbox.stub() },
    sentry: { captureMessage: sandbox.stub(), captureException: sandbox.stub() },
};

const initialEnv: Record<string, string | undefined> = {
    NODE_ENV: process.env.NODE_ENV,
    RB_API_TCHAP_TOKEN: process.env.RB_API_TCHAP_TOKEN,
    RB_API_TCHAP_BASE_URL: process.env.RB_API_TCHAP_BASE_URL,
};

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
 * Charge tchap (import * pour ne pas échouer à la compilation tant que htmlToPlainText
 * n'est pas exportée) et retourne la fonction exportée, ou échoue si ce n'est pas une fonction.
 */
function loadHtmlToPlainText(): HtmlToPlainText {
    process.env.NODE_ENV = 'production';
    process.env.RB_API_TCHAP_TOKEN = 'token-de-test';
    process.env.RB_API_TCHAP_BASE_URL = 'https://tchap.test';

    clearModulesCache();

    rewiremock('#server/utils/statusDetails').with(stubs.statusDetails);
    rewiremock('#server/utils/formatActionFullName').with(stubs.formatActionFullName);
    rewiremock('@sentry/node').with(stubs.sentry);
    rewiremock('node:crypto').callThrough();

    rewiremock.enable();
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    const tchapModule = require('./tchap') as TchapModule;
    rewiremock.disable();

    // l'échec est reporté à l'appel (donc dans chaque test) et non dans le hook beforeEach
    return function convert(html: string): string {
        const { htmlToPlainText } = tchapModule;
        if (typeof htmlToPlainText !== 'function') {
            throw new TypeError('htmlToPlainText n\'est pas une fonction exportée par #server/utils/tchap');
        }
        return htmlToPlainText(html);
    };
}

/**
 * Mesure en millisecondes la durée d'exécution d'une conversion.
 */
function measureMs(convert: HtmlToPlainText, input: string): number {
    const start = process.hrtime.bigint();
    convert(input);
    return Number(process.hrtime.bigint() - start) / 1e6;
}

describe('utils/tchap htmlToPlainText', () => {
    let htmlToPlainText: HtmlToPlainText;

    before(() => {
        sandbox.stub(dotenv, 'config').returns({});
    });

    beforeEach(() => {
        htmlToPlainText = loadHtmlToPlainText();
    });

    afterEach(() => {
        sandbox.resetHistory();
        clearModulesCache();
        Object.entries(initialEnv).forEach(([key, value]) => {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        });
    });

    after(() => {
        sandbox.restore();
    });

    describe('performance (complexité linéaire)', () => {
        it('convertit en moins de 500 ms une longue suite de "<a " sans fermeture', function slowSuite() {
            this.timeout(15000);
            expect(measureMs(htmlToPlainText, '<a '.repeat(100000))).to.be.below(MAX_DURATION_MS);
        });

        it('convertit en moins de 500 ms une longue suite de "<" sans fermeture', function slowSuite() {
            this.timeout(15000);
            expect(measureMs(htmlToPlainText, '<'.repeat(400000))).to.be.below(MAX_DURATION_MS);
        });

        it('convertit en moins de 500 ms une longue suite de liens ouvrants sans </a>', function slowSuite() {
            this.timeout(15000);
            expect(measureMs(htmlToPlainText, '<a href="x">'.repeat(50000))).to.be.below(MAX_DURATION_MS);
        });
    });

    describe('équivalence fonctionnelle', () => {
        it('remplace un lien par son libellé', () => {
            expect(htmlToPlainText('<a href="https://x.test/a">texte</a>')).to.be.eql('texte');
        });

        it('remplace plusieurs liens d\'une même chaîne par leur libellé', () => {
            expect(htmlToPlainText('<a href="https://x.test/a">un</a> et <a href="https://x.test/b">deux</a>')).to.be.eql('un et deux');
        });

        it('retire les balises de mise en forme et convertit <br/> en saut de ligne', () => {
            expect(htmlToPlainText('<strong>gras</strong>: valeur<br/>suite')).to.be.eql('gras: valeur\nsuite');
        });

        it('convertit <br> et <BR /> en saut de ligne', () => {
            expect(htmlToPlainText('<br>')).to.be.eql('\n');
            expect(htmlToPlainText('<BR />')).to.be.eql('\n');
        });

        it('décode les entités après le retrait des balises', () => {
            expect(htmlToPlainText('&lt;b&gt;')).to.be.eql('<b>');
            expect(htmlToPlainText('&quot;')).to.be.eql('"');
            expect(htmlToPlainText('&#039;')).to.be.eql('\'');
            expect(htmlToPlainText('&#39;')).to.be.eql('\'');
        });

        it('décode &amp; en dernier (&amp;lt; donne &lt; et non <)', () => {
            expect(htmlToPlainText('&amp;lt;')).to.be.eql('&lt;');
            expect(htmlToPlainText('a &amp; b')).to.be.eql('a & b');
        });

        it('laisse inchangé un texte sans balise', () => {
            expect(htmlToPlainText('Un texte simple, sans balise.')).to.be.eql('Un texte simple, sans balise.');
        });

        it('conserve un chevron isolé sans > correspondant', () => {
            expect(htmlToPlainText('a < b')).to.be.eql('a < b');
        });
    });

    describe('cas limites', () => {
        it('retourne une chaîne vide pour une chaîne vide', () => {
            expect(htmlToPlainText('')).to.be.eql('');
        });
    });

    describe('sanitisation multi-caractères (balises imbriquées)', () => {
        const nestedInputs = [
            '<<b>script>alert(1)</script>',
            '<scr<b>ipt>alert(1)',
            '<<<b>>>script>',
            '<<a href="x">img src=x onerror=1>',
            '<<br>script>',
            '<<b><i>script>',
            '<<b>/<i>script>',
            'x<<b>y<i>z>',
        ];

        nestedInputs.forEach((input) => {
            it(`ne laisse aucune balise complète ni <script / <img dans la sortie de ${JSON.stringify(input)}`, () => {
                const output = htmlToPlainText(input);

                expect(/<[^>]*>/.test(output), `sortie : ${JSON.stringify(output)}`).to.be.eql(false);
                expect(output.toLowerCase()).not.to.include('<script');
                expect(output.toLowerCase()).not.to.include('<img');
            });
        });

        it('supprime du premier < jusqu\'au premier > suivant : <<b>script> donne script>', () => {
            expect(htmlToPlainText('<<b>script>')).to.be.eql('script>');
        });

        it('supprime du premier < jusqu\'au premier > suivant : <scr<b>ipt> donne ipt>', () => {
            expect(htmlToPlainText('<scr<b>ipt>')).to.be.eql('ipt>');
        });

        it('conserve un < sans > après lui : a < b reste inchangé', () => {
            expect(htmlToPlainText('a < b')).to.be.eql('a < b');
        });

        it('supprime l\'espace compris entre < et > : a < b > c donne "a  c"', () => {
            expect(htmlToPlainText('a < b > c')).to.be.eql('a  c');
        });

        it('supprime un < orphelin jusqu\'à la balise suivante : 1 < 2 et <b>gras</b> donne "1 gras"', () => {
            expect(htmlToPlainText('1 < 2 et <b>gras</b>')).to.be.eql('1 gras');
        });

        it('conserve tout ce qui suit un < sans > après lui : a <b>x</b> < c donne "a x < c"', () => {
            expect(htmlToPlainText('a <b>x</b> < c')).to.be.eql('a x < c');
        });

        describe('complexité', () => {
            const heavyInputs: Array<[string, string]> = [
                ['400000 "<"', '<'.repeat(400000)],
                ['100000 "<a "', '<a '.repeat(100000)],
                ['200000 "<<" suivis de 10 ">"', '<<'.repeat(200000) + '>'.repeat(10)],
                ['100000 "<b>"', '<b>'.repeat(100000)],
            ];

            heavyInputs.forEach(([label, input]) => {
                it(`convertit en moins de 500 ms ${label}`, function slowSuite() {
                    this.timeout(15000);
                    expect(measureMs(htmlToPlainText, input)).to.be.below(MAX_DURATION_MS);
                });
            });
        });
    });
});
