import { expect } from 'chai';
import permissionUtils from '#server/utils/permission';
import { serialized as fakeUser } from '#test/utils/user';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import locationUtils from '#test/utils/location';
import { serialized as fakeAction } from '#test/utils/action';
import { User } from '#root/types/resources/User.d';

const { where } = permissionUtils;
const { paris, marseille } = locationUtils;

describe('utils/permission.where()', () => {
    let user: User;
    beforeEach(() => {
        user = fakeUser();
    });

    it('retourne null si l\'utilisateur n\'a aucune permission sur l\'entité demandée', () => {
        expect(where().can(user).do('write', 'something')).to.be.null;
    });

    it('retourne null si l\'utilisateur n\'a par défaut pas pas la permission demandée', () => {
        user.permissions.something = {};
        expect(where().can(user).do('write', 'something')).to.be.null;
    });

    it('retourne null si l\'utilisateur n\'a explicitement PAS la permission demandée', () => {
        user.permissions.something = {
            write: {
                allowed: false,
                allowed_on_national: false,
                allowed_on: null,
            },
        };
        expect(where().can(user).do('write', 'something')).to.be.null;
    });

    it('retourne un objet vide si la permission est accordée sur tous les territoires', () => {
        user.permissions.something = {
            write: {
                allowed: true,
                allowed_on_national: true,
                allowed_on: null,
            },
        };
        expect(where().can(user).do('write', 'something')).to.be.eql({});
    });

    it('retourne un objet avec les conditions correspondant aux territoires listés dans allowed_on', () => {
        const location = paris.district();
        const otherLocation = marseille.district();

        user.permissions.something = {
            write: {
                allowed: true,
                allowed_on_national: false,
                allowed_on: {
                    regions: [paris.region(), marseille.region()],
                    departements: [paris.departement(), marseille.departement()],
                    epci: [paris.epci(), marseille.epci()],
                    cities: [paris.district(), marseille.district()],
                    actions: [fakeAction({ location: paris.departement() }).id],
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
            actions: {
                query: 'actions.action_id',
                value: [1],
            },
        });
    });
});
