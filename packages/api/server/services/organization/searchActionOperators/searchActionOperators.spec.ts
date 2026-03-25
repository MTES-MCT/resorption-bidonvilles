import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { rewiremock } from '#test/rewiremock';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

const { expect } = chai;
chai.use(sinonChai);

// stubs
const sandbox = sinon.createSandbox();
const stubs = {
    organizationModel: {
        searchActionOperators: sandbox.stub(),
    },
};

// Mock users avec différents profils de permissions
const mockUser = {} as User;

const mockUserNational = {
    ...mockUser,
    intervention_areas: {
        is_national: true,
        areas: [],
    },
} as User;

const mockUserTerritorialOrRestricted = {
    ...mockUser,
    intervention_areas: {
        is_national: false,
        areas: [],
    },
} as User;

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
            const mockOrganizations = [
                {
                    id: 1,
                    name: 'DDETS 44',
                    abbreviation: 'DDETS44',
                    territory_type: 'departement',
                    territory_name: 'Loire-Atlantique',
                    similarity: 0.8,
                },
                {
                    id: 2,
                    name: 'Direction Départementale de la Cohésion Sociale',
                    abbreviation: null,
                    territory_type: 'region',
                    territory_name: 'Pays de la Loire',
                    similarity: 0.6,
                },
            ];

            stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

            const result = await searchActionOperators('ddets', mockUser);

            expect(stubs.organizationModel.searchActionOperators).to.have.been.calledOnceWith('ddets', mockUser);
            expect(result).to.deep.equal([
                {
                    id: 1,
                    name: 'DDETS 44',
                    abbreviation: 'DDETS44',
                    enriched_name: 'DDETS 44 - Loire-Atlantique',
                    enriched_abbreviation: 'DDETS44 - Loire-Atlantique',
                    type: {
                        id: 'action_operator_organization',
                        label: 'Structure',
                    },
                },
                {
                    id: 2,
                    name: 'Direction Départementale de la Cohésion Sociale',
                    abbreviation: null,
                    enriched_name: 'Direction Départementale de la Cohésion Sociale - Pays de la Loire',
                    enriched_abbreviation: null,
                    type: {
                        id: 'action_operator_organization',
                        label: 'Structure',
                    },
                },
            ]);
        });

        it('retourne les propriétés enrichies correctement', async () => {
            const mockOrganizations = [
                {
                    id: 1,
                    name: 'DDETS 44',
                    abbreviation: 'DDETS44',
                    territory_type: 'departement',
                    territory_name: 'Loire-Atlantique',
                    similarity: 0.8,
                },
            ];

            stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

            const result = await searchActionOperators('ddets', mockUser);

            expect(result[0].enriched_name).to.equal('DDETS 44 - Loire-Atlantique');
            expect(result[0].enriched_abbreviation).to.equal('DDETS44 - Loire-Atlantique');
        });

        it('retourne un tableau vide si aucune organisation trouvée', async () => {
            stubs.organizationModel.searchActionOperators.resolves([]);

            const result = await searchActionOperators('inconnu', mockUser);

            expect(result).to.be.an('array');
            expect(result).to.have.length(0);
        });

        it('gère les organisations de type city sans territoire dans le nom enrichi', async () => {
            const mockOrganizations = [
                {
                    id: 3,
                    name: 'Mairie de Nantes',
                    abbreviation: 'Mairie Nantes',
                    territory_type: 'city',
                    territory_name: null,
                    similarity: 0.7,
                },
            ];

            stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

            const result = await searchActionOperators('mairie', mockUser);

            expect(result[0].enriched_name).to.equal('Mairie de Nantes');
            expect(result[0].enriched_abbreviation).to.equal('Mairie Nantes');
            expect(result[0].enriched_name).to.not.include('-'); // Pas de territoire ajouté
        });

        it('retourne un tableau vide si l\'utilisateur n\'a aucune permission', async () => {
            stubs.organizationModel.searchActionOperators.resolves([]);

            const result = await searchActionOperators('test', mockUser);

            expect(stubs.organizationModel.searchActionOperators).to.have.been.calledOnceWith('test', mockUser);
            expect(result).to.be.an('array');
            expect(result).to.have.length(0);
        });

        it('appelle le modèle avec les bons paramètres', async () => {
            const mockOrganizations = [
                {
                    id: 1,
                    name: 'Test Org',
                    abbreviation: 'TO',
                    action_count: 2,
                    similarity: 0.9,
                },
            ];

            stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

            await searchActionOperators('test', mockUser);

            expect(stubs.organizationModel.searchActionOperators).to.have.been.calledOnceWith('test', mockUser);
        });

        describe('tests des permissions', () => {
            it('utilisateur national peut voir toutes les organisations', async () => {
                const mockOrganizations = [
                    {
                        id: 1,
                        name: 'Org Nationale',
                        abbreviation: 'ON',
                        action_count: 5,
                        similarity: 0.9,
                    },
                ];

                stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

                const result = await searchActionOperators('test', mockUserNational);

                expect(stubs.organizationModel.searchActionOperators).to.have.been.calledOnceWith('test', mockUserNational);
                expect(result).to.have.length(1);
                expect(result[0].name).to.equal('Org Nationale');
            });

            it('utilisateur territorial voit seulement les organisations de ses territoires', async () => {
                const mockOrganizations = [
                    {
                        id: 1,
                        name: 'Org Territoriale',
                        abbreviation: 'OT',
                        action_count: 3,
                        similarity: 0.8,
                    },
                ];

                stubs.organizationModel.searchActionOperators.resolves(mockOrganizations);

                const result = await searchActionOperators('test', mockUserTerritorialOrRestricted);

                expect(stubs.organizationModel.searchActionOperators).to.have.been.calledOnceWith('test', mockUserTerritorialOrRestricted);
                expect(result).to.have.length(1);
                expect(result[0].name).to.equal('Org Territoriale');
            });

            it('utilisateur restreint ne voit aucune organisation si aucune action dans ses territoires', async () => {
                stubs.organizationModel.searchActionOperators.resolves([]);

                const result = await searchActionOperators('test', mockUserTerritorialOrRestricted);

                expect(stubs.organizationModel.searchActionOperators).to.have.been.calledOnceWith('test', mockUserTerritorialOrRestricted);
                expect(result).to.have.length(0);
            });

            it('différents utilisateurs obtiennent des résultats différents selon leurs permissions', async () => {
                stubs.organizationModel.searchActionOperators
                    .withArgs('test', mockUserNational).resolves([
                        {
                            id: 1,
                            name: 'Org 1',
                            abbreviation: 'O1',
                            action_count: 2,
                            similarity: 0.9,
                        },
                        {
                            id: 2,
                            name: 'Org 2',
                            abbreviation: 'O2',
                            action_count: 1,
                            similarity: 0.7,
                        },
                    ])
                    .withArgs('test', mockUserTerritorialOrRestricted).resolves([]);

                const resultNational = await searchActionOperators('test', mockUserNational);
                const resultRestricted = await searchActionOperators('test', mockUserTerritorialOrRestricted);

                expect(resultNational).to.have.length(2);
                expect(resultRestricted).to.have.length(0);
            });
        });
    });

    describe('service saerchActionOperators - cas d\'erreur', () => {
        it('lance une ServiceError si le modèle échoue', async () => {
            const dbError = new Error('Database connection failed');
            stubs.organizationModel.searchActionOperators.rejects(dbError);

            try {
                await searchActionOperators('ddets', mockUser);
                expect.fail('Should have thrown ServiceError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServiceError);
                expect(error.code).to.equal('db_read_error');
                expect(error.nativeError).to.equal(dbError);
            }
        });

        it('passe l\'erreur native à ServiceError', async () => {
            const nativeError = new Error('Native error');
            stubs.organizationModel.searchActionOperators.rejects(nativeError);

            try {
                await searchActionOperators('ddets', mockUser);
                expect.fail('Should have thrown ServiceError');
            } catch (error) {
                expect(error.nativeError).to.equal(nativeError);
            }
        });
    });

    describe('formatage des données', () => {
        it('conserve l\'abbréviation si elle existe', async () => {
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

            const result = await searchActionOperators('ddets', mockUser);

            expect(result[0].abbreviation).to.equal('DDETS44');
        });

        it('gére l\'abbréviation nulle', async () => {
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

            const result = await searchActionOperators('ddets', mockUser);

            expect(result[0].abbreviation).to.be.null;
        });

        it('retourne toujours le type "Structure"', async () => {
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

            const result = await searchActionOperators('ddets', mockUser);

            expect(result[0].type).to.deep.equal({
                id: 'action_operator_organization',
                label: 'Structure',
            });
        });
    });
});
