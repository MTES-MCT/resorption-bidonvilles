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
            expect(columns).to.have.lengthOf(24);
            expect(columns[0]).to.equal('fk_action');
            expect(columns[columns.length - 1]).to.equal('created_by');
        });

        it('fournit 24 valeurs par année, dont l\'action en premier et l\'auteur en dernier', async () => {
            await insertMetrics(actionId, authorId, buildData([2022, 2023]), transaction);

            const [sql, options] = stubs.sequelize.query.firstCall.args;
            expect(options.replacements).to.have.lengthOf(48);
            expect(options.replacements[0]).to.equal(actionId);
            expect(options.replacements[23]).to.equal(authorId);
            expect(options.replacements[24]).to.equal(actionId);
            expect(options.replacements[47]).to.equal(authorId);
            expect(options.type).to.equal('INSERT');
            expect(options.transaction).to.equal(transaction);
            expect(sql.match(/\?/g)).to.have.lengthOf(48);
        });
    });

    describe('avec versionId', () => {
        it('inclut la colonne fk_version', async () => {
            await insertMetrics(actionId, authorId, buildData([2022]), transaction, 55);

            const [sql] = stubs.sequelize.query.firstCall.args;
            const columns = extractColumns(sql);
            expect(columns).to.include('fk_version');
            expect(columns).to.have.lengthOf(25);
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
