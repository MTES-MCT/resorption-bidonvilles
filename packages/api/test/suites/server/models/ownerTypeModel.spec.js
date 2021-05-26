// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
} = require('#server/models/ownerTypeModel')(db);

const fixtures = require('#fixtures/server/models/ownerTypeModel.fixtures');

// tests
describe('[/server/models] ownerTypeModel', () => {
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
        it('it returns all owner types from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const ownerTypes = await findAll();
            expect(ownerTypes).to.eql(fixtures.findAll.output);
        });
    });
});
