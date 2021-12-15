/* eslint-disable no-use-before-define */
const { expect } = require('chai');
const { restrict } = require('#server/utils/permission/index');
const { serialized: fakeUser } = require('#test/utils/user');
const {
    nation, paris, marseille,
} = require('#test/utils/location');

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
            },
        };
        expect(restrict(nation()).for(user).askingTo('do', 'something')).to.be.null;
    });

    describe('cas valides', () => {
        const cases = {
            'utilisateur communal': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: paris.city(),
                    permission_level: 'nation',
                    max_level: nation(),
                    out_of_bounds: null,
                },
                'permission régionale': {
                    condition: 'sa région',
                    user_level: paris.city(),
                    permission_level: 'region',
                    max_level: paris.region(),
                    out_of_bounds: marseille.district(),
                },
                'permission départementale': {
                    condition: 'son département',
                    user_level: paris.city(),
                    permission_level: 'departement',
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
                'permission intercommunale': {
                    condition: 'son epci',
                    user_level: paris.city(),
                    permission_level: 'epci',
                    max_level: paris.epci(),
                    out_of_bounds: marseille.district(),
                },
                'permission communale': {
                    condition: 'sa ville',
                    user_level: paris.city(),
                    permission_level: 'city',
                    max_level: paris.city(),
                    out_of_bounds: marseille.district(),
                },
                'permission d\'écriture locale': {
                    condition: 'sa ville',
                    user_level: paris.city(),
                    permission_level: 'local',
                    max_level: paris.city(),
                    out_of_bounds: marseille.district(),
                },
                'permission de lecture locale': {
                    condition: 'son département',
                    user_level: paris.city(),
                    permission_level: 'local',
                    is_writing: false,
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
            },
            'utilisateur intercommunal': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: paris.epci(),
                    permission_level: 'nation',
                    max_level: nation(),
                    out_of_bounds: null,
                },
                'permission régionale': {
                    condition: 'sa région',
                    user_level: paris.epci(),
                    permission_level: 'region',
                    max_level: paris.region(),
                    out_of_bounds: marseille.district(),
                },
                'permission départementale': {
                    condition: 'son département',
                    user_level: paris.epci(),
                    permission_level: 'departement',
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
                'permission intercommunale': {
                    condition: 'son epci',
                    user_level: paris.epci(),
                    permission_level: 'epci',
                    max_level: paris.epci(),
                    out_of_bounds: marseille.district(),
                },
                'permission d\'écriture locale': {
                    condition: 'son epci',
                    user_level: paris.epci(),
                    permission_level: 'local',
                    max_level: paris.epci(),
                    out_of_bounds: marseille.district(),
                },
                'permission de lecture locale': {
                    condition: 'son département',
                    user_level: paris.epci(),
                    permission_level: 'local',
                    is_writing: false,
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
            },
            'utilisateur départemental': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: paris.departement(),
                    permission_level: 'nation',
                    max_level: nation(),
                    out_of_bounds: null,
                },
                'permission régionale': {
                    condition: 'sa région',
                    user_level: paris.departement(),
                    permission_level: 'region',
                    max_level: paris.region(),
                    out_of_bounds: marseille.district(),
                },
                'permission départementale': {
                    condition: 'son département',
                    user_level: paris.departement(),
                    permission_level: 'departement',
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
                'permission locale': {
                    condition: 'son département',
                    user_level: paris.departement(),
                    permission_level: 'local',
                    max_level: paris.departement(),
                    out_of_bounds: marseille.district(),
                },
            },
            'utilisateur régional': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: paris.region(),
                    permission_level: 'nation',
                    max_level: nation(),
                    out_of_bounds: null,
                },
                'permission régionale': {
                    condition: 'sa région',
                    user_level: paris.region(),
                    permission_level: 'region',
                    max_level: paris.region(),
                    out_of_bounds: marseille.district(),
                },
                'permission locale': {
                    condition: 'sa région',
                    user_level: paris.region(),
                    permission_level: 'local',
                    max_level: paris.region(),
                    out_of_bounds: marseille.district(),
                },
            },
            'utilisateur national': {
                'permission nationale': {
                    condition: 'nation',
                    user_level: nation(),
                    permission_level: 'nation',
                    max_level: nation(),
                    out_of_bounds: null,
                },
                'permission locale': {
                    condition: 'nation',
                    user_level: nation(),
                    permission_level: 'local',
                    max_level: nation(),
                    out_of_bounds: null,
                },
            },
        };

        Object.keys(cases).forEach((userLevel) => {
            Object.keys(cases[userLevel]).forEach((permissionLevel) => {
                const {
                    condition, permission_level, user_level, is_writing, max_level, out_of_bounds,
                } = cases[userLevel][permissionLevel];

                const { above, below } = getLevelLimitsFor(max_level);
                if (above !== null) {
                    it(`si un ${userLevel} avec une ${permissionLevel} demande accès au niveau ${above.type}, retourne ${condition}`, () => {
                        user.permissions.something = {
                            do: {
                                allowed: true,
                                geographic_level: permission_level,
                                is_writing: is_writing !== false,
                            },
                        };
                        user.organization.location = user_level;
                        expect(restrict(above).for(user).askingTo('do', 'something')).to.be.eql(max_level);
                    });
                }

                it(`si un ${userLevel} avec une ${permissionLevel} demande accès au niveau ${below.type}, retourne ce niveau à l\'identique`, () => {
                    user.permissions.something = {
                        do: {
                            allowed: true,
                            geographic_level: permission_level,
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
                                geographic_level: permission_level,
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

    describe('cas invalides', () => {
        const cases = {
            'utilisateur intercommunal': {
                'permission communale': {
                    user_level: paris.epci(),
                    permission_level: 'city',
                },
            },
            'utilisateur départemental': {
                'permission intercommunale': {
                    user_level: paris.departement(),
                    permission_level: 'epci',
                },
                'permission communale': {
                    user_level: paris.departement(),
                    permission_level: 'city',
                },
            },
            'utilisateur régional': {
                'permission départementale': {
                    user_level: paris.region(),
                    permission_level: 'departement',
                },
                'permission intercommunale': {
                    user_level: paris.region(),
                    permission_level: 'epci',
                },
                'permission communale': {
                    user_level: paris.region(),
                    permission_level: 'city',
                },
            },
            'utilisateur national': {
                'permission régionale': {
                    user_level: nation(),
                    permission_level: 'region',
                },
                'permission départementale': {
                    user_level: nation(),
                    permission_level: 'departement',
                },
                'permission intercommunale': {
                    user_level: nation(),
                    permission_level: 'epci',
                },
                'permission communale': {
                    user_level: nation(),
                    permission_level: 'city',
                },
            },
        };

        Object.keys(cases).forEach((userLevel) => {
            Object.keys(cases[userLevel]).forEach((permissionLevel) => {
                const { permission_level, user_level } = cases[userLevel][permissionLevel];
                it(`pour un ${userLevel} avec une ${permissionLevel}, retourne null`, () => {
                    user.permissions.something = {
                        do: {
                            allowed: true,
                            geographic_level: permission_level,
                        },
                    };
                    user.organization.location = user_level;
                    expect(restrict(paris.city()).for(user).askingTo('do', 'something')).to.be.null;
                });
            });
        });
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
});
