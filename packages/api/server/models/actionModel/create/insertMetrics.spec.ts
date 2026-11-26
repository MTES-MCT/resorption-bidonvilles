import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { rewiremock } from '#test/rewiremock';
import { ActionInput } from '#server/services/action/ActionInput.d';

const { expect } = chai;
chai.use(sinonChai);

/**
 * Contrat testé : `create/insertMetrics.ts`
 *
 *   insertMetrics(actionId, authorId, data, transaction, versionId?: number | null)
 *
 * Sans versionId : requête strictement inchangée (création d'action), sans colonne fk_version.
 * Avec versionId : la colonne fk_version est insérée, avec versionId pour chaque ligne.
 */
const sandbox = sinon.createSandbox();
const stubs = {
    sequelize: {
        query: sandbox.stub(),
    },
};

rewiremock('sequelize').with({ QueryTypes: { INSERT: 'INSERT' } });
rewiremock('#db/sequelize').with({ sequelize: stubs.sequelize });
rewiremock.passBy(/hasMetricValues/);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import insertMetrics from './insertMetrics';
rewiremock.disable();

type Indicateurs = ActionInput['indicateurs'][string];

function buildData(years: number[]): ActionInput {
    return {
        indicateurs: years.reduce((acc, year) => ({
            ...acc,
            [year]: { nombre_personnes: year, nombre_menages: 0 } as unknown as Indicateurs,
        }), {}),
    } as unknown as ActionInput;
}

function extractColumns(sql: string): string[] {
    const match = sql.match(/INSERT INTO action_metrics\(([\s\S]*?)\)\s*VALUES/);
    return match[1].split(',').map(column => column.trim());
}

describe('models/actionModel/create/insertMetrics()', () => {
    const actionId = 7;
    const authorId = 12;
    const transaction = {} as any;

    beforeEach(() => {
        stubs.sequelize.query.resolves();
    });

    afterEach(() => {
        sandbox.reset();
    });

    after(() => {
        sandbox.restore();
    });

    it('n\'exécute aucune requête quand aucune année n\'a de valeur', async () => {
        await insertMetrics(actionId, authorId, { indicateurs: { 2022: { nombre_personnes: null } } } as unknown as ActionInput, transaction);

        expect(stubs.sequelize.query).not.to.have.been.called;
    });

    describe('sans versionId (création d\'action)', () => {
        it('n\'inclut pas la colonne fk_version', async () => {
            await insertMetrics(actionId, authorId, buildData([2022]), transaction);

            const [sql] = stubs.sequelize.query.firstCall.args;
            expect(sql).not.to.match(/fk_version/);
            const columns = extractColumns(sql);
            expect(columns).to.have.lengthOf(26);
            expect(columns[0]).to.equal('fk_action');
            expect(columns[columns.length - 1]).to.equal('created_by');
        });

        it('fournit 26 valeurs par année, dont l\'action en premier et l\'auteur en dernier', async () => {
            await insertMetrics(actionId, authorId, buildData([2022, 2023]), transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect(options.replacements).to.have.lengthOf(52);
            expect(options.replacements[0]).to.equal(actionId);
            expect(options.replacements[25]).to.equal(authorId);
            expect(options.replacements[26]).to.equal(actionId);
            expect(options.replacements[51]).to.equal(authorId);
            expect(options.type).to.equal('INSERT');
            expect(options.transaction).to.equal(transaction);
            expect(sql.match(/\?/g)).to.have.lengthOf(52);
        });
    });

    describe('avec versionId', () => {
        it('inclut la colonne fk_version', async () => {
            await insertMetrics(actionId, authorId, buildData([2022]), transaction, 55);

            const [sql] = stubs.sequelize.query.firstCall.args;
            const columns = extractColumns(sql);
            expect(columns).to.include('fk_version');
            expect(columns).to.have.lengthOf(27);
            expect(columns).to.include('fk_action');
            expect(columns).to.include('created_by');
        });

        it('fournit versionId pour chaque ligne, à la position de la colonne fk_version', async () => {
            await insertMetrics(actionId, authorId, buildData([2022, 2023, 2024]), transaction, 55);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            const columns = extractColumns(sql);
            const versionIndex = columns.indexOf('fk_version');
            const actionIndex = columns.indexOf('fk_action');
            const authorIndex = columns.indexOf('created_by');

            expect(options.replacements).to.have.lengthOf(columns.length * 3);
            expect(sql.match(/\?/g)).to.have.lengthOf(columns.length * 3);
            [0, 1, 2].forEach((row) => {
                expect(options.replacements[row * columns.length + versionIndex]).to.equal(55);
                expect(options.replacements[row * columns.length + actionIndex]).to.equal(actionId);
                expect(options.replacements[row * columns.length + authorIndex]).to.equal(authorId);
            });
        });

        it('exécute la requête de type INSERT dans la transaction', async () => {
            await insertMetrics(actionId, authorId, buildData([2022]), transaction, 55);

            const [, options] = stubs.sequelize.query.firstCall.args;
            expect(options.type).to.equal('INSERT');
            expect(options.transaction).to.equal(transaction);
        });
    });
});

describe('models/actionModel/create/insertMetrics() - dates de fraîcheur par nature', () => {
    const actionId = 7;
    const authorId = 12;
    const transaction = {} as any;
    const now = new Date(2026, 5, 15, 10, 0, 0);
    const oldDate = new Date(2025, 2, 3, 8, 30, 0);
    let clock: sinon.SinonFakeTimers;

    type DatesByYear = Record<string, { updated_at_indicators: Date | null, updated_at_scolaire: Date | null }>;

    function readRow(sql: string, replacements: unknown[], row: number, column: string): unknown {
        const columns = extractColumns(sql);
        return replacements[row * columns.length + columns.indexOf(column)];
    }

    beforeEach(() => {
        clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
        stubs.sequelize.query.resolves();
    });

    afterEach(() => {
        clock.restore();
        // le sandbox est restauré (after) par le premier describe : on réinitialise le stub directement
        stubs.sequelize.query.reset();
    });

    describe('avec datesByYear', () => {
        it('ajoute les colonnes updated_at_indicators et updated_at_scolaire', async () => {
            const datesByYear: DatesByYear = { 2025: { updated_at_indicators: oldDate, updated_at_scolaire: oldDate } };
            await insertMetrics(actionId, authorId, buildData([2025]), transaction, 55, datesByYear);

            const [sql] = stubs.sequelize.query.firstCall.args;
            const columns = extractColumns(sql);
            expect(columns).to.include('updated_at_indicators');
            expect(columns).to.include('updated_at_scolaire');
            expect(columns).to.have.lengthOf(27);
        });

        it('fournit les deux dates de l\'année pour une année', async () => {
            const datesByYear: DatesByYear = { 2025: { updated_at_indicators: now, updated_at_scolaire: oldDate } };
            await insertMetrics(actionId, authorId, buildData([2025]), transaction, 55, datesByYear);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect(readRow(sql, options.replacements, 0, 'updated_at_indicators')).to.deep.equal(now);
            expect(readRow(sql, options.replacements, 0, 'updated_at_scolaire')).to.deep.equal(oldDate);
        });

        it('fournit à chaque ligne les dates de sa propre année pour plusieurs années', async () => {
            const date2023 = new Date(2024, 0, 10);
            const date2024 = new Date(2025, 0, 20);
            const datesByYear: DatesByYear = {
                2023: { updated_at_indicators: date2023, updated_at_scolaire: null },
                2024: { updated_at_indicators: null, updated_at_scolaire: date2024 },
                2025: { updated_at_indicators: now, updated_at_scolaire: now },
            };
            await insertMetrics(actionId, authorId, buildData([2023, 2024, 2025]), transaction, 55, datesByYear);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            const columns = extractColumns(sql);
            expect(options.replacements).to.have.lengthOf(columns.length * 3);
            expect(sql.match(/\?/g)).to.have.lengthOf(columns.length * 3);
            expect(readRow(sql, options.replacements, 0, 'updated_at_indicators')).to.deep.equal(date2023);
            expect(readRow(sql, options.replacements, 0, 'updated_at_scolaire')).to.equal(null);
            expect(readRow(sql, options.replacements, 1, 'updated_at_indicators')).to.equal(null);
            expect(readRow(sql, options.replacements, 1, 'updated_at_scolaire')).to.deep.equal(date2024);
            expect(readRow(sql, options.replacements, 2, 'updated_at_indicators')).to.deep.equal(now);
            expect(readRow(sql, options.replacements, 2, 'updated_at_scolaire')).to.deep.equal(now);
        });

        it('conserve null quand la nature est à null dans datesByYear, même si elle a des valeurs', async () => {
            const data = {
                indicateurs: { 2025: { nombre_personnes: 10, scolaire_nombre_college: 3 } },
            } as unknown as ActionInput;
            const datesByYear: DatesByYear = { 2025: { updated_at_indicators: null, updated_at_scolaire: oldDate } };
            await insertMetrics(actionId, authorId, data, transaction, 55, datesByYear);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect(readRow(sql, options.replacements, 0, 'updated_at_indicators')).to.equal(null);
            expect(readRow(sql, options.replacements, 0, 'updated_at_scolaire')).to.deep.equal(oldDate);
        });

        it('reporte une date ancienne différente de la date du jour', async () => {
            const datesByYear: DatesByYear = { 2025: { updated_at_indicators: oldDate, updated_at_scolaire: oldDate } };
            await insertMetrics(actionId, authorId, buildData([2025]), transaction, 55, datesByYear);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            const indicators = readRow(sql, options.replacements, 0, 'updated_at_indicators') as Date;
            expect(indicators.getTime()).to.equal(oldDate.getTime());
            expect(indicators.getTime()).not.to.equal(now.getTime());
        });

        it('ignore une année sans valeur même si elle figure dans datesByYear', async () => {
            const data = {
                indicateurs: {
                    2024: { nombre_personnes: null, nombre_menages: '' },
                    2025: { nombre_personnes: 4 },
                },
            } as unknown as ActionInput;
            const datesByYear: DatesByYear = {
                2024: { updated_at_indicators: oldDate, updated_at_scolaire: oldDate },
                2025: { updated_at_indicators: now, updated_at_scolaire: null },
            };
            await insertMetrics(actionId, authorId, data, transaction, 55, datesByYear);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            const columns = extractColumns(sql);
            expect(options.replacements).to.have.lengthOf(columns.length);
            expect(sql.match(/\?/g)).to.have.lengthOf(columns.length);
            expect(readRow(sql, options.replacements, 0, 'updated_at_indicators')).to.deep.equal(now);
            expect(readRow(sql, options.replacements, 0, 'updated_at_scolaire')).to.equal(null);
        });

        it('conserve fk_version, fk_action et created_by aux bonnes positions', async () => {
            const datesByYear: DatesByYear = { 2025: { updated_at_indicators: now, updated_at_scolaire: null } };
            await insertMetrics(actionId, authorId, buildData([2025]), transaction, 55, datesByYear);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect(readRow(sql, options.replacements, 0, 'fk_version')).to.equal(55);
            expect(readRow(sql, options.replacements, 0, 'fk_action')).to.equal(actionId);
            expect(readRow(sql, options.replacements, 0, 'created_by')).to.equal(authorId);
        });
    });

    describe('sans datesByYear (création d\'action)', () => {
        it('ajoute les deux colonnes de fraîcheur, avec 26 colonnes sans fk_version', async () => {
            await insertMetrics(actionId, authorId, buildData([2025]), transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            const columns = extractColumns(sql);
            expect(columns).to.include('updated_at_indicators');
            expect(columns).to.include('updated_at_scolaire');
            expect(columns).not.to.include('fk_version');
            expect(columns).to.have.lengthOf(26);
            expect(options.replacements).to.have.lengthOf(26);
            expect(sql.match(/\?/g)).to.have.lengthOf(26);
        });

        it('renseigne la date du jour pour une nature non scolaire seule et null pour le scolaire', async () => {
            const data = { indicateurs: { 2025: { nombre_personnes: 10 } } } as unknown as ActionInput;
            await insertMetrics(actionId, authorId, data, transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            const indicators = readRow(sql, options.replacements, 0, 'updated_at_indicators');
            expect(indicators).to.be.instanceOf(Date);
            expect((indicators as Date).getTime()).to.equal(now.getTime());
            expect(readRow(sql, options.replacements, 0, 'updated_at_scolaire')).to.equal(null);
        });

        it('renseigne la date du jour pour le scolaire seul et null pour le non scolaire', async () => {
            const data = { indicateurs: { 2025: { scolaire_nombre_college: 5 } } } as unknown as ActionInput;
            await insertMetrics(actionId, authorId, data, transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect(readRow(sql, options.replacements, 0, 'updated_at_indicators')).to.equal(null);
            const scolaire = readRow(sql, options.replacements, 0, 'updated_at_scolaire');
            expect(scolaire).to.be.instanceOf(Date);
            expect((scolaire as Date).getTime()).to.equal(now.getTime());
        });

        it('renseigne la date du jour pour les deux natures quand elles ont des valeurs', async () => {
            const data = {
                indicateurs: { 2025: { nombre_personnes: 10, scolaire_nombre_lycee: 2 } },
            } as unknown as ActionInput;
            await insertMetrics(actionId, authorId, data, transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect((readRow(sql, options.replacements, 0, 'updated_at_indicators') as Date).getTime()).to.equal(now.getTime());
            expect((readRow(sql, options.replacements, 0, 'updated_at_scolaire') as Date).getTime()).to.equal(now.getTime());
        });

        it('considère une nature à null, undefined ou chaîne vide comme vide', async () => {
            const data = {
                indicateurs: {
                    2025: {
                        nombre_personnes: 10,
                        scolaire_nombre_college: null,
                        scolaire_nombre_lycee: undefined,
                        scolaire_nombre_autre: '',
                    },
                },
            } as unknown as ActionInput;
            await insertMetrics(actionId, authorId, data, transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect(readRow(sql, options.replacements, 0, 'updated_at_scolaire')).to.equal(null);
            expect(readRow(sql, options.replacements, 0, 'updated_at_indicators')).to.be.instanceOf(Date);
        });

        it('compte 0 comme une valeur', async () => {
            const data = {
                indicateurs: { 2025: { nombre_personnes: null, nombre_menages: 0, scolaire_nombre_college: 0 } },
            } as unknown as ActionInput;
            await insertMetrics(actionId, authorId, data, transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect(readRow(sql, options.replacements, 0, 'updated_at_indicators')).to.be.instanceOf(Date);
            expect(readRow(sql, options.replacements, 0, 'updated_at_scolaire')).to.be.instanceOf(Date);
        });

        it('évalue la nature ligne par ligne pour plusieurs années, avec des placeholders cohérents', async () => {
            const data = {
                indicateurs: {
                    2023: { nombre_personnes: 5 },
                    2024: { scolaire_nombre_college: 1 },
                    2025: { nombre_personnes: 5, scolaire_nombre_college: 1 },
                },
            } as unknown as ActionInput;
            await insertMetrics(actionId, authorId, data, transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            const columns = extractColumns(sql);
            expect(options.replacements).to.have.lengthOf(columns.length * 3);
            expect(sql.match(/\?/g)).to.have.lengthOf(columns.length * 3);
            expect(readRow(sql, options.replacements, 0, 'updated_at_indicators')).to.be.instanceOf(Date);
            expect(readRow(sql, options.replacements, 0, 'updated_at_scolaire')).to.equal(null);
            expect(readRow(sql, options.replacements, 1, 'updated_at_indicators')).to.equal(null);
            expect(readRow(sql, options.replacements, 1, 'updated_at_scolaire')).to.be.instanceOf(Date);
            expect(readRow(sql, options.replacements, 2, 'updated_at_indicators')).to.be.instanceOf(Date);
            expect(readRow(sql, options.replacements, 2, 'updated_at_scolaire')).to.be.instanceOf(Date);
        });

        it('ignore une année sans valeur et n\'écrit aucune ligne pour elle', async () => {
            const data = {
                indicateurs: { 2024: { nombre_personnes: null }, 2025: { nombre_personnes: 2 } },
            } as unknown as ActionInput;
            await insertMetrics(actionId, authorId, data, transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            const columns = extractColumns(sql);
            expect(options.replacements).to.have.lengthOf(columns.length);
            expect(sql.match(/\?/g)).to.have.lengthOf(columns.length);
        });

        it('conserve la date de ligne : 31/12 pour une année passée, date du jour sinon', async () => {
            await insertMetrics(actionId, authorId, buildData([2024, 2026]), transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect(readRow(sql, options.replacements, 0, 'date')).to.deep.equal(new Date(2024, 11, 31, 23, 59, 59));
            expect((readRow(sql, options.replacements, 1, 'date') as Date).getTime()).to.equal(now.getTime());
        });
    });
});
