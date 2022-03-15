/* eslint-disable no-use-before-define */
const { expect } = require('chai');
const { can } = require('#server/utils/permission/index');
const { serialized: fakeUser } = require('#test/utils/user');
const {
    nation, paris, marseille,
} = require('#test/utils/location');
const { serialized: fakeShantytown } = require('#test/utils/shantytown');
const { serialized: fakePlan } = require('#test/utils/plan');

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
            read: { allowed: true, allow_all: true, allowed_on: null },
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
    describe('si la permission something.write a allow_all = true', () => {
        it('retourne true, quelle que soit la localisation demandée', () => {
            user.permissions.something = {
                write: { allowed: true, allow_all: true, allowed_on: null },
            };

            expect(can(user).do('write', 'something').on(paris.district())).to.be.true;
            expect(can(user).do('write', 'something').on(paris.city())).to.be.true;
            expect(can(user).do('write', 'something').on(paris.epci())).to.be.true;
            expect(can(user).do('write', 'something').on(paris.departement())).to.be.true;
            expect(can(user).do('write', 'something').on(paris.region())).to.be.true;
            expect(can(user).do('write', 'something').on(nation())).to.be.true;
        });
    });

    describe('si la permission something.write est limitée à une région', () => {
        beforeEach(() => {
            user.permissions.something = {
                write: {
                    allowed: true,
                    allow_all: false,
                    allowed_on: {
                        regions: [paris.region().region.code],
                        departements: [],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                },
            };
        });

        it('retourne true pour la région en question', () => {
            expect(can(user).do('write', 'something').on(paris.region())).to.be.true;
        });

        it('retourne true pour n\'importe quel territoire de cette région', () => {
            expect(can(user).do('write', 'something').on(paris.district())).to.be.true;
        });

        it('retourne true pour un site situé dans cette région', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(paris.city()))).to.be.true;
        });

        it('retourne true pour une action située dans cette région', () => {
            expect(can(user).do('write', 'something').on(fakePlan(paris.departement()))).to.be.true;
        });

        it('retourne false pour le national', () => {
            expect(can(user).do('write', 'something').on(nation())).to.be.false;
        });

        it('retourne false pour une autre région', () => {
            expect(can(user).do('write', 'something').on(marseille.region())).to.be.false;
        });

        it('retourne false pour n\'importe quel territoire en-dehors de cette région', () => {
            expect(can(user).do('write', 'something').on(marseille.departement())).to.be.false;
        });

        it('retourne false pour un site situé dans une autre région', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(marseille.city()))).to.be.false;
        });

        it('retourne false pour une action située dans une autre région', () => {
            expect(can(user).do('write', 'something').on(fakePlan(marseille.departement()))).to.be.false;
        });
    });

    describe('si la permission something.write est limitée à un département', () => {
        beforeEach(() => {
            user.permissions.something = {
                write: {
                    allowed: true,
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [paris.departement().departement.code],
                        epci: [],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                },
            };
        });

        it('retourne true pour le département en question', () => {
            expect(can(user).do('write', 'something').on(paris.departement())).to.be.true;
        });

        it('retourne true pour n\'importe quel territoire de ce département', () => {
            expect(can(user).do('write', 'something').on(paris.district())).to.be.true;
        });

        it('retourne true pour un site situé dans ce département', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(paris.city()))).to.be.true;
        });

        it('retourne true pour une action située dans ce département', () => {
            expect(can(user).do('write', 'something').on(fakePlan(paris.departement()))).to.be.true;
        });

        it('retourne false pour le national', () => {
            expect(can(user).do('write', 'something').on(nation())).to.be.false;
        });

        it('retourne false pour le régional', () => {
            expect(can(user).do('write', 'something').on(paris.region())).to.be.false;
        });

        it('retourne false pour un autre département', () => {
            expect(can(user).do('write', 'something').on(marseille.departement())).to.be.false;
        });

        it('retourne false pour n\'importe quel territoire en-dehors de ce département', () => {
            expect(can(user).do('write', 'something').on(marseille.epci())).to.be.false;
        });

        it('retourne false pour un site situé dans un autre département', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(marseille.city()))).to.be.false;
        });

        it('retourne false pour une action située dans un autre département', () => {
            expect(can(user).do('write', 'something').on(fakePlan(marseille.departement()))).to.be.false;
        });
    });

    describe('si la permission something.write est limitée à un epci', () => {
        beforeEach(() => {
            user.permissions.something = {
                write: {
                    allowed: true,
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [paris.epci().epci.code],
                        cities: [],
                        shantytowns: [],
                        plans: [],
                    },
                },
            };
        });

        it('retourne true pour l\'epci en question', () => {
            expect(can(user).do('write', 'something').on(paris.epci())).to.be.true;
        });

        it('retourne true pour n\'importe quel territoire de cet epci', () => {
            expect(can(user).do('write', 'something').on(paris.district())).to.be.true;
        });

        it('retourne true pour un site situé dans cet epci', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(paris.city()))).to.be.true;
        });

        it('retourne false pour le national', () => {
            expect(can(user).do('write', 'something').on(nation())).to.be.false;
        });

        it('retourne false pour le régional', () => {
            expect(can(user).do('write', 'something').on(paris.region())).to.be.false;
        });

        it('retourne false pour le départemental', () => {
            expect(can(user).do('write', 'something').on(paris.departement())).to.be.false;
        });

        it('retourne false pour un autre epci', () => {
            expect(can(user).do('write', 'something').on(marseille.epci())).to.be.false;
        });

        it('retourne false pour n\'importe quel territoire en-dehors de ce département', () => {
            expect(can(user).do('write', 'something').on(marseille.city())).to.be.false;
        });

        it('retourne false pour un site situé dans un autre epci', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(marseille.city()))).to.be.false;
        });

        it('retourne false pour n\'importe quelle action', () => {
            expect(can(user).do('write', 'something').on(fakePlan(paris.departement()))).to.be.false;
        });
    });

    describe('si la permission something.write est limitée à une ville', () => {
        beforeEach(() => {
            user.permissions.something = {
                write: {
                    allowed: true,
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [],
                        cities: [paris.city().city.code],
                        shantytowns: [],
                        plans: [],
                    },
                },
            };
        });

        it('retourne true pour la ville en question', () => {
            expect(can(user).do('write', 'something').on(paris.city())).to.be.true;
        });

        it('retourne true pour n\'importe quel arrondissement de cette ville', () => {
            expect(can(user).do('write', 'something').on(paris.district())).to.be.true;
        });

        it('retourne true pour un site situé dans cette ville', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(paris.city()))).to.be.true;
        });

        it('retourne false pour le national', () => {
            expect(can(user).do('write', 'something').on(nation())).to.be.false;
        });

        it('retourne false pour le régional', () => {
            expect(can(user).do('write', 'something').on(paris.region())).to.be.false;
        });

        it('retourne false pour le départemental', () => {
            expect(can(user).do('write', 'something').on(paris.departement())).to.be.false;
        });

        it('retourne false pour l\'intercommunal', () => {
            expect(can(user).do('write', 'something').on(paris.epci())).to.be.false;
        });

        it('retourne false pour une autre ville', () => {
            expect(can(user).do('write', 'something').on(marseille.city())).to.be.false;
        });

        it('retourne false pour un site situé dans une autre ville', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(marseille.city()))).to.be.false;
        });

        it('retourne false pour n\'importe quelle action', () => {
            expect(can(user).do('write', 'something').on(fakePlan(paris.departement()))).to.be.false;
        });
    });

    describe('si la permission something.write est limitée à un site', () => {
        beforeEach(() => {
            user.permissions.something = {
                write: {
                    allowed: true,
                    allow_all: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [],
                        cities: [],
                        shantytowns: [fakeShantytown(paris.city()).id],
                        plans: [],
                    },
                },
            };
        });

        it('retourne true pour le site en question', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(paris.city()))).to.be.true;
        });

        it('retourne false pour le national', () => {
            expect(can(user).do('write', 'something').on(nation())).to.be.false;
        });

        it('retourne false pour le régional', () => {
            expect(can(user).do('write', 'something').on(paris.region())).to.be.false;
        });

        it('retourne false pour le départemental', () => {
            expect(can(user).do('write', 'something').on(paris.departement())).to.be.false;
        });

        it('retourne false pour l\'intercommunal', () => {
            expect(can(user).do('write', 'something').on(paris.epci())).to.be.false;
        });

        it('retourne false pour le communal', () => {
            expect(can(user).do('write', 'something').on(paris.city())).to.be.false;
        });

        it('retourne false pour n\'importe quel autre site', () => {
            expect(can(user).do('write', 'something').on(fakeShantytown(marseille.city(), { id: 2 }))).to.be.false;
        });

        it('retourne false pour n\'importe quelle action', () => {
            expect(can(user).do('write', 'something').on(fakePlan(paris.departement()))).to.be.false;
        });
    });
});
