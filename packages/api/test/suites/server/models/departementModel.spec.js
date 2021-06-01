// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
    findOne,
} = require('#server/models/departementModel')(db);

const fixtures = require('#fixtures/server/models/departementModel.fixtures');

// tests
describe('[/server/models] departementModel', () => {
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
        it('it returns all departements from the database', async () => {
            await global.insertFixtures(db, fixtures.findAll.inputs);
            const departements = await findAll();
            expect(departements).to.eql(fixtures.findAll.output);
        });
    });

    describe('.findOne()', () => {
        describe('if the code matches an existing departement', () => {
            it('it returns the proper departement from the database', async () => {
                await global.insertFixtures(db, fixtures.findOne.inputs);
                const departement = await findOne('75');
                expect(departement).to.eql(fixtures.findOne.output);
            });
        });

        describe('if the code does not match an existing departement', () => {
            it('it returns null', async () => {
                const departement = await findOne('99');
                expect(departement).to.be.null;
            });
        });
    });
});
