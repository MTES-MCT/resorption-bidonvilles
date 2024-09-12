import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';
import { serialized as fakeOrganization } from '#test/utils/organization';

const { expect } = chai;
chai.use(sinonChai);

// mock all dependencies
const sandbox = sinon.createSandbox();
const sequelize = {
    transaction: sandbox.stub(),
};
const transaction = {
    commit: sandbox.stub(),
    rollback: sandbox.stub(),
};
const createOrganizationType = sandbox.stub();
const createOrganization = sandbox.stub();
const findOrganizationById = sandbox.stub();

rewiremock('#db/sequelize').with({ sequelize });
rewiremock('#server/models/organizationTypeModel/create').withDefault(createOrganizationType);
rewiremock('#server/models/organizationModel/create').withDefault(createOrganization);
rewiremock('#server/models/organizationModel/findOneById').withDefault(findOrganizationById);

rewiremock.enable();
// eslint-disable-next-line import/first, import/newline-after-import
import create from './create';
rewiremock.disable();

describe('services/organization/create', () => {
    beforeEach(() => {
        sequelize.transaction.resolves(transaction);
    });
    afterEach(() => {
        sandbox.reset();
    });

    it('crée la structure, si le type fournit existe déjà', async () => {
        await create(42, {
            name: 'Test',
            abbreviation: 'TST',
            intervention_areas: [
                { type: 'city', code: '12345' },
            ],
            type: 1,
            new_type_category: null,
            new_type_name: null,
            new_type_abbreviation: null,
            new_type_default_role: null,
        });
        expect(createOrganizationType).to.not.have.been.called;
        expect(createOrganization).to.have.been.calledOnce;
        expect(createOrganization).to.have.been.calledOnceWith(42, {
            type: 1,
            name: 'Test',
            abbreviation: 'TST',
            intervention_areas: [
                { type: 'city', code: '12345' },
            ],
        }, transaction);
    });

    it('crée le type de structure, si le type fournit est nouveau', async () => {
        createOrganizationType.resolves(35);
        await create(42, {
            name: 'Test',
            abbreviation: 'TST',
            intervention_areas: [
                { type: 'city', code: '12345' },
            ],
            type: 'new',
            new_type_category: 'test',
            new_type_name: 'Type de Test',
            new_type_abbreviation: 'TsT',
            new_type_default_role: 'role',
        });

        expect(createOrganizationType).to.have.been.called;
        expect(createOrganizationType).to.have.been.calledOnceWith(42, {
            category: 'test',
            name: 'Type de Test',
            abbreviation: 'TsT',
            default_role: 'role',
        }, transaction);
        expect(createOrganization).to.have.been.calledOnce;
        expect(createOrganization.getCalls()[0].args[1].type, 'La structure n\'est pas créée avec le bon type').to.equal(35);
    });

    it('retourne la structure nouvellement créée', async () => {
        const org = fakeOrganization({ id: 78 });

        createOrganization.resolves(42);
        findOrganizationById.withArgs(42, false, transaction).resolves(org);
        const response = await create(42, {
            name: 'Test',
            abbreviation: 'TST',
            intervention_areas: [
                { type: 'city', code: '12345' },
            ],
            type: 1,
            new_type_category: null,
            new_type_name: null,
            new_type_abbreviation: null,
            new_type_default_role: null,
        });

        expect(response).to.be.eql(org);
    });

    it('exécute l\'ensemble des requêtes dans une transaction', async () => {
        await create(42, {
            name: 'Test',
            abbreviation: 'TST',
            intervention_areas: [
                { type: 'city', code: '12345' },
            ],
            type: 1,
            new_type_category: null,
            new_type_name: null,
            new_type_abbreviation: null,
            new_type_default_role: null,
        });

        expect(transaction.commit).to.have.been.calledOnce;
        expect(transaction.commit).to.have.been.calledAfter(findOrganizationById);
    });

    it('en cas d\'erreur, rollback la transaction', async () => {
        createOrganization.rejects(new Error('Test'));

        try {
            await create(42, {
                name: 'Test',
                abbreviation: 'TST',
                intervention_areas: [
                    { type: 'city', code: '12345' },
                ],
                type: 1,
                new_type_category: null,
                new_type_name: null,
                new_type_abbreviation: null,
                new_type_default_role: null,
            });
        } catch (error) {
            // ignore
        }

        expect(transaction.rollback).to.have.been.calledOnce;
    });

    it('en cas d\'erreur, lance un ServiceError', async () => {
        const originalError = new Error('test');
        createOrganization.rejects(originalError);

        let caughtError;
        try {
            await create(42, {
                name: 'Test',
                abbreviation: 'TST',
                intervention_areas: [
                    { type: 'city', code: '12345' },
                ],
                type: 1,
                new_type_category: null,
                new_type_name: null,
                new_type_abbreviation: null,
                new_type_default_role: null,
            });
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).to.be.instanceOf(ServiceError);
        expect(caughtError.code).to.be.eql('database_error');
        expect(caughtError.nativeError).to.be.eql(originalError);
    });
});
