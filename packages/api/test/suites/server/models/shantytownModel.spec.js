// ut tools
const { expect } = require('chai');

const db = global.db();
const {
    findAll,
    findOne,
} = require('#server/models/shantytownModel')(db);

const fixtures = require('#fixtures/server/models/shantytownModel.fixtures');

// tests
describe('[/server/models] shantytownModel', () => {
    const allPermissions = [
        'declaredAt',
        'builtAt',
        'closedAt',
        'address',
        'addressDetails',
        'populationTotal',
        'populationCouples',
        'populationMinors',
        'electricityType',
        'accessToWater',
        'trashEvacuation',
        'owner',
        'censusStatus',
        'censusConductedBy',
        'censusConductedAt',
        'ownerComplaint',
        'justiceProcedure',
        'justiceRendered',
        'justiceRenderedAt',
        'justiceRenderedBy',
        'justiceChallenged',
        'policeStatus',
        'policeRequestedAt',
        'policeGrantedAt',
        'bailiff',
        'socialOrigins',
        'comments',
        'closingSolutions',
        'fieldType',
        'ownerType',
        'actions',
        'updatedAt',
    ];

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
        describe('if the database is empty', () => {
            it('it returns an empty array', async () => {
                const towns = await findAll();
                expect(towns).to.eql([]);
            });
        });

        describe('if the database is not empty', () => {
            beforeEach(async () => {
                await global.insertFixtures(db, fixtures.findAll.inputs);
            });

            describe('if all permissions are passed', () => {
                it('it returns all towns from the database, with all details', async () => {
                    const towns = await findAll(allPermissions);
                    expect(towns).to.eql(fixtures.findAll.outputWithAllPermissions);
                });
            });

            describe('if no permissions are passed', () => {
                it('it returns all towns from the database, without details', async () => {
                    const towns = await findAll();
                    expect(towns).to.eql(fixtures.findAll.outputWithNoPermissions);
                });
            });
        });
    });

    describe('.findOne()', () => {
        describe('if the id matches an existing town', () => {
            beforeEach(async () => {
                await global.insertFixtures(db, fixtures.findOne.inputs);
            });

            describe('if all permissions are passed', () => {
                it('it returns the proper town from the database, with all details', async () => {
                    const town = await findOne(1, allPermissions);
                    expect(town).to.eql(fixtures.findOne.outputWithAllPermissions);
                });
            });

            describe('if no permissions are passed', () => {
                it('it returns the proper town from the database, without details', async () => {
                    const towns = await findOne(1);
                    expect(towns).to.eql(fixtures.findOne.outputWithNoPermissions);
                });
            });
        });

        describe('if the id does not match an existing town', () => {
            it('it returns null', async () => {
                const town = await findOne(1);
                expect(town).to.be.null;
            });
        });
    });
});
