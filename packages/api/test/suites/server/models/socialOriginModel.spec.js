// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
} = require('#server/models/socialOriginModel')(db);

const fixtures = require('#fixtures/server/models/socialOriginModel.fixtures');

// tests
describe('[/server/models] socialOriginModel', () => {
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
        it('it returns all social origins from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const socialOrigins = await findAll();
            expect(socialOrigins).to.eql(fixtures.findAll.output);
        });
    });
});
