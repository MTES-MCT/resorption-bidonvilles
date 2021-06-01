// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
} = require('#server/models/regionModel')(db);

const fixtures = require('#fixtures/server/models/regionModel.fixtures');

// tests
describe('[/server/models] regionModel', () => {
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
        it('it returns all regions from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const regions = await findAll();
            expect(regions).to.eql(fixtures.findAll.output);
        });
    });
});
