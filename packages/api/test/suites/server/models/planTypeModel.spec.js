// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
} = require('#server/models/planTypeModel')(db);

const fixtures = require('#fixtures/server/models/planTypeModel.fixtures');

// tests
describe('[/server/models] planTypeModel', () => {
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
        it('it returns all plan types from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const planTypes = await findAll();
            expect(planTypes).to.eql(fixtures.findAll.output);
        });
    });
});
