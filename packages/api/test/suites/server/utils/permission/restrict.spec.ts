/* eslint-disable no-use-before-define */
import { expect } from 'chai';
import permissionUtils from '#server/utils/permission';
import { serialized as fakeUser } from '#test/utils/user';
import locationUtils from '#test/utils/location';
import { User } from '#root/types/resources/User.d';

const { restrict } = permissionUtils;
const {
    nation, paris, marseille,
} = locationUtils;

describe('utils/permission.restrict()', () => {
    let user: User;
    beforeEach(() => {
        user = fakeUser();
    });

    it('si l\'utilisateur n\'a pas de permissions pour l\'entité demandée, retourne []', () => {
        expect(restrict(nation()).for(user).askingTo('do', 'something')).to.be.eql([]);
    });

    it('si l\'utilisateur n\'a pas la permission pour la feature demandée, retourne []', () => {
        user.permissions.something = {};
        expect(restrict(nation()).for(user).askingTo('do', 'something')).to.be.eql([]);
    });

    it('si l\'utilisateur a la permission demandée avec allowed=false, retourne []', () => {
        user.permissions.something = {
            do: {
                allowed: false,
                allowed_on_national: false,
                allowed_on: null,
            },
        };
        expect(restrict(nation()).for(user).askingTo('do', 'something')).to.be.eql([]);
    });

    it('si l\'utilisateur a la permission demandée sur le territoire demandé, retourne le territoire', () => {
        user.permissions.something = {
            do: {
                allowed: true,
                allowed_on_national: false,
                allowed_on: {
                    regions: [paris.region()],
                    departements: [],
                    epci: [],
                    cities: [],
                    actions: [],
                },
            },
        };
        expect(restrict(paris.epci()).for(user).askingTo('do', 'something')).to.be.eql([paris.epci()]);
    });

    describe('si l\'utilisateur n\'a pas la permission sur le territoire demandé', () => {
        it('en cas de demande nationale, renvoie tous les territoires de l\'utilisateur', () => {
            user.permissions.something = {
                do: {
                    allowed: true,
                    allowed_on_national: false,
                    allowed_on: {
                        regions: [paris.region(), marseille.region()],
                        departements: [paris.departement(), marseille.departement()],
                        epci: [paris.epci(), marseille.epci()],
                        cities: [paris.city(), marseille.city()],
                        actions: [],
                    },
                },
            };
            expect(restrict(nation()).for(user).askingTo('do', 'something')).to.be.eql([
                paris.region(),
                marseille.region(),
                paris.departement(),
                marseille.departement(),
                paris.epci(),
                marseille.epci(),
                paris.city(),
                marseille.city(),
            ]);
        });

        it('en cas de demande régionale, renvoie tous les territoires de l\'utilisateur liés au territoire demandé', () => {
            user.permissions.something = {
                do: {
                    allowed: true,
                    allowed_on_national: false,
                    allowed_on: {
                        regions: [marseille.region()],
                        departements: [paris.departement(), marseille.departement()],
                        epci: [paris.epci(), marseille.epci()],
                        cities: [paris.city(), marseille.city()],
                        actions: [],
                    },
                },
            };
            expect(restrict(paris.region()).for(user).askingTo('do', 'something')).to.be.eql([
                paris.departement(),
                paris.epci(),
                paris.city(),
            ]);
        });

        it('en cas de demande départementale, renvoie tous les territoires de l\'utilisateur liés au territoire demandé', () => {
            user.permissions.something = {
                do: {
                    allowed: true,
                    allowed_on_national: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [paris.epci(), marseille.epci()],
                        cities: [paris.city(), marseille.city()],
                        actions: [],
                    },
                },
            };
            expect(restrict(paris.departement()).for(user).askingTo('do', 'something')).to.be.eql([
                paris.epci(),
                paris.city(),
            ]);
        });

        it('en cas de demande intercommunale, renvoie tous les territoires de l\'utilisateur liés au territoire demandé', () => {
            user.permissions.something = {
                do: {
                    allowed: true,
                    allowed_on_national: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [],
                        cities: [paris.city(), marseille.city()],
                        actions: [],
                    },
                },
            };
            expect(restrict(paris.departement()).for(user).askingTo('do', 'something')).to.be.eql([
                paris.city(),
            ]);
        });

        it('si aucun territoire n\'est lié au territoire demandé, renvoie []', () => {
            user.permissions.something = {
                do: {
                    allowed: true,
                    allowed_on_national: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [],
                        cities: [],
                        actions: [],
                    },
                },
            };
            expect(restrict(paris.departement()).for(user).askingTo('do', 'something')).to.be.eql([]);
        });
    });
});
