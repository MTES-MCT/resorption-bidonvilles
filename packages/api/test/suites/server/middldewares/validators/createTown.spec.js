const chai = require('chai');
const sinon = require('sinon');
const rewiremock = require('rewiremock/node');
const { mockReq, mockRes } = require('sinon-express-mock');
const { validationResult } = require('express-validator');

const { expect } = chai;

// stubs
const stubs = {
    fieldTypeModel: {
        findOne: sinon.stub(),
    },
    ownerTypeModel: {
        findOne: sinon.stub(),
    },
};

// fixture
const createTownValidators = rewiremock.proxy(
    '#server/middlewares/validators/createTown',
    {
        '#server/models/fieldTypeModel': () => ({ findOne: stubs.fieldTypeModel.findOne }),
        '#server/models/ownerTypeModel': () => ({ findOne: stubs.ownerTypeModel.findOne }),
    },
);

// utils
async function validate(body) {
    const req = mockReq({ body });
    const res = mockRes();

    for (let i = 0; i < createTownValidators.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await createTownValidators[i](req, res, () => { });
    }

    const errors = validationResult(req);

    return {
        body: req.body,
        errors: !errors.isEmpty()
            ? errors.array().reduce((acc, { param, msg }) => Object.assign({}, acc, {
                [param]: [...(acc[param] || []), msg],
            }), {})
            : {},
    };
}

describe('createTown', () => {
    /* **********************************************************************************************
     * Appellation du site
     ********************************************************************************************* */
    describe('.name', () => {
        [
            { label: 'undefined', value: undefined },
            { label: 'null', value: null },
            { label: 'an empty string', value: '    ' },
        ].forEach(({ label, value }) => {
            describe(`given ${label}`, () => {
                it('should not raise an error', async () => {
                    const { errors } = await validate({ name: value });
                    expect(errors).to.not.have.property('name');
                });

                it('should sanitize the value to null', async () => {
                    const { body } = await validate({ name: value });
                    expect(body.name).to.be.null;
                });
            });
        });

        describe('given a value that is not a string/null/undefined', () => {
            it('should raise an error', async () => {
                const { errors } = await validate({ name: false });
                expect(errors.name).to.have.members([
                    'Le champ "Appellation du site" est invalide',
                ]);
            });
        });

        describe('given a non-empty string', () => {
            it('should not raise an error', async () => {
                const { errors } = await validate({ name: '  test  ' });
                expect(errors).to.not.have.property('name');
            });

            it('should trim the value', async () => {
                const { body } = await validate({ name: '  test  ' });
                expect(body.name).to.be.eql('test');
            });
        });
    });

    /* **********************************************************************************************
     * Informations d'accès
     ********************************************************************************************* */
    describe('.detailed_address', () => {
        [
            { label: 'undefined', value: undefined },
            { label: 'null', value: null },
            { label: 'an empty string', value: '    ' },
        ].forEach(({ label, value }) => {
            describe(`given ${label}`, () => {
                it('should not raise an error', async () => {
                    const { errors } = await validate({ detailed_address: value });
                    expect(errors).to.not.have.property('name');
                });

                it('should sanitize the value to null', async () => {
                    const { body } = await validate({ detailed_address: value });
                    expect(body.detailed_address).to.be.null;
                });
            });
        });

        describe('given a value that is not a string/null/undefined', () => {
            it('should raise an error', async () => {
                const { errors } = await validate({ detailed_address: false });
                expect(errors.detailed_address).to.have.members([
                    'Le champ "Information d\'accès" est invalide',
                ]);
            });
        });

        describe('given a non-empty string', () => {
            it('should not raise an error', async () => {
                const { errors } = await validate({ detailed_address: '  test  ' });
                expect(errors).to.not.have.property('detailed_address');
            });

            it('should trim the value', async () => {
                const { body } = await validate({ detailed_address: '  test  ' });
                expect(body.detailed_address).to.be.eql('test');
            });
        });
    });

    /* **********************************************************************************************
     * Date d'installation du site
     ********************************************************************************************* */
    describe('.built_at', () => {
        [
            { label: 'undefined', value: undefined },
            { label: 'null', value: null },
        ].forEach(({ label, value }) => {
            describe(`given ${label}`, () => {
                it('should raise an error', async () => {
                    const { errors } = await validate({ built_at: value });
                    expect(errors.built_at).to.have.members([
                        'Le champ "Date d\'installation du site" est obligatoire',
                    ]);
                });
            });
        });

        [
            { label: 'a timestamp', value: Date.now() },
            { label: 'a datetime', value: '2018-10-08T00:00:00.0Z' },
            { label: 'a date that does not exist', value: '2020-13-01' },
            { label: 'a date at the wrong format', value: '01/01/2020' },
        ].forEach(({ label, value }) => {
            describe(`given ${label}`, () => {
                it('should raise an error', async () => {
                    const { errors } = await validate({ built_at: value });
                    expect(errors.built_at).to.have.members([
                        'Le champ "Date d\'installation du site" est invalide',
                    ]);
                });
            });
        });

        describe('given a future date', () => {
            it('should raise an error', async () => {
                const { errors } = await validate({ built_at: '3000-01-01' });
                expect(errors.built_at).to.have.members([
                    'La date d\'installation du site ne peut pas être future',
                ]);
            });
        });

        describe('given a valid date', () => {
            it('should not raise an error', async () => {
                const { errors } = await validate({ built_at: '2020-01-01' });
                expect(errors).to.not.have.property('built_at');
            });

            it('should sanitize the value to a Date instance', async () => {
                const { body } = await validate({ built_at: '2020-01-01' });
                expect(body.built_at).to.be.eql(new Date(2020, 0, 1, 1, 0, 0, 0));
            });
        });
    });

    /* **********************************************************************************************
     * Date de déclaration du site
     ********************************************************************************************* */
    describe('.declared_at', () => {
        [
            { label: 'undefined', value: undefined },
            { label: 'null', value: null },
        ].forEach(({ label, value }) => {
            describe(`given ${label}`, () => {
                it('should not raise an error', async () => {
                    const { errors } = await validate({ declared_at: value });
                    expect(errors).to.not.have.property('declared_at');
                });

                it('should sanitize the value to null', async () => {
                    const { body } = await validate({ declared_at: value });
                    expect(body.declared_at).to.be.null;
                });
            });
        });

        [
            { label: 'a timestamp', value: Date.now() },
            { label: 'a datetime', value: '2018-10-08T00:00:00.0Z' },
            { label: 'a date that does not exist', value: '2020-13-01' },
            { label: 'a date at the wrong format', value: '01/01/2020' },
        ].forEach(({ label, value }) => {
            describe(`given ${label}`, () => {
                it('should raise an error', async () => {
                    const { errors } = await validate({ declared_at: value });
                    expect(errors.declared_at).to.have.members([
                        'Le champ "Date de signalement du site" est invalide',
                    ]);
                });
            });
        });

        describe('given a future date', () => {
            it('should raise an error', async () => {
                const { errors } = await validate({ declared_at: '3000-01-01' });
                expect(errors.declared_at).to.have.members([
                    'La date de signalement du site ne peut pas être future',
                ]);
            });
        });

        describe('given a date that is before the built date', () => {
            it('should raise an error', async () => {
                const { errors } = await validate({ built_at: '2020-01-01', declared_at: '2019-12-31' });
                expect(errors.declared_at).to.have.members([
                    'La date de signalement du site ne peut pas être antérieure à la date d\'installation',
                ]);
            });
        });

        describe('given a valid date', () => {
            it('should not raise an error', async () => {
                const { errors } = await validate({ declared_at: '2020-01-01' });
                expect(errors).to.not.have.property('declared_at');
            });

            it('should sanitize the value to a Date instance', async () => {
                const { body } = await validate({ declared_at: '2020-01-01' });
                expect(body.declared_at).to.be.eql(new Date(2020, 0, 1, 1, 0, 0, 0));
            });
        });
    });

    /* **********************************************************************************************
     * Type de site
     ********************************************************************************************* */
    describe('.field_type', () => {
        afterEach(() => {
            stubs.fieldTypeModel.findOne.reset();
        });

        [
            { label: 'undefined', value: undefined },
            { label: 'null', value: null },
        ].forEach(({ label, value }) => {
            describe(`given ${label}`, () => {
                it('should raise an error', async () => {
                    const { errors } = await validate({ field_type: value });
                    expect(errors.field_type).to.have.members([
                        'Le champ "Type de site" est obligatoire',
                    ]);
                });
            });
        });

        describe('given a value that is not an integer', () => {
            it('should raise an error', async () => {
                const { errors } = await validate({ field_type: 'test' });
                expect(errors.field_type).to.have.members([
                    'Le champ "Type de site" est invalide',
                ]);
            });
        });

        describe('given a value that does not match a field_type_id in database', () => {
            it('should raise an error', async () => {
                stubs.fieldTypeModel.findOne.withArgs(-1).resolves(null);
                const { errors } = await validate({ field_type: -1 });
                expect(errors.field_type).to.have.members([
                    'Le type de site sélectionné n\'existe pas en base de données',
                ]);
            });
        });

        describe('given a value that raises a database error', () => {
            it('should raise an error', async () => {
                stubs.fieldTypeModel.findOne.rejects(new Error());
                const { errors } = await validate({ field_type: -1 });
                expect(errors.field_type).to.have.members([
                    'Une erreur de lecture en base de données est survenue lors de la validation du champ "Type de site"',
                ]);
            });
        });

        describe('given a valid field type id', () => {
            it('should not raise an error', async () => {
                const { errors } = await validate({ field_type: '1' });
                expect(errors).to.not.have.property('field_type');
            });

            it('should store the full field type object into the body', async () => {
                stubs.fieldTypeModel.findOne.withArgs(1).resolves({ id: 1 });
                const { body } = await validate({ field_type: '1' });
                expect(body.field_type_full).to.be.eql({ id: 1 });
            });
        });
    });

    /* **********************************************************************************************
     * Type de propriétaire
     ********************************************************************************************* */
    describe('.owner_type', () => {
        afterEach(() => {
            stubs.ownerTypeModel.findOne.reset();
        });

        [
            { label: 'undefined', value: undefined },
            { label: 'null', value: null },
        ].forEach(({ label, value }) => {
            describe(`given ${label}`, () => {
                it('should raise an error', async () => {
                    const { errors } = await validate({ owner_type: value });
                    expect(errors.owner_type).to.have.members([
                        'Le champ "Type de propriétaire" est obligatoire',
                    ]);
                });
            });
        });

        describe('given a value that is not an integer', () => {
            it('should raise an error', async () => {
                const { errors } = await validate({ owner_type: 'test' });
                expect(errors.owner_type).to.have.members([
                    'Le champ "Type de propriétaire" est invalide',
                ]);
            });
        });

        describe('given a value that does not match an owner_type_id in database', () => {
            it('should raise an error', async () => {
                stubs.ownerTypeModel.findOne.withArgs(-1).resolves(null);
                const { errors } = await validate({ owner_type: -1 });
                expect(errors.owner_type).to.have.members([
                    'Le type de propriétaire sélectionné n\'existe pas en base de données',
                ]);
            });
        });

        describe('given a value that raises a database error', () => {
            it('should raise an error', async () => {
                stubs.ownerTypeModel.findOne.rejects(new Error());
                const { errors } = await validate({ owner_type: -1 });
                expect(errors.owner_type).to.have.members([
                    'Une erreur de lecture en base de données est survenue lors de la validation du champ "Type de propriétaire"',
                ]);
            });
        });

        describe('given a valid owner type id', () => {
            it('should not raise an error', async () => {
                const { errors } = await validate({ owner_type: '1' });
                expect(errors).to.not.have.property('owner_type');
            });

            it('should store the full field type object into the body', async () => {
                stubs.ownerTypeModel.findOne.withArgs(1).resolves({ id: 1 });
                const { body } = await validate({ owner_type: '1' });
                expect(body.owner_type_full).to.be.eql({ id: 1 });
            });
        });
    });

    /* **********************************************************************************************
     * Identité du propriétaire
     ********************************************************************************************* */
    describe('.owner', () => {
        afterEach(() => {
            stubs.ownerTypeModel.findOne.reset();
        });

        [
            { label: 'given an invalid owner type', owner_type: -1 },
            { label: 'given an owner_type \'Inconnu\'', owner_type: 1 },
        ].forEach(({ label: testCaseLabel, owner_type }) => {
            describe(testCaseLabel, () => {
                [
                    { label: 'and given undefined', value: undefined },
                    { label: 'and given null', value: null },
                    { label: 'and given an empty string', value: '    ' },
                    { label: 'and given an object', value: false },
                    { label: 'and given a valid string', value: 'test' },
                ].forEach(({ label, value }) => {
                    describe(label, () => {
                        it('should not raise an error', async () => {
                            stubs.ownerTypeModel.findOne.withArgs(1).resolves({ label: 'Inconnu' });
                            const { errors } = await validate({ owner_type, owner: value });
                            expect(errors).to.not.have.property('owner');
                        });

                        it('should sanitize the value to null', async () => {
                            stubs.ownerTypeModel.findOne.withArgs(1).resolves({ label: 'Inconnu' });
                            const { body } = await validate({ owner_type, owner: value });
                            expect(body.owner).to.be.null;
                        });
                    });
                });
            });
        });

        describe('given an owner type that is not \'Inconnu\'', () => {
            [
                { label: 'undefined', value: undefined },
                { label: 'null', value: null },
                { label: 'an empty string', value: '    ' },
            ].forEach(({ label, value }) => {
                describe(`given ${label}`, () => {
                    it('should not raise an error', async () => {
                        stubs.ownerTypeModel.findOne.resolves({ label: 'Public' });
                        const { errors } = await validate({ owner_type: 1, owner: value });
                        expect(errors).to.not.have.property('owner');
                    });

                    it('should sanitize the value to null', async () => {
                        stubs.ownerTypeModel.findOne.resolves({ label: 'Public' });
                        const { body } = await validate({ owner_type: 1, owner: value });
                        expect(body.owner).to.be.null;
                    });
                });
            });

            describe('given a value that is not a string/null/undefined', () => {
                it('should raise an error', async () => {
                    stubs.ownerTypeModel.findOne.resolves({ label: 'Public' });
                    const { errors } = await validate({ owner_type: 1, owner: false });
                    expect(errors.owner).to.have.members([
                        'Le champ "Identité du propriétaire" est invalide',
                    ]);
                });
            });

            describe('given a non-empty string', () => {
                it('should not raise an error', async () => {
                    stubs.ownerTypeModel.findOne.resolves({ label: 'Public' });
                    const { errors } = await validate({ owner_type: 1, owner: '  test  ' });
                    expect(errors).to.not.have.property('owner');
                });

                it('should trim the value', async () => {
                    stubs.ownerTypeModel.findOne.resolves({ label: 'Public' });
                    const { body } = await validate({ owner_type: 1, owner: '  test  ' });
                    expect(body.owner).to.be.eql('test');
                });
            });
        });
    });

    /* **********************************************************************************************
     * Statut du diagnostic social
     ********************************************************************************************* */
    describe('.census_status', () => {
        [
            { label: 'undefined', value: undefined },
            { label: 'null', value: null },
        ].forEach(({ label, value }) => {
            describe(`given ${label}`, () => {
                it('should not raise an error', async () => {
                    const { errors } = await validate({ census_status: value });
                    expect(errors).to.not.have.property('census_status');
                });

                it('should sanitize the value to null', async () => {
                    const { body } = await validate({ census_status: value });
                    expect(body.census_status).to.be.null;
                });
            });
        });

        describe('given an invalid value', () => {
            it('should raise an error', async () => {
                const { errors } = await validate({ census_status: 'test' });
                expect(errors.census_status).to.have.members([
                    'Le champ "Statut du diagnostic social" est invalide',
                ]);
            });
        });

        ['none', 'scheduled', 'done'].forEach((value) => {
            describe(`given "${value}"`, () => {
                it('should not raise an error', async () => {
                    const { errors } = await validate({ census_status: value });
                    expect(errors).to.not.have.property('census_status');
                });

                it('should keep the value as is', async () => {
                    const { body } = await validate({ census_status: value });
                    expect(body.census_status).to.be.eql(value);
                });
            });
        });
    });

    /* **********************************************************************************************
     * Date du diagnostic
     ********************************************************************************************* */
    describe('.census_conducted_at', () => {
        [
            { label: 'given an invalid census status', census_status: false },
            { label: 'given a census status = none', census_status: 'none' },
            { label: 'given a census status = null', census_status: null },
        ].forEach(({ label: testCaseLabel, census_status }) => {
            describe(testCaseLabel, () => {
                [
                    { label: 'and given undefined', value: undefined },
                    { label: 'and given null', value: null },
                    { label: 'and given an empty string', value: '    ' },
                    { label: 'and given an object', value: false },
                    { label: 'and given a valid string', value: 'test' },
                ].forEach(({ label, value }) => {
                    describe(label, () => {
                        it('should not raise an error', async () => {
                            const { errors } = await validate({ census_status, census_conducted_at: value });
                            expect(errors).to.not.have.property('census_conducted_at');
                        });

                        it('should sanitize the value to null', async () => {
                            const { body } = await validate({ census_status, census_conducted_at: value });
                            expect(body.census_conducted_at).to.be.null;
                        });
                    });
                });
            });
        });

        ['scheduled', 'done'].forEach((censusStatus) => {
            describe(`given a census status = ${censusStatus}`, () => {

            });
        });
    });
});
