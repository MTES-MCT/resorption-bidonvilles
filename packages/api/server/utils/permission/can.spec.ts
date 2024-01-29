/* eslint-disable no-use-before-define */
import { expect } from 'chai';
import permissionUtils from '#server/utils/permission';
import { serialized as fakeUser } from '#test/utils/user';
import locationUtils from '#test/utils/location';
import { serialized as fakeShantytown } from '#test/utils/shantytown';
import { serialized as fakeAction } from '#test/utils/action';
import { User } from '#root/types/resources/User.d';

const { can } = permissionUtils;
const {
    nation, paris, marseille,
} = locationUtils;

describe('utils/permission.can()', () => {
    let user: User;
    beforeEach(() => {
        user = fakeUser();
    });

    it('retourne false si le user n\'a aucune permision définie pour l\'entité demandée', () => {
        expect(can(user).do('write', 'something').on(paris.city())).to.be.false;
    });

    it('retourne false si le user n\'a par défaut pas la permission pour l\'entitée demandée', () => {
        user.permissions.something = {
            read: { allowed: true, allowed_on_national: true, allowed_on: null },
        };
        expect(can(user).do('write', 'something').on(paris.city())).to.be.false;
    });

    it('retourne false si le user n\'a explicitement PAS la permission pour l\'entitée demandée', () => {
        user.permissions.something = {
            write: { allowed: false, allowed_on_national: false, allowed_on: null },
        };
        expect(can(user).do('write', 'something').on(paris.city())).to.be.false;
    });

    /* eslint-disable indent */
    describe('si le user a la permission sur tout le territoire national', () => {
        it('retourne true, quelle que soit la localisation demandée', () => {
            user.permissions.something = {
                write: { allowed: true, allowed_on_national: true, allowed_on: null },
            };

            expect(can(user).do('write', 'something').on(paris.district())).to.be.true;
            expect(can(user).do('write', 'something').on(paris.city())).to.be.true;
            expect(can(user).do('write', 'something').on(paris.epci())).to.be.true;
            expect(can(user).do('write', 'something').on(paris.departement())).to.be.true;
            expect(can(user).do('write', 'something').on(paris.region())).to.be.true;
            expect(can(user).do('write', 'something').on(nation())).to.be.true;
        });
    });

    describe('si le user a la permission sur une région', () => {
        beforeEach(() => {
            user.permissions.something = {
                write: {
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
            expect(can(user).do('write', 'something').on(fakeAction({ location: paris.departement() }))).to.be.true;
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
            expect(can(user).do('write', 'something').on(fakeAction({ location: marseille.departement() }))).to.be.false;
        });
    });

    describe('si le user a la permission sur un département', () => {
        beforeEach(() => {
            user.permissions.something = {
                write: {
                    allowed: true,
                    allowed_on_national: false,
                    allowed_on: {
                        regions: [],
                        departements: [paris.departement()],
                        epci: [],
                        cities: [],
                        actions: [],
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
            expect(can(user).do('write', 'something').on(fakeAction({ location: paris.departement() }))).to.be.true;
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
            expect(can(user).do('write', 'something').on(fakeAction({ location: marseille.departement() }))).to.be.false;
        });
    });

    describe('si le user a la permission sur un epci', () => {
        beforeEach(() => {
            user.permissions.something = {
                write: {
                    allowed: true,
                    allowed_on_national: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [paris.epci()],
                        cities: [],
                        actions: [],
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
            expect(can(user).do('write', 'something').on(fakeAction({ location: paris.departement() }))).to.be.false;
        });
    });

    describe('si le user a la permission sur une ville', () => {
        beforeEach(() => {
            user.permissions.something = {
                write: {
                    allowed: true,
                    allowed_on_national: false,
                    allowed_on: {
                        regions: [],
                        departements: [],
                        epci: [],
                        cities: [paris.city()],
                        actions: [],
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
            expect(can(user).do('write', 'something').on(fakeAction({ location: paris.departement() }))).to.be.false;
        });
    });
});
