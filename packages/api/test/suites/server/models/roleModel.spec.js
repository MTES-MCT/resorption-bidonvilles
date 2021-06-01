// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
    findOne,
} = require('#server/models/roleModel')(db);

const fixtures = require('#fixtures/server/models/roleModel.fixtures');

// tests
describe('[/server/models] roleModel', () => {
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
        it('it returns all roles from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const roles = await findAll();
            expect(roles).to.eql(fixtures.findAll.output);
        });
    });

    describe('.findOne()', () => {
        describe('if the id matches an existing role', () => {
            it('it returns the proper role from the database', async () => {
                await global.insertFixtures(db, fixtures.findOne.inputs);
                const role = await findOne(1);
                expect(role).to.eql(fixtures.findOne.output);
            });
        });

        describe('if the id does not match an existing role', () => {
            it('it returns null', async () => {
                const role = await findOne(99);
                expect(role).to.be.null;
            });
        });
    });
});
