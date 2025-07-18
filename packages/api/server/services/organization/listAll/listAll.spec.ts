import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import rewiremock from 'rewiremock';
import ServiceError from '#server/errors/ServiceError';

import organizationAutocomplete from './listAll';

const { expect } = chai;
chai.use(sinonChai);

const sandbox = sinon.createSandbox();

const stubs = {
    autocomplete: sandbox.stub(),
};

rewiremock('#server/models/organizationModel/autocomplete').with(stubs.autocomplete);
rewiremock.enable();

rewiremock.disable();

describe('organizationAutocomplete()', () => {
    afterEach(() => {
        sandbox.reset();
    });

    it('retourne une liste d\'organisations avec une similarité >= 0.75', async () => {
        stubs.autocomplete.resolves([
            {
                id: 1,
                name: 'Org nationale',
                similarity: 0.8,
                abbreviation: 'ON',
                type_name: 'Association',
                is_national: true,
                fk_category: 'cat1',
                type_abbreviation: 'ASSO',
                main_regions_names: [],
                main_departements_names: [],
                main_epci_names: [],
                main_cities_names: [],
            },
            {
                id: 2,
                name: 'Org locale',
                similarity: 0.6,
                abbreviation: 'OL',
                type_name: 'Association',
                is_national: false,
                fk_category: 'cat2',
                type_abbreviation: 'ASSO',
                main_regions_names: ['Île-de-France'],
                main_departements_names: ['Paris'],
                main_epci_names: ['EPCI'],
                main_cities_names: ['Paris 5e'],
            },
        ]);

        const results = await organizationAutocomplete('org');

        expect(results).to.eql([
            {
                id: 1,
                label: 'National',
                name: 'Org nationale',
                abbreviation: 'ON',
                type: 'Association',
                category: 'cat1',
                similarity: 0.8,
                type_abbreviation: 'ASSO',
            },
        ]);
    });

    it('retourne une organisation locale avec un label concaténé de territoires', async () => {
        stubs.autocomplete.resolves([
            {
                id: 3,
                name: 'Org locale',
                similarity: 0.85,
                abbreviation: 'OL',
                type_name: 'Collectivité',
                is_national: false,
                fk_category: null,
                type_abbreviation: null,
                main_regions_names: ['Bretagne'],
                main_departements_names: ['Finistère'],
                main_epci_names: ['EPCI Ouest'],
                main_cities_names: ['Quimper'],
            },
        ]);

        const results = await organizationAutocomplete('loc');

        expect(results).to.eql([
            {
                id: 3,
                label: 'Bretagne, Finistère, EPCI Ouest, Quimper',
                name: 'Org locale',
                abbreviation: 'OL',
                type: 'Collectivité',
                category: null,
                similarity: 0.85,
                type_abbreviation: null,
            },
        ]);
    });

    it('renvoie une exception ServiceError si la requête échoue', async () => {
        const err = new Error('DB down');
        stubs.autocomplete.rejects(err);

        let errorCaught;
        try {
            await organizationAutocomplete('fail');
        } catch (error) {
            errorCaught = error;
        }

        expect(errorCaught).to.be.instanceOf(ServiceError);
        expect(errorCaught.code).to.equal('db_read_error');
    });

    it('retourne un tableau vide si aucune organisation n\'a une similarité suffisante', async () => {
        stubs.autocomplete.resolves([
            {
                id: 99,
                name: 'Org faible',
                similarity: 0.5,
                abbreviation: 'OF',
                type_name: 'Autre',
                is_national: false,
                fk_category: 'x',
                type_abbreviation: 'O',
                main_regions_names: [],
                main_departements_names: [],
                main_epci_names: [],
                main_cities_names: [],
            },
        ]);

        const results = await organizationAutocomplete('zzz');
        expect(results).to.eql([]);
    });

    it('gère correctement un label avec certains tableaux vides', async () => {
        stubs.autocomplete.resolves([
            {
                id: 8,
                name: 'Org partielle',
                similarity: 0.76,
                abbreviation: 'OP',
                type_name: 'Association',
                is_national: false,
                fk_category: 'catA',
                type_abbreviation: 'ASSO',
                main_regions_names: [],
                main_departements_names: ['Loire'],
                main_epci_names: [],
                main_cities_names: ['Roanne'],
            },
        ]);

        const results = await organizationAutocomplete('partial');
        expect(results[0].label).to.equal('Loire, Roanne');
    });

    it('groupe plusieurs organisations du même type_name dans le même tableau', async () => {
        stubs.autocomplete.resolves([
            {
                id: 6,
                name: 'Org A',
                similarity: 0.8,
                abbreviation: 'OA',
                type_name: 'Coopérative',
                is_national: true,
                fk_category: 'c1',
                type_abbreviation: 'COOP',
                main_regions_names: [],
                main_departements_names: [],
                main_epci_names: [],
                main_cities_names: [],
            },
            {
                id: 7,
                name: 'Org B',
                similarity: 0.9,
                abbreviation: 'OB',
                type_name: 'Coopérative',
                is_national: true,
                fk_category: 'c2',
                type_abbreviation: 'COOP',
                main_regions_names: [],
                main_departements_names: [],
                main_epci_names: [],
                main_cities_names: [],
            },
        ]);

        const results = await organizationAutocomplete('coop');
        expect(results).to.have.lengthOf(2);
        expect(results.map(r => r.type)).to.eql(['Coopérative', 'Coopérative']);
    });


    it('retourne des organisations de types différents', async () => {
        stubs.autocomplete.resolves([
            {
                id: 10,
                name: 'Org A',
                similarity: 0.8,
                abbreviation: 'A',
                type_name: 'Société',
                is_national: true,
                fk_category: 's',
                type_abbreviation: 'SOC',
                main_regions_names: [],
                main_departements_names: [],
                main_epci_names: [],
                main_cities_names: [],
            },
            {
                id: 11,
                name: 'Org B',
                similarity: 0.81,
                abbreviation: 'B',
                type_name: 'Collectivité',
                is_national: true,
                fk_category: 'c',
                type_abbreviation: 'COLL',
                main_regions_names: [],
                main_departements_names: [],
                main_epci_names: [],
                main_cities_names: [],
            },
        ]);

        const results = await organizationAutocomplete('multi');
        expect(results.map(r => r.type)).to.include.members(['Société', 'Collectivité']);
    });
});
