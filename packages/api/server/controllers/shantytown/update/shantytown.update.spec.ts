import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as generateUser } from '#test/utils/user';

import shantytownModel from '#server/models/shantytownModel';

import edit from './shantytown.update';

const { expect } = chai;
chai.use(sinonChai);

describe('townController.edit()', () => {
    const dependencies: any = {
        update: undefined,
        findOne: undefined,
    };
    beforeEach(() => {
        dependencies.update = sinon.stub(shantytownModel, 'update');
        dependencies.findOne = sinon.stub(shantytownModel, 'findOne');
    });
    afterEach(() => {
        Object.values(dependencies).forEach((stub: any) => stub && stub.restore());
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
                    updated_at: new Date(),
                    built_at: new Date(),
                    is_reinstallation: true,
                    reinstallation_comments: 'Commentaires',
                    reinstallation_incoming_towns_full: [{ id: 1 }, { id: 2 }, { id: 3 }],
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
                    tents: 2,
                    cars: 2,
                    mattresses: 2,
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

                    evacuation_under_time_limit: true,
                    administrative_order_decision_at: new Date(),
                    administrative_order_decision_rendered_by: 'Préfet',
                    administrative_order_evacuation_at: new Date(),
                    evacuation_police_status: 'granted',
                    evacuation_police_requested_at: new Date(),
                    evacuation_police_granted_at: new Date(),
                    evacuation_bailiff: 'Huissier évacuation',
                    insalubrity_order: true,
                    insalubrity_order_displayed: true,
                    insalubrity_order_type: 'arrêté',
                    insalubrity_order_by: 'Maire',
                    insalubrity_order_at: new Date(),
                    insalubrity_parcels: '00300, 00400',
                    insalubrity_police_status: 'granted',
                    insalubrity_police_requested_at: new Date(),
                    insalubrity_police_granted_at: new Date(),
                    insalubrity_bailiff: 'Huissier insalubrité',

                    living_conditions_version: 2,

                    water_access_type: 'autre',
                    water_access_type_details: 'commentaire accès eau',
                    water_access_is_public: false,
                    water_access_is_continuous: false,
                    water_access_is_continuous_details: 'commentaire continuité eau',
                    water_access_is_local: true,
                    water_access_is_close: true,
                    water_access_is_unequal: true,
                    water_access_is_unequal_details: 'commentaire disparité eau',
                    water_access_has_stagnant_water: false,
                    water_access_comments: 'commentaire eau',

                    sanitary_open_air_defecation: false,
                    sanitary_working_toilets: true,
                    sanitary_toilet_types: ['latrines', 'toilettes_chimiques'],
                    sanitary_toilets_are_inside: true,
                    sanitary_toilets_are_lighted: true,
                    sanitary_hand_washing: true,

                    electricity_access: true,
                    electricity_access_types: ['electrogene', 'reseau_urbain'],
                    electricity_access_is_unequal: false,

                    trash_is_piling: true,
                    trash_evacuation_is_close: true,
                    trash_evacuation_is_safe: true,
                    trash_evacuation_is_regular: true,
                    trash_bulky_is_piling: false,

                    pest_animals_presence: false,
                    pest_animals_details: 'commentaire nuisibles',

                    fire_prevention_diagnostic: true,
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
                .resolves(output.updatedShantytown);

            res = mockRes();
            await edit(mockReq(input), res, () => { });
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
                    updated_at: input.body.updated_at,
                    built_at: input.body.built_at,
                    is_reinstallation: input.body.is_reinstallation,
                    reinstallation_comments: input.body.reinstallation_comments,
                    reinstallation_incoming_towns: [1, 2, 3],
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
                    tents: input.body.tents,
                    cars: input.body.cars,
                    mattresses: input.body.mattresses,
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
                    existing_litigation: input.body.existing_litigation || null,

                    evacuation_under_time_limit: input.body.evacuation_under_time_limit,
                    administrative_order_decision_at: input.body.administrative_order_decision_at || null,
                    administrative_order_decision_rendered_by: input.body.administrative_order_decision_rendered_by,
                    administrative_order_evacuation_at: input.body.administrative_order_evacuation_at || null,
                    insalubrity_order: input.body.insalubrity_order,
                    insalubrity_order_displayed: input.body.insalubrity_order_displayed || null,
                    insalubrity_order_type: input.body.insalubrity_order_type || null,
                    insalubrity_order_by: input.body.insalubrity_order_by || null,
                    insalubrity_order_at: input.body.insalubrity_order_at || null,
                    insalubrity_parcels: input.body.insalubrity_parcels || null,

                    fk_electricity_type: null,
                    electricity_comments: null,
                    access_to_sanitary: null,
                    sanitary_comments: null,
                    sanitary_number: null,
                    sanitary_insalubrious: null,
                    sanitary_on_site: null,
                    access_to_water: null,
                    water_comments: null,
                    water_potable: null,
                    water_continuous_access: null,
                    water_public_point: null,
                    water_distance: null,
                    water_roads_to_cross: null,
                    water_everyone_has_access: null,
                    water_stagnant_water: null,
                    water_hand_wash_access: null,
                    water_hand_wash_access_number: null,
                    trash_evacuation: null,
                    trash_cans_on_site: null,
                    trash_accumulation: null,
                    trash_evacuation_regular: null,
                    vermin: null,
                    vermin_comments: null,
                    fire_prevention_measures: null,
                    fire_prevention_diagnostic: null,
                    fire_prevention_site_accessible: null,
                    fire_prevention_devices: null,
                    fire_prevention_comments: null,
                    living_conditions_version: 2,
                    water_access_type: 'autre',
                    water_access_type_details: 'commentaire accès eau',
                    water_access_is_public: false,
                    water_access_is_continuous: false,
                    water_access_is_continuous_details: 'commentaire continuité eau',
                    water_access_is_local: true,
                    water_access_is_close: true,
                    water_access_is_unequal: true,
                    water_access_is_unequal_details: 'commentaire disparité eau',
                    water_access_has_stagnant_water: false,
                    water_access_comments: 'commentaire eau',
                    sanitary_access_open_air_defecation: false,
                    sanitary_access_working_toilets: true,
                    sanitary_toilet_types: ['latrines', 'toilettes_chimiques'],
                    sanitary_access_toilets_are_inside: true,
                    sanitary_access_toilets_are_lighted: true,
                    sanitary_access_hand_washing: true,
                    electricity_access: true,
                    electricity_access_types: ['electrogene', 'reseau_urbain'],
                    electricity_access_is_unequal: false,
                    trash_is_piling: true,
                    trash_evacuation_is_close: true,
                    trash_evacuation_is_safe: true,
                    trash_evacuation_is_regular: true,
                    trash_bulky_is_piling: false,
                    pest_animals: false,
                    pest_animals_details: 'commentaire nuisibles',
                    fire_prevention: true,
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
    describe('Si une erreur survient lors de la mise à jour', () => {
        let res;
        let next;
        let error;
        beforeEach(async () => {
            const input = {
                params: { id: 1 },
                body: {
                    reinstallation_incoming_towns_full: [{ id: 1 }, { id: 2 }, { id: 3 }],
                },
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
