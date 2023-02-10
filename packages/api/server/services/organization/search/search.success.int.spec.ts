/* eslint-disable import/first */
import chai from 'chai';
import chaiSubset from 'chai-subset';
import rewiremock from 'rewiremock/node';
import insertFakeUsers from '#test/fixtures/users/insert';
import insertFakeOrganizations from '#test/fixtures/organizations/insert';
import sequelizeFactory from '#test/db/sequelize';

const { expect } = chai;
chai.use(chaiSubset);

describe('[services/organization/search] En cas de succès', async () => {
    let search;
    before(async () => {
        rewiremock('#db/sequelize').with({ sequelize: sequelizeFactory() });
        rewiremock.enable();
        ({ default: search } = await import('./search'));
        rewiremock.disable();
    });

    afterEach(async () => {
        const sequelize = sequelizeFactory();
        await sequelize.query('DELETE FROM users WHERE user_id >= 353501 AND user_id < 360000');
    });

    it('retourne la liste des utilisateurs dont le prénom ou le nom sont proches de la requête', async () => {
        await insertFakeUsers([
            {
                user_id: 353501,
                email: 'test+353501',
                first_name: 'Ipsum',
            },
            {
                user_id: 353502,
                email: 'test+353502',
                last_name: 'Ipum',
            },
        ]);

        const response = await search({
            name: 'ipum',
        });
        expect(response?.users).to.be.an('array');
        expect(response.users).to.have.length(2);
        expect(response.users[0]).to.containSubset({ id: 353501 });
        expect(response.users[1]).to.containSubset({ id: 353502 });
    });

    it('retourne la liste des structures dont le nom ou l\'abbréviation sont proches de la requête', async () => {
        await insertFakeOrganizations([
            {
                organization_id: 353501,
            },
            {
                organization_id: 353502,
            },
        ]);

        const response = await search({
            name: 'ipum',
        });
        expect(response?.users).to.be.an('array');
        expect(response.users).to.have.length(2);
        expect(response.users[0]).to.containSubset({ id: 353501 });
        expect(response.users[1]).to.containSubset({ id: 353502 });
    });
});
