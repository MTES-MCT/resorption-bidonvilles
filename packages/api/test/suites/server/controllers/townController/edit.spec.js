const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);
const { mockReq, mockRes } = require('sinon-express-mock');
const { serialized: generateUser } = require('#test/utils/user');

const shantytownModel = require('#server/models/shantytownModel');

const edit = require('#server/controllers/townController/edit');

describe.only('townController.edit()', () => {
    const dependencies = {
        update: undefined,
        findOne: undefined,
    };
    beforeEach(() => {
        dependencies.update = sinon.stub(shantytownModel, 'update');
        dependencies.findOne = sinon.stub(shantytownModel, 'findOne');
    });
    afterEach(() => {
        Object.values(dependencies).forEach(stub => stub && stub.restore());
    });

    describe('Si les requêtes en base de données fonctionnent correctement', () => {
        let input;
        let output;
        let res;
        beforeEach(async () => {
            input = {
                params: { id: 1 },

                body: {
                    name: 'Name',
                    latitude: 46.1390023,
                    longitude: -2.435937,
                    address: 'Rue de la Defense 92130 Issy-les-Moulineaux, 92, Hauts-de-Seine, Île-de-France',
                    address_details: 'Détails',
                    built_at: new Date(),
                    is_reinstallation: true,
                    reinstallation_comments: 'Commentaires',
                    social_origins: [1, 2],
                    population_total: 100,
                    population_couples: 50,
                    population_minors: 25,
                    population_minors_0_3: 10,
                    population_minors_3_6: 10,
                    population_minors_6_12: 3,
                    population_minors_12_16: 1,
                    population_minors_16_18: 1,
                    minors_in_school: 20,
                    caravans: 2,
                    huts: 2,
                    fk_field_type: 1,
                    fk_owner_type: 1,
                    fk_city: '92062',
                    owner: 'Nom de propriétaire',
                    declared_at: new Date(),
                    census_status: 'done',
                    census_conducted_at: new Date(),
                    census_conducted_by: 'Opérateur',
                    owner_complaint: true,
                    justice_procedure: true,
                    justice_rendered: true,
                    justice_rendered_at: new Date(),
                    justice_rendered_by: 'TGI',
                    justice_challenged: true,
                    police_status: 'granted',
                    police_requested_at: new Date(),
                    police_granted_at: new Date(),
                    bailiff: 'Huissier',
                },

                user: generateUser(),
            };

            output = {
                // @todo: remplacer par une donnée générée via utils/shantytown dès que cet utils sera mergé dans develop...
                shantytown: {
                    id: 1,
                    name: null,
                    departement: {
                        name: 'Yvelines',
                        code: '78',
                    },
                },
                updatedShantytown: {
                    id: 1,
                    name: 'name',
                    departement: {
                        name: 'Yvelines',
                        code: '78',
                    },
                },
            };

            dependencies.findOne
                .withArgs(input.user, 1)
                .onCall(0)
                .resolves(output.shantytown);

            dependencies.findOne
                .withArgs(input.user, 1)
                .onCall(1)
                .resolves(output.updatedShantytown);

            res = mockRes();
            await edit(mockReq(input), res);
        });

        it('met à jour le site', async () => {
            expect(dependencies.update).to.have.been.calledOnceWithExactly(
                input.user,
                1,
                {
                    name: input.body.name,
                    latitude: input.body.latitude,
                    longitude: input.body.longitude,
                    address: input.body.address,
                    address_details: input.body.detailed_address,
                    built_at: input.body.built_at,
                    is_reinstallation: input.body.is_reinstallation,
                    reinstallation_comments: input.body.reinstallation_comments,
                    social_origins: input.body.social_origins,
                    population_total: input.body.population_total,
                    population_couples: input.body.population_couples,
                    population_minors: input.body.population_minors,
                    population_minors_0_3: input.body.population_minors_0_3,
                    population_minors_3_6: input.body.population_minors_3_6,
                    population_minors_6_12: input.body.population_minors_6_12,
                    population_minors_12_16: input.body.population_minors_12_16,
                    population_minors_16_18: input.body.population_minors_16_18,
                    minors_in_school: input.body.minors_in_school,
                    caravans: input.body.caravans,
                    huts: input.body.huts,
                    fk_field_type: input.body.field_type,
                    fk_owner_type: input.body.owner_type,
                    fk_city: input.body.citycode,
                    owner: input.body.owner,
                    declared_at: input.body.declared_at,
                    census_status: input.body.census_status,
                    census_conducted_at: input.body.census_conducted_at,
                    census_conducted_by: input.body.census_conducted_by,
                    owner_complaint: input.body.owner_complaint,
                    justice_procedure: input.body.justice_procedure,
                    justice_rendered: input.body.justice_rendered,
                    justice_rendered_at: input.body.justice_rendered_at,
                    justice_rendered_by: input.body.justice_rendered_by,
                    justice_challenged: input.body.justice_challenged,
                    police_status: input.body.police_status,
                    police_requested_at: input.body.police_requested_at,
                    police_granted_at: input.body.police_granted_at,
                    bailiff: input.body.bailiff,
                },
            );
        });

        it('répond une 200', () => {
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('retourne le site en question mis à jour', () => {
            expect(dependencies.findOne).to.have.been.calledAfter(dependencies.update);
            expect(res.send).to.have.been.calledOnceWith(output.updatedShantytown);
        });
    });

    describe('En cas d\'erreur dans le checkout du site', () => {
        let res;
        let next;
        let error;
        beforeEach(async () => {
            const input = {
                params: { id: 1 },
                body: {},
                user: generateUser(),
            };

            error = new Error('Une erreur');

            dependencies.findOne.rejects(error);

            res = mockRes();
            next = sinon.stub();
            await edit(mockReq(input), res, next);
        });

        it('répond une 500', () => {
            expect(res.status).to.have.been.calledOnceWith(500);
        });

        it('retourne un message d\'erreur générique', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Une erreur de lecture en base de données est survenue',
            });
        });

        it('appelle next() avec l\'erreur en question', () => {
            expect(next).to.have.been.calledOnceWith(error);
        });
    });

    describe('Si le site n\'existe pas en base de données', () => {
        let res;
        beforeEach(async () => {
            const input = {
                params: { id: 1 },
                body: {},
                user: generateUser(),
            };

            dependencies.findOne.withArgs(input.user, 1).resolves(null);

            res = mockRes();
            await edit(mockReq(input), res);
        });

        it('répond une 404', () => {
            expect(res.status).to.have.been.calledOnceWith(404);
        });

        it('retourne un message d\'erreur générique', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Le site d\'identifiant 1 n\'existe pas : mise à jour impossible',
            });
        });
    });

    describe('Si une erreur survient lors de la mise à jour', () => {
        let res;
        let next;
        let error;
        beforeEach(async () => {
            const input = {
                params: { id: 1 },
                body: {},
                user: generateUser(),
            };

            error = new Error('Une erreur');

            dependencies.findOne.withArgs(input.user, 1).onCall(0).resolves({});
            dependencies.update.rejects(error);

            res = mockRes();
            next = sinon.stub();
            await edit(mockReq(input), res, next);
        });

        it('répond une 500', () => {
            expect(res.status).to.have.been.calledOnceWith(500);
        });

        it('retourne un message d\'erreur générique', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Une erreur est survenue dans l\'enregistrement du site en base de données',
            });
        });

        it('appelle next() avec l\'erreur en question', () => {
            expect(next).to.have.been.calledOnceWith(error);
        });
    });
});
