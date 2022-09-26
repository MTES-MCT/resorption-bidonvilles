const chai = require('chai');
const subset = require('chai-subset');
const rewiremock = require('rewiremock/node');

const { expect } = chai;
chai.use(subset);

const knexFactory = require('#test/db/knex');
const insertTowns = require('#test/fixtures/shantytowns/insert');
const insertIncomingTowns = require('#test/fixtures/incoming_towns/insert');

describe('incomingTownsModel.findAll()', () => {
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

    it('retourne un tableau vide quand la base de données est vide', async () => {
        const response = await findAll();
        expect(response).to.be.an('array');
        expect(response).to.have.lengthOf(0);
    });

    it('retourne le bon nombre de sites', async () => {
        await insertTowns([{ shantytown_id: 9999 }, { shantytown_id: 9998 }, { shantytown_id: 9997 }]);
        await insertIncomingTowns([
            { fk_shantytown: 9999, fk_incoming_town: 9997 },
            { fk_shantytown: 9999, fk_incoming_town: 9998 },
        ]);
        const response = await findAll();
        expect(response).to.be.an('array');
        expect(response).to.have.lengthOf(2);
    });

    it('sérialise correctement l\'identifiant du site existant', async () => {
        await insertTowns([{ shantytown_id: 9999 }, { shantytown_id: 9998 }]);
        await insertIncomingTowns([{ fk_shantytown: 9999, fk_incoming_town: 9998 }]);
        const response = await findAll();
        expect(response[0].shantytownId).to.be.eql(9999);
    });

    it('sérialise correctement l\'identifiant du site d\'origine', async () => {
        await insertTowns([{ shantytown_id: 9999 }, { shantytown_id: 9998 }]);
        await insertIncomingTowns([{ fk_shantytown: 9999, fk_incoming_town: 9998 }]);
        const response = await findAll();
        expect(response[0].id).to.be.eql(9998);
    });

    it('sérialise correctement le nom du site d\'origine quand il n\'est pas renseigné', async () => {
        await insertTowns([{ shantytown_id: 9999 }, { shantytown_id: 9998 }]);
        await insertIncomingTowns([{ fk_shantytown: 9999, fk_incoming_town: 9998 }]);
        const response = await findAll();
        expect(response[0].name).to.be.null;
    });

    it('sérialise correctement le nom du site d\'origine quand il est renseigné', async () => {
        await insertTowns([{ shantytown_id: 9999 }, { shantytown_id: 9998, name: 'A' }]);
        await insertIncomingTowns([{ fk_shantytown: 9999, fk_incoming_town: 9998 }]);
        const response = await findAll();
        expect(response[0].name).to.be.eql('A');
    });

    // @todo: implémenter l'adresse simple
    it('sérialise correctement l\'adresse du site d\'origine', async () => {
        await insertTowns([{ shantytown_id: 9999 }, { shantytown_id: 9998, address: '1 rue des sites' }]);
        await insertIncomingTowns([{ fk_shantytown: 9999, fk_incoming_town: 9998 }]);
        const response = await findAll();
        expect(response[0].addressSimple).to.be.eql('1 rue des sites');
    });

    // @todo: implémenter le vrai usename
    it('sérialise correctement le nom d\'usage du site d\'origine', async () => {
        await insertTowns([{ shantytown_id: 9999 }, { shantytown_id: 9998, address: '1 rue des sites' }]);
        await insertIncomingTowns([{ fk_shantytown: 9999, fk_incoming_town: 9998 }]);
        const response = await findAll();
        expect(response[0].usename).to.be.eql('1 rue des sites');
    });

    after(async () => {
        await knex.destroy();
    });
});
