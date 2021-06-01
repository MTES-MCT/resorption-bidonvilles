// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
} = require('#server/models/fundingTypeModel')(db);

const fixtures = require('#fixtures/server/models/fundingTypeModel.fixtures');

// tests
describe('[/server/models] fundingTypeModel', () => {
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
        it('it returns all funding types from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const fundingTypes = await findAll();
            expect(fundingTypes).to.eql(fixtures.findAll.output);
        });
    });
});
