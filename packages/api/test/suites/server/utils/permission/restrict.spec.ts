/* eslint-disable no-use-before-define */
import { expect } from 'chai';
import permissionUtils from '#server/utils/permission/index';
import userUtils from '#test/utils/user';
import locationUtils from '#test/utils/location';

const { restrict } = permissionUtils;

const { serialized: fakeUser } = userUtils;
const {
    nation, paris, marseille,
} = locationUtils;

describe.only('utils/permission.restrict()', () => {
    let user;
    beforeEach(() => {
        user = fakeUser();
        user.organization.location = paris.city();
    });

    it('si l\'utilisateur n\'a pas de permissions pour l\'entité demandée, retourne null', () => {
        expect(restrict(nation()).for(user).askingTo('do', 'something')).to.be.null;
    });

    it('si l\'utilisateur n\'a pas la permission pour la feature demandée, retourne null', () => {
        user.permissions.something = {};
        expect(restrict(nation()).for(user).askingTo('do', 'something')).to.be.null;
    });

    it('si l\'utilisateur a la permission demandée avec allowed=false, retourne null', () => {
        user.permissions.something = {
            do: {
                allowed: false,
                is_writing: false,
                allow_all: null,
                allowed_on: null,
            },
        };
        expect(restrict(nation()).for(user).askingTo('do', 'something')).to.be.null;
    });

    function getLevelLimitsFor(location) {
        switch (location.type) {
            case 'region':
                return {
                    above: nation(),
                    below: paris.departement(),
                };

            case 'departement':
                return {
                    above: paris.region(),
                    below: paris.epci(),
                };

            case 'epci':
                return {
                    above: paris.departement(),
                    below: paris.city(),
                };

            case 'city':
                return {
                    above: paris.epci(),
                    below: paris.district(),
                };

            case 'nation':
            default:
                return {
                    above: null,
                    below: marseille.region(),
                };
        }
    }

    describe('cas valides', () => {
        const cases = {
            'utilisateur communal': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: paris.city(),
                    allow_all: true,
                    allowed_on: null,
                    max_level: nation(),
                    out_of_bounds: null,
                },
                'permission régionale': {
                    condition: 'sa région',
                    user_level: paris.region(),
                    allow_all: false,
                    allowed_on: {
                        regions: [paris.city().region.code],
                        departements: [],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.region(),
                    out_of_bounds: marseille.district(),
                },
                'permission départementale': {
                    condition: 'son département',
                    user_level: paris.departement(),
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [paris.city().departement.code],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
                'permission intercommunale': {
                    condition: 'son epci',
                    user_level: paris.epci(),
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [paris.city().epci.code],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.epci(),
                    out_of_bounds: marseille.district(),
                },
                'permission communale': {
                    condition: 'sa ville',
                    user_level: paris.city(),
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [],
                        cities: [paris.city().city.code],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.city(),
                    out_of_bounds: marseille.district(),
                },
                'permission de lecture locale': {
                    condition: 'son département',
                    user_level: paris.city(),
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [paris.city().departement.code],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    is_writing: false,
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
            },
            'utilisateur intercommunal': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: paris.epci(),
                    allow_all: true,
                    allowed_on: null,
                    max_level: nation(),
                    out_of_bounds: null,
                },
                'permission régionale': {
                    condition: 'sa région',
                    user_level: paris.region(),
                    allow_all: false,
                    allowed_on: {
                        regions: [paris.city().region.code],
                        departements: [],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.region(),
                    out_of_bounds: marseille.district(),
                },
                'permission départementale': {
                    condition: 'son département',
                    user_level: paris.departement(),
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [paris.city().departement.code],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
                'permission intercommunale': {
                    condition: 'son epci',
                    user_level: paris.epci(),
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [paris.city().epci.code],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.epci(),
                    out_of_bounds: marseille.district(),
                },
                'permission de lecture locale': {
                    condition: 'son département',
                    user_level: paris.epci(),
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [paris.city().departement.code],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    is_writing: false,
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
            },
            'utilisateur départemental': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: paris.departement(),
                    allow_all: true,
                    allowed_on: null,
                    max_level: nation(),
                    out_of_bounds: null,
                },
                'permission régionale': {
                    condition: 'sa région',
                    user_level: paris.region(),
                    allow_all: false,
                    allowed_on: {
                        regions: [paris.city().region.code],
                        departements: [],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.region(),
                    out_of_bounds: marseille.district(),
                },
                'permission départementale': {
                    condition: 'son département',
                    user_level: paris.departement(),
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [paris.city().departement.code],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
            },
            'utilisateur régional': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: paris.region(),
                    allow_all: true,
                    allowed_on: null,
                    max_level: nation(),
                    out_of_bounds: null,
                },
                'permission régionale': {
                    condition: 'sa région',
                    user_level: paris.region(),
                    allow_all: false,
                    allowed_on: {
                        regions: [paris.city().region.code],
                        departements: [],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                    max_level: paris.region(),
                    out_of_bounds: marseille.district(),
                },
            },
            'utilisateur national': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: nation(),
                    allow_all: true,
                    allowed_on: null,
                    max_level: nation(),
                    out_of_bounds: null,
                },
            },
        };

        Object.keys(cases).forEach((userLevel) => {
            Object.keys(cases[userLevel]).forEach((permissionLevel) => {
                const {
                    condition, allow_all, allowed_on, user_level, is_writing, max_level, out_of_bounds,
                } = cases[userLevel][permissionLevel];

                const { above, below } = getLevelLimitsFor(max_level);
                if (above !== null) {
                    it(`si un ${userLevel} avec une ${permissionLevel} demande accès au niveau ${above.type}, retourne ${condition}`, () => {
                        user.permissions.something = {
                            do: {
                                allowed: true,
                                allow_all,
                                allowed_on,
                                is_writing: is_writing !== false,
                            },
                        };
                        user.organization.location = user_level;
                        expect(restrict(above).for(user).askingTo('do', 'something')).to.be.eql(max_level);
                    });
                }

                it(`si un ${userLevel} avec une ${permissionLevel} demande accès au niveau ${below.type}, retourne ce niveau à l'identique`, () => {
                    user.permissions.something = {
                        do: {
                            allowed: true,
                            allow_all,
                            allowed_on,
                            is_writing: is_writing !== false,
                        },
                    };
                    user.organization.location = user_level;
                    expect(restrict(below).for(user).askingTo('do', 'something')).to.be.eql(below);
                });

                if (out_of_bounds !== null) {
                    it(`si un ${userLevel} avec une ${permissionLevel} demande accès à un territoire différent, retourne null`, () => {
                        user.permissions.something = {
                            do: {
                                allowed: true,
                                allow_all,
                                allowed_on,
                                is_writing: is_writing !== false,
                            },
                        };
                        user.organization.location = user_level;
                        expect(restrict(out_of_bounds).for(user).askingTo('do', 'something')).to.be.null;
                    });
                }
            });
        });
    });
});
