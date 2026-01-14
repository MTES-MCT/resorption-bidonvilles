import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

// stubs
const sandbox = sinon.createSandbox();
const stubs = {
    organizationModel: {
        searchActionOperators: sandbox.stub(),
    },
};

rewiremock('#server/models/organizationModel/index').with(stubs.organizationModel);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import searchActionOperators from './searchActionOperators';
rewiremock.disable();

describe('services/organization.searchActionOperators()', () => {
    beforeEach(() => {
        // Pas de setup spécifique nécessaire
    });

    afterEach(() => {
        sandbox.reset();
    });

    describe('service.searchActionOperators', () => {
        it('retourne les organisations formatées avec leurs actions', async () => {
            // Arrange
            const mockOrganizations = [
                {
                    id: 1,
                    name: 'DDETS 44',
                    abbreviation: 'DDETS44',
                    action_count: 5,
                    similarity: 0.8,
                },
                {
                    id: 2,
                    name: 'Direction Départementale de la Cohésion Sociale',
                    abbreviation: null,
                    action_count: 3,
                    similarity: 0.6,
                },
            ];

            stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

            // Act
            const result = await searchActionOperators('ddets');

            // Assert
            expect(stubs.organizationModel.searchActionOperators).to.have.been.calledOnceWith('ddets');
            expect(result).to.deep.equal([
                {
                    id: 1,
                    name: 'DDETS 44',
                    abbreviation: 'DDETS44',
                    actionCount: 5,
                    type: {
                        id: 'action_operator_organization',
                        label: 'Structure',
                    },
                },
                {
                    id: 2,
                    name: 'Direction Départementale de la Cohésion Sociale',
                    abbreviation: null,
                    actionCount: 3,
                    type: {
                        id: 'action_operator_organization',
                        label: 'Structure',
                    },
                },
            ]);
        });

        it('convertit action_count en nombre', async () => {
            // Arrange
            const mockOrganizations = [
                {
                    id: 1,
                    name: 'DDETS 44',
                    abbreviation: 'DDETS44',
                    action_count: '5', // string au lieu de number
                    similarity: 0.8,
                },
            ];

            stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

            // Act
            const result = await searchActionOperators('ddets');

            // Assert
            expect(result[0].actionCount).to.be.a('number');
            expect(result[0].actionCount).to.equal(5);
        });

        it('retourne un tableau vide si aucune organisation trouvée', async () => {
            // Arrange
            stubs.organizationModel.searchActionOperators.resolves([]);

            // Act
            const result = await searchActionOperators('inconnu');

            // Assert
            expect(result).to.be.an('array');
            expect(result).to.have.length(0);
        });
    });

    describe('service saerchActionOperators - cas d\'erreur', () => {
        it('lance une ServiceError si le modèle échoue', async () => {
            // Arrange
            const dbError = new Error('Database connection failed');
            stubs.organizationModel.searchActionOperators.rejects(dbError);

            // Act & Assert
            try {
                await searchActionOperators('ddets');
                expect.fail('Should have thrown ServiceError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('db_read_error');
                expect(error.nativeError).to.equal(dbError);
            }
        });

        it('passe l\'erreur native à ServiceError', async () => {
            // Arrange
            const nativeError = new Error('Native error');
            stubs.organizationModel.searchActionOperators.rejects(nativeError);

            // Act
            try {
                await searchActionOperators('ddets');
                expect.fail('Should have thrown ServiceError');
            } catch (error) {
                expect(error.nativeError).to.equal(nativeError);
            }
        });
    });

    describe('formatage des données', () => {
        it('conserve l\'abbréviation si elle existe', async () => {
            // Arrange
            const mockOrganizations = [
                {
                    id: 1,
                    name: 'DDETS 44',
                    abbreviation: 'DDETS44',
                    action_count: 5,
                    similarity: 0.8,
                },
            ];

            stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

            // Act
            const result = await searchActionOperators('ddets');

            // Assert
            expect(result[0].abbreviation).to.equal('DDETS44');
        });

        it('gére l\'abbréviation nulle', async () => {
            // Arrange
            const mockOrganizations = [
                {
                    id: 2,
                    name: 'Direction Départementale de la Cohésion Sociale',
                    abbreviation: null,
                    action_count: 3,
                    similarity: 0.6,
                },
            ];

            stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

            // Act
            const result = await searchActionOperators('ddets');

            // Assert
            expect(result[0].abbreviation).to.be.null;
        });

        it('retourne toujours le type "Structure"', async () => {
            // Arrange
            const mockOrganizations = [
                {
                    id: 1,
                    name: 'DDETS 44',
                    abbreviation: 'DDETS44',
                    action_count: 5,
                    similarity: 0.8,
                },
            ];

            stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

            // Act
            const result = await searchActionOperators('ddets');

            // Assert
            expect(result[0].type).to.deep.equal({
                id: 'action_operator_organization',
                label: 'Structure',
            });
        });
    });
});
