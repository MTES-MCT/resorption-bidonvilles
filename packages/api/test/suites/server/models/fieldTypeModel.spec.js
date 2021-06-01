// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
} = require('#server/models/fieldTypeModel')(db);

const fixtures = require('#fixtures/server/models/fieldTypeModel.fixtures');

// tests
describe('[/server/models] fieldTypeModel', () => {
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
        it('it returns all field types from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const fieldTypes = await findAll();
            expect(fieldTypes).to.eql(fixtures.findAll.output);
        });
    });
});
