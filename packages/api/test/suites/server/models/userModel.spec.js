// ut tools
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');

const { expect } = chai;
chai.use(chaiAsPromised);
chai.use(chaiSubset);

const db = global.db();
const {
    findAll,
    findOne,
    findOneByEmail,
    create,
    update,
} = require('#server/models/userModel')(db);

const fixtures = require('#fixtures/server/models/userModel.fixtures');

// tests
describe('[/server/models] userModel', () => {
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
                const users = await findAll();
                expect(users).to.eql([]);
            });
        });

        describe('if the database is not empty', () => {
            it('it returns all users', async () => {
                await global.insertFixtures(db, fixtures.findAll.inputs);
                const users = await findAll();
                expect(users).to.eql(fixtures.findAll.output);
            });
        });
    });

    describe('.findOne()', () => {
        describe('if the id matches an existing user', () => {
            it('it returns the proper user from the database', async () => {
                await global.insertFixtures(db, fixtures.findOne.inputs);
                const user = await findOne(1);
                expect(user).to.eql(fixtures.findOne.output);
            });
        });

        describe('if the id does not match an existing user', () => {
            it('it returns null', async () => {
                const user = await findOne(1);
                expect(user).to.be.null;
            });
        });

        describe('if the user\'s default_export is null', () => {
            it('it returns an empty array as default_export', async () => {
                await global.insertFixtures(db, fixtures.findOneWithoutDefaultExport.inputs);
                const { default_export } = await findOne(2);
                expect(default_export).to.be.eql([]);
            });
        });

        describe('if the full user is explicitly requested', () => {
            it('it returns the user\'s salt and password', async () => {
                await global.insertFixtures(db, fixtures.findOneFull.inputs);
                const { salt, password } = await findOne(1, true);
                expect(salt).to.be.eql(fixtures.findOneFull.salt);
                expect(password).to.be.eql(fixtures.findOneFull.password);
            });
        });
    });

    describe('.update()', () => {
        beforeEach(async () => {
            await global.insertFixtures(db, fixtures.update.inputs);
        });

        describe('if the user id is missing', () => {
            it('it throws an exception', async () => {
                await expect(update()).to.be.rejectedWith('The user id is missing');
            });
        });

        describe('if the updated values are missing', () => {
            it('it throws an exception', async () => {
                await expect(update(global.generate('number'))).to.be.rejectedWith('The updated values are missing');
            });
        });

        describe('if the updated values is an empty object', () => {
            it('it throws an exception', async () => {
                await expect(update(global.generate('number'), {})).to.be.rejectedWith('The updated values are missing');
            });
        });

        describe('if the updated values is an object containing only unknown properties', () => {
            it('it throws an exception', async () => {
                await expect(update(global.generate('number'), { what: 'ever' })).to.be.rejectedWith('The updated values are missing');
            });
        });

        describe('if the user id does not match an existing user', () => {
            it('it throws an exception', async () => {
                const randomUserId = global.generate('number');
                await expect(update(randomUserId, { defaultExport: 'whatever' })).to.be.rejectedWith(`The user #${randomUserId} does not exist`);
            });
        });

        [
            [
                {
                    field: 'defaultExport',
                    testName: 'string',
                    value: 'something',
                    expected: 'something',
                },
            ],
            [
                {
                    field: 'defaultExport',
                    testName: 'null value',
                    value: null,
                    expected: null,
                },
            ],
            [
                {
                    field: 'defaultExport',
                    testName: 'empty string',
                    value: '     ',
                    expected: null,
                },
            ],
            [
                {
                    field: 'password',
                    testName: 'string',
                    value: 'something',
                    expected: 'something',
                },
            ],
            [
                {
                    field: 'password',
                    testName: 'null value',
                    value: null,
                    expected: null,
                },
                {
                    field: 'active',
                    testName: 'false',
                    value: false,
                    expected: false,
                },
            ],
        ].forEach((dataSet) => {
            const fields = dataSet.map(({ field }) => field).join(',');
            const values = dataSet.map(({ testName }) => testName).join(',');
            it(`it updates (${fields}) of the user with the given (${values})`, async () => {
                await update(
                    1,
                    dataSet.reduce(
                        (acc, { field, value }) => Object.assign(acc, {
                            [field]: value,
                        }),
                        {},
                    ),
                );

                const [user] = await db.query(
                    `SELECT
                        default_export AS "defaultExport",
                        password,
                        active
                    FROM users WHERE user_id = 1`,
                    {
                        type: db.QueryTypes.SELECT,
                    },
                );

                const testedData = dataSet.reduce((acc, { field }) => Object.assign(acc, {
                    [field]: user[field],
                }), {});
                const expectedValues = dataSet.reduce((acc, { field, expected }) => Object.assign(acc, {
                    [field]: expected,
                }), {});
                expect(testedData).to.eql(expectedValues);
            });
        });
    });

    describe('.findOneByEmail', () => {
        describe('if the email matches an existing user', () => {
            it('it ignores case', async () => {
                await global.insertFixtures(db, fixtures.findOneByEmail.inputs);
                const user = await findOneByEmail(fixtures.findOneByEmail.email.toUpperCase());
                expect(user).to.eql(fixtures.findOneByEmail.output);
            });

            it('it returns the proper user from the database', async () => {
                await global.insertFixtures(db, fixtures.findOneByEmail.inputs);
                const user = await findOneByEmail(fixtures.findOneByEmail.email);
                expect(user).to.eql(fixtures.findOneByEmail.output);
            });
        });

        describe('if the email does not match an existing user', () => {
            it('it returns null', async () => {
                const user = await findOneByEmail(global.generate('string'));
                expect(user).to.be.null;
            });
        });

        describe('if the full user is explicitly requested', () => {
            it('it returns the user\'s salt and password', async () => {
                await global.insertFixtures(db, fixtures.findOneFullByEmail.inputs);
                const { salt, password } = await findOneByEmail(fixtures.findOneFullByEmail.email, true);
                expect(salt).to.be.eql(fixtures.findOneFullByEmail.salt);
                expect(password).to.be.eql(fixtures.findOneFullByEmail.password);
            });
        });
    });

    describe('.create()', () => {
        let response;
        let fakeUser;
        beforeEach(async () => {
            await global.insertFixtures(db, fixtures.create.inputs);

            fakeUser = {
                email: global.generate('string'),
                password: null,
                salt: global.generate('string'),
                firstName: global.generate('string'),
                lastName: global.generate('string'),
                company: global.generate('string'),
                role: 2,
                departement: 75,
            };

            response = await create(fakeUser);
        });

        it('it inserts a new user in the database', async () => {
            const user = await findOneByEmail(fakeUser.email);
            expect(user).to.containSubset({
                email: fakeUser.email,
                departement: '75',
                first_name: fakeUser.firstName,
                last_name: fakeUser.lastName,
                company: fakeUser.company,
                active: false,
            });

            // note: there is no easy way to check that the password is correctly saved,
            // i deemed it a bit overkill to create a specific test just for that...
            // (even though i usually am totally off for the overkill way!)
        });

        it('it returns the id of the newly inserted row', async () => {
            expect(response).to.be.eql(2);
        });
    });
});
