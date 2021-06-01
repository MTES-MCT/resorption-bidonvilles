// ut tools
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');

const { expect } = chai;
chai.use(chaiAsPromised);
chai.use(chaiSubset);

const db = global.db();
const {
    findAll,
    create,
} = require('#server/models/planModel')(db);

const fixtures = require('#fixtures/server/models/planModel.fixtures');

// tests
describe('[/server/models] planModel', () => {
    before(async () => {
        await db.authenticate();
    });

    after(async () => {
        await db.close();
    });

    beforeEach(async () => {
        await Promise.all([
            db.query('SELECT truncate_tables(\'fabnum\')'),
            db.query('SELECT reset_sequences()'),
        ]);
    });

    describe('.findAll()', () => {
        it('it returns all plans from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const plans = await findAll();
            expect(plans).to.eql(fixtures.findAll.output);
        });
    });

    describe('.create()', () => {
        fixtures.create.forEach(({ inputs, newInput, output }, index) => {
            it(`it inserts a new plan in the database (#${index + 1})`, async () => {
                await global.insertFixtures(db, inputs);

                await create(newInput);

                const [plan] = await db.query(
                    `SELECT
                        started_at,
                        ended_at,
                        targeted_on_towns,
                        fk_type,
                        fk_departement
                    FROM plans WHERE plan_id = 1`,
                    {
                        type: db.QueryTypes.SELECT,
                    },
                );

                expect(plan).to.eql(output);
            });
        });
    });
});
