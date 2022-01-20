const { expect } = require('chai');
const { where } = require('#server/utils/permission/index');
const { serialized: fakeUser } = require('#test/utils/user');
const { serialized: fakeShantytown } = require('#test/utils/shantytown');
const { serialized: fakePlan } = require('#test/utils/plan');
const { paris, marseille } = require('#test/utils/location');

describe.only('utils/permission.where()', () => {
    let user;
    beforeEach(() => {
        user = fakeUser();
        user.organization.location = paris.city();
    });

    it('retourne null si l\'utilisateur n\'a aucune permission sur l\'entité demandée', () => {
        expect(where().can(user).do('write', 'something')).to.be.null;
    });

    it('retourne null si l\'utilisateur n\'a pas la permission demandée', () => {
        user.permissions.something = {};
        expect(where().can(user).do('write', 'something')).to.be.null;
    });

    it('retourne null si l\'utilisateur a la permission demandée mais que allowed = false', () => {
        user.permissions.something = {
            write: {
                allowed: false,
            },
        };
        expect(where().can(user).do('write', 'something')).to.be.null;
    });

    it('retourne un objet vide si la permission est accordée sur tous les territoires', () => {
        user.permissions.something = {
            write: {
                allowed: true,
                allow_all: true,
                allowed_on: null,
            },
        };
        user.organization.location = paris.city();
        expect(where().can(user).do('write', 'something')).to.be.eql({});
    });

    it('retourne un objet vide si la permission est accordée sur tous les territoires', () => {
        user.permissions.something = {
            write: {
                allowed: true,
                allow_all: true,
                allowed_on: null,
            },
        };
        expect(where().can(user).do('write', 'something')).to.be.eql({});
    });

    it('retourne un objet avec les conditions correspondent aux territoires listés dans allowed_on', () => {
        const location = paris.district();
        const otherLocation = marseille.district();

        user.permissions.something = {
            write: {
                allowed: true,
                allow_all: false,
                allowed_on: {
                    regions: [location.region.code, otherLocation.region.code],
                    departements: [location.departement.code, otherLocation.departement.code],
                    epci: [location.epci.code, otherLocation.epci.code],
                    cities: [location.city.code, otherLocation.city.code],
                    shantytowns: [fakeShantytown(paris.city()).id],
                    plans: [fakePlan(paris.departement()).id],
                },
            },
        };
        expect(where().can(user).do('write', 'something')).to.be.eql({
            regions: {
                query: 'regions.code',
                value: [location.region.code, otherLocation.region.code],
            },
            departements: {
                query: 'departements.code',
                value: [location.departement.code, otherLocation.departement.code],
            },
            epci: {
                query: 'epci.code',
                value: [location.epci.code, otherLocation.epci.code],
            },
            cities: {
                query: 'cities.code',
                value: [location.city.code, otherLocation.city.code],
            },
            cities_arrondissement: {
                query: 'cities.fk_main',
                value: [location.city.code, otherLocation.city.code],
            },
            shantytowns: {
                query: 'shantytowns.shantytown_id',
                value: [1],
            },
            plans: {
                query: 'plans.plan_id',
                value: [1],
            },
        });
    });
});
