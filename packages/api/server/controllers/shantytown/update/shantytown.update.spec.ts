import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock/node';
import { mockReq, mockRes } from 'sinon-express-mock';
import { serialized as generateUser } from '#test/utils/user';
import ServiceError from '#server/errors/ServiceError';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();
const shantytownService = {
    update: sandbox.stub(),
};

rewiremock('#server/services/shantytown').with(shantytownService);

rewiremock.enable();
// eslint-disable-next-line import/newline-after-import, import/first
import edit from './shantytown.update';
rewiremock.disable();

describe('townController.edit()', () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe('Avec un input valide', () => {
        let input;
        let output;
        let res;
        beforeEach(async () => {
            input = {
                params: { id: '1' },
                body: {
                    updated_without_any_change: false,
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
                    existing_litigation: true,
                    evacuation_under_time_limit: true,
                    administrative_order_decision_at: new Date(),
                    administrative_order_decision_rendered_by: 'Préfet',
                    administrative_order_evacuation_at: new Date(),
                    insalubrity_order: true,
                    insalubrity_order_displayed: true,
                    insalubrity_order_type: 'arrêté',
                    insalubrity_order_by: 'Maire',
                    insalubrity_order_at: new Date(),
                    insalubrity_parcels: '00300, 00400',
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
                    attachments: [],
                },
                files: [],
                user: generateUser(),
            };

            output = {
                id: 1,
                name: 'Name',
                departement: {
                    name: 'Yvelines',
                    code: '78',
                },
            };

            shantytownService.update.resolves(output);

            res = mockRes();
            await edit(mockReq(input), res, () => { });
        });

        it('fait appel au service shantytown/update', async () => {
            expect(shantytownService.update).to.have.been.calledOnceWith(
                { ...input.body, id: input.params.id },
                input.user,
                {
                    filesDatas: input.body.attachments,
                    files: input.files,
                },
            );
        });

        it('répond une 200', () => {
            expect(res.status).to.have.been.calledOnceWith(200);
        });

        it('retourne le site mis à jour', () => {
            expect(res.send).to.have.been.calledOnceWith(output);
        });
    });
    describe('En cas de dysfonctionnement du service', () => {
        let res;
        let next;
        beforeEach(async () => {
            const input = {
                params: { id: '1' },
                body: {
                    reinstallation_incoming_towns_full: [{ id: 1 }, { id: 2 }, { id: 3 }],
                    attachments: [],
                },
                files: [],
                user: generateUser(),
            };

            const nativeError = new Error('Database error');
            shantytownService.update.rejects(new ServiceError('update_failed', nativeError));

            res = mockRes();
            next = sandbox.stub();
            await edit(mockReq(input), res, next);
        });

        it('répond une 500', () => {
            expect(res.status).to.have.been.calledOnceWith(500);
        });

        it('retourne le message d\'erreur correspondant au code ServiceError', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'La mise à jour de site n\'a pas pu être enregistrée.',
            });
        });

        it('appelle next() avec l\'erreur native', () => {
            const callArgs = next.getCall(0).args[0];
            expect(callArgs.message).to.equal('Database error');
        });
    });

    describe('En cas d\'erreur inconnue', () => {
        let res;
        let next;
        beforeEach(async () => {
            const input = {
                params: { id: '1' },
                body: {
                    attachments: [],
                },
                files: [],
                user: generateUser(),
            };

            const unknownError = new Error('Unexpected error');
            shantytownService.update.rejects(unknownError);

            res = mockRes();
            next = sandbox.stub();
            await edit(mockReq(input), res, next);
        });

        it('répond une 500', () => {
            expect(res.status).to.have.been.calledOnceWith(500);
        });

        it('retourne un message d\'erreur générique', () => {
            expect(res.send).to.have.been.calledOnceWith({
                user_message: 'Une erreur inconnue est survenue.',
            });
        });

        it('appelle next() avec l\'erreur', () => {
            const callArgs = next.getCall(0).args[0];
            expect(callArgs.message).to.equal('Unexpected error');
        });
    });
});
