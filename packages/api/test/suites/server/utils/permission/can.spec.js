/* eslint-disable no-use-before-define */
const { expect } = require('chai');
const { can } = require('#server/utils/permission/index');
const { serialized: fakeUser } = require('#test/utils/user');
const {
    nation, paris, marseille,
} = require('#test/utils/location');

describe.only('utils/permission.can()', () => {
    let user;
    beforeEach(() => {
        user = fakeUser();
        user.organization.location = paris.city();
    });

    it('retourne false si le user n\'a aucune permission pour l\'entity something', () => {
        expect(can(user).do('write', 'something').on(paris.city())).to.be.false;
    });

    it('retourne false si le user n\'a pas la permission write pour l\'entity something', () => {
        user.permissions.something = {
            read: { allowed: true, geographic_level: 'nation' },
        };
        expect(can(user).do('write', 'something').on(paris.city())).to.be.false;
    });

    it('retourne false si la permission something.write a allowed = false', () => {
        user.permissions.something = {
            write: { allowed: false },
        };
        expect(can(user).do('write', 'something').on(paris.city())).to.be.false;
    });

    /* eslint-disable indent */
    // utilisateur national
    unUserRattacheA(nation())
        .avecUnePermission()
            .deNiveau('nation')
                .peutAcceder('au national', nation())
                .peutAcceder('à n\'importe quelle ville', marseille.city())
                .peutAcceder('à n\'importe quel arrondissement de ville', marseille.district())
            .deNiveau('local')
                .peutAcceder('au national', nation())
                .peutAcceder('à n\'importe quelle ville', marseille.city())
                .peutAcceder('à n\'importe quel arrondissement de ville', marseille.district())
            .deNiveau('region') // on suppose que c'est vrai pour tous les niveaux inférieurs
                .nePeutPasAcceder('au national', nation())
                .nePeutPasAcceder('à une ville', paris.city());

    // utilisateur régional
    unUserRattacheA(paris.region())
        .avecUnePermission()
            .deNiveau('nation')
                .peutAcceder('au national', nation())
                .peutAcceder('à n\'importe quelle ville', marseille.city())
                .peutAcceder('à n\'importe quel arrondissement de ville', marseille.district())
            .deNiveau('local')
                .peutAcceder('à sa région', paris.region())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au national', nation())
                .nePeutPasAcceder('aux autres régions', marseille.region())
            .deNiveau('region')
                .peutAcceder('à sa région', paris.region())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au national', nation())
                .nePeutPasAcceder('aux autres régions', marseille.region())
            .deNiveau('departement')
                .nePeutPasAcceder('à sa région', paris.region())
                .nePeutPasAcceder('à ses villes', paris.city());

    // utilisateur départemental
    unUserRattacheA(paris.departement())
        .avecUnePermission()
            .deNiveau('nation')
                .peutAcceder('au national', nation())
                .peutAcceder('à n\'importe quelle ville', marseille.city())
                .peutAcceder('à n\'importe quel arrondissement de ville', marseille.district())
            .deNiveau('region')
                .peutAcceder('à sa région', paris.region())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au national', nation())
                .nePeutPasAcceder('aux autres régions', marseille.region())
            .deNiveau('local')
                .peutAcceder('à son département', paris.departement())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au régional', paris.region())
                .nePeutPasAcceder('aux autres départements', marseille.departement())
            .deNiveau('departement')
                .peutAcceder('à son département', paris.departement())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au régional', paris.region())
                .nePeutPasAcceder('aux autres départements', marseille.departement())
            .deNiveau('epci')
                .nePeutPasAcceder('à son département', paris.departement())
                .nePeutPasAcceder('à ses villes', paris.city());

    // utilisateur intercommunal
    unUserRattacheA(paris.epci())
        .avecUnePermission('écriture')
            .deNiveau('nation')
                .peutAcceder('au national', nation())
                .peutAcceder('à n\'importe quelle ville', marseille.city())
                .peutAcceder('à n\'importe quel arrondissement de ville', marseille.district())
            .deNiveau('region')
                .peutAcceder('à sa région', paris.region())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au national', nation())
                .nePeutPasAcceder('aux autres régions', marseille.region())
            .deNiveau('departement')
                .peutAcceder('à son département', paris.departement())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au régional', paris.region())
                .nePeutPasAcceder('aux autres départements', marseille.departement())
            .deNiveau('local')
                .peutAcceder('à son epci', paris.epci())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('à son département', paris.departement())
                .nePeutPasAcceder('aux autres epci', marseille.epci())
            .deNiveau('epci')
                .peutAcceder('à son epci', paris.epci())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('à son département', paris.departement())
                .nePeutPasAcceder('aux autres epci', marseille.epci())
            .deNiveau('city')
                .nePeutPasAcceder('à son epci', paris.epci())
                .nePeutPasAcceder('à ses villes', paris.city())
        .avecUnePermission('lecture')
            .deNiveau('local')
                .peutAcceder('à son département', paris.departement())
                .peutAcceder('à son epci', paris.epci())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au régional', paris.region())
                .nePeutPasAcceder('aux autres départements', marseille.departement());

    // utilisateur communal
    unUserRattacheA(paris.city())
        .avecUnePermission('écriture')
            .deNiveau('nation')
                .peutAcceder('au national', nation())
                .peutAcceder('à n\'importe quelle ville', marseille.city())
                .peutAcceder('à n\'importe quel arrondissement de ville', marseille.district())
            .deNiveau('region')
                .peutAcceder('à sa région', paris.region())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au national', nation())
                .nePeutPasAcceder('aux autres régions', marseille.region())
            .deNiveau('departement')
                .peutAcceder('à son département', paris.departement())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au régional', paris.region())
                .nePeutPasAcceder('aux autres départements', marseille.departement())
            .deNiveau('epci')
                .peutAcceder('à son epci', paris.epci())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('à son département', paris.departement())
                .nePeutPasAcceder('aux autres epci', marseille.epci())
            .deNiveau('local')
                .peutAcceder('à sa ville', paris.city())
                .peutAcceder('aux arrondissements de sa ville', paris.district())
                .nePeutPasAcceder('à son epci', paris.epci())
                .nePeutPasAcceder('aux autres villes', marseille.city())
            .deNiveau('city')
                .peutAcceder('à sa ville', paris.city())
                .peutAcceder('aux arrondissements de sa ville', paris.district())
                .nePeutPasAcceder('à son epci', paris.epci())
                .nePeutPasAcceder('aux autres villes', marseille.city())
        .avecUnePermission('lecture')
            .deNiveau('local')
                .peutAcceder('à son département', paris.departement())
                .peutAcceder('à son epci', paris.epci())
                .peutAcceder('à ses villes', paris.city())
                .peutAcceder('aux arrondissements de ses villes', paris.district())
                .nePeutPasAcceder('au régional', paris.region())
                .nePeutPasAcceder('aux autres départements', marseille.departement());
    /* eslint-enable indent */

    function unUserRattacheA(userLocation) {
        function avecUnePermission(permissionType) {
            function deNiveau(permissionLevel = 'lecture') {
                function createTestCase(expectedResult, caseLabel, requestedLocation) {
                    it(`retourne ${expectedResult} pour un utilisateur de niveau '${userLocation.type}' qui a une permission ${permissionType} au niveau ${permissionLevel} et souhaite accéder ${caseLabel}`, () => {
                        user.permissions.something = {
                            do: {
                                is_writing: permissionType === 'écriture',
                                allowed: true,
                                geographic_level: permissionLevel,
                            },
                        };
                        user.organization.location = userLocation;
                        expect(can(user).do('do', 'something').on(requestedLocation)).to.be[`${expectedResult}`];
                    });

                    return {
                        avecUnePermission,
                        deNiveau,
                        peutAcceder: createTestCase.bind(this, true),
                        nePeutPasAcceder: createTestCase.bind(this, false),
                    };
                }

                return {
                    avecUnePermission,
                    deNiveau,
                    peutAcceder: createTestCase.bind(this, true),
                    nePeutPasAcceder: createTestCase.bind(this, false),
                };
            }

            return {
                avecUnePermission,
                deNiveau,
            };
        }

        return { avecUnePermission };
    }
});
