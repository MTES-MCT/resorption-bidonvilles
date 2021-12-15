const { expect } = require('chai');
const { where } = require('#server/utils/permission/index');
const { serialized: fakeUser } = require('#test/utils/user');
const { nation, paris } = require('#test/utils/location');

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

    describe('cas valides', () => {
        const cases = {
            'utilisateur communal': {
                'permission nationale': {
                    condition: 'aucune condition',
                    user_level: paris.city(),
                    permission_level: 'nation',
                    expected: {},
                },
                'permission régionale': {
                    condition: 'une condition sur sa région',
                    user_level: paris.city(),
                    permission_level: 'region',
                    expected: {
                        region: {
                            query: 'regions.code',
                            value: [paris.region().region.code],
                        },
                    },
                },
                'permission départementale': {
                    condition: 'une condition sur son département',
                    user_level: paris.city(),
                    permission_level: 'departement',
                    expected: {
                        departement: {
                            query: 'departements.code',
                            value: [paris.departement().departement.code],
                        },
                    },
                },
                'permission intercommunale': {
                    condition: 'une condition sur son epci',
                    user_level: paris.city(),
                    permission_level: 'epci',
                    expected: {
                        epci: {
                            query: 'epci.code',
                            value: [paris.epci().epci.code],
                        },
                    },
                },
                'permission communale': {
                    condition: 'une condition sur sa ville',
                    user_level: paris.city(),
                    permission_level: 'city',
                    expected: {
                        city: {
                            query: 'cities.code',
                            value: [paris.city().city.code],
                        },
                        city_arrondissement: {
                            query: 'cities.fk_main',
                            value: [paris.city().city.code],
                        },
                    },
                },
                'permission d\'écriture locale': {
                    condition: 'une condition sur sa ville',
                    user_level: paris.city(),
                    permission_level: 'local',
                    expected: {
                        city: {
                            query: 'cities.code',
                            value: [paris.city().city.code],
                        },
                        city_arrondissement: {
                            query: 'cities.fk_main',
                            value: [paris.city().city.code],
                        },
                    },
                },
                'permission de lecture locale': {
                    condition: 'une condition sur son département',
                    user_level: paris.city(),
                    permission_level: 'local',
                    is_writing: false,
                    expected: {
                        departement: {
                            query: 'departements.code',
                            value: [paris.departement().departement.code],
                        },
                    },
                },
            },
            'utilisateur intercommunal': {
                'permission nationale': {
                    condition: 'aucune condition',
                    user_level: paris.epci(),
                    permission_level: 'nation',
                    expected: {},
                },
                'permission régionale': {
                    condition: 'une condition sur sa région',
                    user_level: paris.epci(),
                    permission_level: 'region',
                    expected: {
                        region: {
                            query: 'regions.code',
                            value: [paris.region().region.code],
                        },
                    },
                },
                'permission départementale': {
                    condition: 'une condition sur son département',
                    user_level: paris.epci(),
                    permission_level: 'departement',
                    expected: {
                        departement: {
                            query: 'departements.code',
                            value: [paris.departement().departement.code],
                        },
                    },
                },
                'permission intercommunale': {
                    condition: 'une condition sur son epci',
                    user_level: paris.epci(),
                    permission_level: 'epci',
                    expected: {
                        epci: {
                            query: 'epci.code',
                            value: [paris.epci().epci.code],
                        },
                    },
                },
                'permission d\'écriture locale': {
                    condition: 'une condition sur son epci',
                    user_level: paris.epci(),
                    permission_level: 'local',
                    expected: {
                        epci: {
                            query: 'epci.code',
                            value: [paris.epci().epci.code],
                        },
                    },
                },
                'permission de lecture locale': {
                    condition: 'une condition sur son département',
                    user_level: paris.epci(),
                    permission_level: 'local',
                    is_writing: false,
                    expected: {
                        departement: {
                            query: 'departements.code',
                            value: [paris.departement().departement.code],
                        },
                    },
                },
            },
            'utilisateur départemental': {
                'permission nationale': {
                    condition: 'aucune condition',
                    user_level: paris.departement(),
                    permission_level: 'nation',
                    expected: {},
                },
                'permission régionale': {
                    condition: 'une condition sur sa région',
                    user_level: paris.departement(),
                    permission_level: 'region',
                    expected: {
                        region: {
                            query: 'regions.code',
                            value: [paris.region().region.code],
                        },
                    },
                },
                'permission départementale': {
                    condition: 'une condition sur son département',
                    user_level: paris.departement(),
                    permission_level: 'departement',
                    expected: {
                        departement: {
                            query: 'departements.code',
                            value: [paris.departement().departement.code],
                        },
                    },
                },
                'permission locale': {
                    condition: 'une condition sur son département',
                    user_level: paris.departement(),
                    permission_level: 'local',
                    expected: {
                        departement: {
                            query: 'departements.code',
                            value: [paris.departement().departement.code],
                        },
                    },
                },
            },
            'utilisateur régional': {
                'permission nationale': {
                    condition: 'aucune condition',
                    user_level: paris.region(),
                    permission_level: 'nation',
                    expected: {},
                },
                'permission régionale': {
                    condition: 'une condition sur sa région',
                    user_level: paris.region(),
                    permission_level: 'region',
                    expected: {
                        region: {
                            query: 'regions.code',
                            value: [paris.region().region.code],
                        },
                    },
                },
                'permission locale': {
                    condition: 'une condition sur sa région',
                    user_level: paris.region(),
                    permission_level: 'local',
                    expected: {
                        region: {
                            query: 'regions.code',
                            value: [paris.region().region.code],
                        },
                    },
                },
            },
            'utilisateur national': {
                'permission nationale': {
                    condition: 'aucune condition',
                    user_level: nation(),
                    permission_level: 'nation',
                    expected: {},
                },
                'permission locale': {
                    condition: 'aucune condition',
                    user_level: nation(),
                    permission_level: 'local',
                    expected: {},
                },
            },
        };

        Object.keys(cases).forEach((userLevel) => {
            Object.keys(cases[userLevel]).forEach((permissionLevel) => {
                const {
                    condition, permission_level, user_level, is_writing, expected,
                } = cases[userLevel][permissionLevel];
                it(`pour un ${userLevel} avec une ${permissionLevel}, retourne ${condition}`, () => {
                    user.permissions.something = {
                        write: {
                            allowed: true,
                            geographic_level: permission_level,
                            is_writing: is_writing !== false,
                        },
                    };
                    user.organization.location = user_level;
                    expect(where().can(user).do('write', 'something')).to.be.eql(expected);
                });
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
                        write: {
                            allowed: true,
                            geographic_level: permission_level,
                        },
                    };
                    user.organization.location = user_level;
                    expect(where().can(user).do('write', 'something')).to.be.null;
                });
            });
        });
    });
});
