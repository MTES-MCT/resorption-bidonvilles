const chai = require('chai');
const subset = require('chai-subset');
const rewiremock = require('rewiremock/node');

const { expect } = chai;
chai.use(subset);

const knexFactory = require('#test/db/knex');
const insertTowns = require('#test/fixtures/shantytowns/insert');
const insertIncomingTowns = require('#test/fixtures/incoming_towns/insert');

describe('shantytownModel.findAll()', () => {
    let knex;
    let findAll;
    before(async () => {
        knex = knexFactory();
        findAll = rewiremock.proxy('./newFindAll', {
            '#db/knex': knex,
        });
    });

    beforeEach(async () => {
        await knex.raw('DELETE FROM shantytown_incoming_towns');
        await knex.raw('DELETE FROM shantytowns');
    });

    it('retourne un tableau vide si la table est vide', async () => {
        const response = await findAll();
        expect(response).to.be.an('array');
        expect(response).to.be.eql([]);
    });

    it('retourne la liste de tous les sites présents dans la table', async () => {
        await insertTowns([{}, {}, {}]);
        const response = await findAll();
        expect(response).to.be.an('array');
        expect(response).to.have.lengthOf(3);
    });

    it('retourne la liste des sites triés par ordre de dernière modification', async () => {
        await insertTowns([
            { name: '2022', updated_at: new Date(2022, 1, 1) },
            { name: '2023', updated_at: new Date(2023, 1, 1) },
            { name: '2021', updated_at: new Date(2021, 1, 1) },
        ]);
        const response = await findAll();
        expect(response.map(({ name }) => name)).to.be.eql([
            '2023', '2022', '2021',
        ]);
    });

    it('sérialise correctement l\'id d\'un site', async () => {
        await insertTowns([{
            shantytown_id: 9999,
        }]);
        const response = await findAll();
        expect(response[0]).to.containSubset({
            type: 'shantytown',
            id: 9999,
        });
    });

    it('sérialise correctement le statut d\'un site', async () => {
        await insertTowns([{
            status: 'open',
        }]);
        const response = await findAll();
        expect(response[0]).to.containSubset({
            status: 'open',
        });
    });

    it('sérialise correctement le nom d\'un site', async () => {
        await insertTowns([{
            name: 'test',
        }]);
        const response = await findAll();
        expect(response[0]).to.containSubset({
            name: 'test',
        });
    });

    it('sérialise correctement la localisation d\'un site', async () => {
        await insertTowns([{
            latitude: 1,
            longitude: 1,
            fk_city: '35238',
        }]);
        const response = await findAll();
        expect(response[0]).to.containSubset({
            latitude: 1,
            longitude: 1,
            city: {
                code: '35238',
                name: 'Rennes',
                main: null,
                latitude: 48.1119791219,
                longitude: -1.68186449144,
            },
            epci: {
                code: '243500139',
                name: 'Rennes Métropole',
            },
            departement: {
                code: '35',
                name: 'Ille-et-Vilaine',
                latitude: 48.1177,
                longitude: -1.6617,
                chieftown: {
                    code: '35238',
                    name: 'Rennes',
                    latitude: 48.1119791219,
                    longitude: -1.68186449144,
                },
            },
            region: {
                code: '53',
                name: 'Bretagne',
                latitude: 48.1293,
                longitude: -2.8276,
                chieftown: {
                    code: '35238',
                    name: 'Rennes',
                    latitude: 48.1119791219,
                    longitude: -1.68186449144,
                },
            },
        });
    });

    it('sérialise correctement une ville arrondissement (en incluant la ville principale)', async () => {
        await insertTowns([{
            latitude: 1,
            longitude: 1,
            fk_city: '69381', // 1er arrondissement de Lyon
        }]);
        const response = await findAll();
        expect(response[0].city).to.containSubset({
            main: '69123', // Lyon
        });
    });

    it('sérialise correctement l\'adresse d\'un site', async () => {
        await insertTowns([{
            address: 'ceci est une adresse',
            address_details: 'ceci est le détail d\'une adresse',
        }]);
        const response = await findAll();
        expect(response[0]).to.containSubset({
            address: 'ceci est une adresse',
            addressDetails: 'ceci est le détail d\'une adresse',
        });
    });

    it('sérialise correctement les dates d\'installation quand elles ne sont pas renseignées', async () => {
        await insertTowns([{}]);
        const response = await findAll();
        expect(response[0]).to.containSubset({
            builtAt: null,
            declaredAt: null,
        });
    });

    it('sérialise correctement les dates d\'installation quand elles sont renseignées', async () => {
        await insertTowns([{
            built_at: new Date(2022, 1, 1),
            declared_at: new Date(2022, 2, 1),
        }]);
        const response = await findAll();
        expect(response[0]).to.containSubset({
            builtAt: 1643670000,
            declaredAt: 1646089200,
        });
    });

    it('sérialise correctement le fait que ce n\'est pas une réinstallation', async () => {
        await insertTowns([{}]);
        const response = await findAll();
        expect(response[0].isReinstallation).to.be.false;
    });

    it('sérialise correctement le fait que c\'est une réinstallation', async () => {
        await insertTowns([{ is_reinstallation: true }]);
        const response = await findAll();
        expect(response[0].isReinstallation).to.be.true;
    });

    it('sérialise correctement les détails de réinstallation quand ils ne sont pas renseignés', async () => {
        await insertTowns([{}]);
        const response = await findAll();
        expect(response[0].reinstallationComments).to.be.null;
    });

    it('sérialise correctement les détails de réinstallation quand ils sont renseignés', async () => {
        await insertTowns([{ reinstallation_comments: 'commentaires' }]);
        const response = await findAll();
        expect(response[0].reinstallationComments).to.be.eql('commentaires');
    });

    it('sérialise correctement la liste des sites d\'origine des habitants quand cette liste est vide', async () => {
        await insertTowns([{}]);
        const response = await findAll();
        expect(response[0].reinstallationIncomingTowns).to.be.an('array');
        expect(response[0].reinstallationIncomingTowns).to.have.lengthOf(0);
    });

    it('sérialise correctement la liste des sites d\'origine des habitants', async () => {
        await insertTowns([{ shantytown_id: 9999 }, { shantytown_id: 9998 }, { shantytown_id: 9997 }]);
        await insertIncomingTowns([
            { fk_shantytown: 9997, fk_incoming_town: 9998 },
            { fk_shantytown: 9997, fk_incoming_town: 9999 },
        ]);
        const response = await findAll();
        expect(response[0].reinstallationIncomingTowns).to.be.an('array');
        expect(response[0].reinstallationIncomingTowns).to.have.lengthOf(2);
    });

    it('sérialise correctement les nombre d\'habitants (et ménages, et enfants, etc.) quand ils ne sont pas renseignés', async () => {
        await insertTowns([{}]);
        const response = await findAll();
        expect(response[0]).to.containSubset({
            populationTotal: null,
            populationCouples: null,
            populationMinors: null,
            populationMinors0To3: null,
            populationMinors3To6: null,
            populationMinors6To12: null,
            populationMinors12To16: null,
            populationMinors16To18: null,
            minorsInSchool: null,
            caravans: null,
            huts: null,
        });
    });

    it('sérialise correctement les nombre d\'habitants (et ménages, et enfants, etc.) quand ils sont renseignés', async () => {
        await insertTowns([{
            population_total: 100,
            population_couples: 25,
            population_minors: 50,
            population_minors_0_3: 10,
            population_minors_3_6: 10,
            population_minors_6_12: 10,
            population_minors_12_16: 10,
            population_minors_16_18: 10,
            minors_in_school: 30,
            caravans: 5,
            huts: 5,
        }]);
        const response = await findAll();
        expect(response[0]).to.containSubset({
            populationTotal: 100,
            populationCouples: 25,
            populationMinors: 50,
            populationMinors0To3: 10,
            populationMinors3To6: 10,
            populationMinors6To12: 10,
            populationMinors12To16: 10,
            populationMinors16To18: 10,
            minorsInSchool: 30,
            caravans: 5,
            huts: 5,
        });
    });

    after(async () => {
        await knex.destroy();
    });
});
