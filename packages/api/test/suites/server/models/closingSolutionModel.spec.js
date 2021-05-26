// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
} = require('#server/models/closingSolutionModel')(db);

const fixtures = require('#fixtures/server/models/closingSolutionModel.fixtures');

// tests
describe('[/server/models] closingSolutionModel', () => {
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
        it('it returns all closing solutions from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const closingSolutions = await findAll();
            expect(closingSolutions).to.eql(fixtures.findAll.output);
        });
    });
});
