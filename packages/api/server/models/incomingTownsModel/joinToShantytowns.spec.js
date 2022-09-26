const chai = require('chai');
const subset = require('chai-subset');
const rewiremock = require('rewiremock/node');

const { expect } = chai;
chai.use(subset);

const knexFactory = require('#test/db/knex');

describe('incomingTownModel.joinToShantytowns()', () => {
    let knex;
    let joinToShantytowns;
    before(async () => {
        knex = knexFactory();
        joinToShantytowns = rewiremock.proxy('./joinToShantytowns', {
            '#db/knex': knex,
        });
    });

    beforeEach(async () => {
        await knex.raw('DELETE FROM shantytown_incoming_towns');
        await knex.raw('DELETE FROM shantytowns');
    });

    it('retourne l\'instance knex reçue en paramètre', () => {
        const q = knex('shantytowns');
        const response = joinToShantytowns(q);
        expect(response).to.be.eql(q);
    });

    after(async () => {
        await knex.destroy();
    });
});
