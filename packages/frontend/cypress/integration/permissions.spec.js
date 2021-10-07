const permissions = require("../fixtures/permissions");
const users = require("../fixtures/users.json");

const getAllowedAndForbiddenRoutes = ({ shantytown, plan, admin }) => {
    const allowedRoutes = [];
    const forbiddenRoutes = [];

    (shantytown.create ? allowedRoutes : forbiddenRoutes).push(`/nouveau-site`);
    (plan.create ? allowedRoutes : forbiddenRoutes).push(`/nouveau-dispositif`);
    (admin.stats ? allowedRoutes : forbiddenRoutes).push(`/statistiques`);
    (admin.listUsers ? allowedRoutes : forbiddenRoutes).push(
        `/liste-des-utilisateurs`
    );
    (admin.createUser ? allowedRoutes : forbiddenRoutes).push(
        `/nouvel-utilisateur`
    );

    return { allowedRoutes, forbiddenRoutes };
};

describe("Permissions tests", () => {
    Object.entries(permissions).forEach(
        ([key, { permissions: userPermissions, territory }]) => {
            describe(`Scenario for ${key}`, () => {
                before(() => {
                    cy.server();
                    cy.route("/config").as("getConfig");
                    cy.signinAs(users[key]);
                    cy.wait("@getConfig");
                    cy.saveLocalStorage();
                });

                const {
                    forbiddenRoutes,
                    allowedRoutes
                } = getAllowedAndForbiddenRoutes(userPermissions);

                describe("L'utilisateur etre redirigé sur la cartographie pour les pages sans accès", () => {
                    beforeEach(() => {
                        cy.restoreLocalStorage();
                    });

                    for (const route of forbiddenRoutes) {
                        it(`L'utilisateur ${key} n'a pas le droit d'accéder à ${route}`, () => {
                            cy.visit(route);
                            cy.url().should("include", "/cartographie");
                        });
                    }
                });

                describe("L'utilisateur doit pouvoir accéder à certaine pages si il a les permissions", () => {
                    beforeEach(() => {
                        cy.restoreLocalStorage();
                    });

                    for (const route of allowedRoutes) {
                        it(`L'utilisateur ${key} a le droit d'accéder à ${route}`, () => {
                            cy.visit(route);
                            cy.url().should("include", route);
                        });
                    }
                });

                describe("L'utilisateur ne doit voir que certaines actions sur la fiche d'un site", () => {
                    beforeEach(() => {
                        cy.restoreLocalStorage();
                        cy.visit("/liste-des-sites");
                        cy.get("[data-cy='townCard'] a")
                            .first()
                            .click();
                    });

                    if (userPermissions.shantytown.close) {
                        it(`L'utilisateur ${key} doit pouvoir fermer un site`, () => {
                            cy.get("[data-cy='closeTown']").should("exist");
                        });
                    } else {
                        it(`L'utilisateur ${key} ne doit pas pouvoir fermer un site`, () => {
                            cy.get("[data-cy='closeTown']").should("not.exist");
                        });
                    }

                    if (userPermissions.shantytown.edit) {
                        it(`L'utilisateur ${key} doit pouvoir mettre à jour un site`, () => {
                            cy.get("[data-cy='updateTown']").should("exist");
                        });
                    } else {
                        it(`L'utilisateur ${key} ne doit pas pouvoir mettre à jour un site`, () => {
                            cy.get("[data-cy='updateTown']").should(
                                "not.exist"
                            );
                        });
                    }
                });

                describe("L'utilisateur ne doit voir que certaines informations sur la liste des sites", () => {
                    beforeEach(() => {
                        cy.restoreLocalStorage();
                        cy.visit("/liste-des-sites");
                    });

                    if (!userPermissions.shantytown.readOutsideTerritory) {
                        it(`L'utilisateur ne doit accéder qu'aux sites lié à ${territory}`, () => {
                            let nbSites;

                            cy.get("[data-cy='searchInput']").should($input => {
                                expect($input.val()).to.equal(territory);
                            });

                            // Let's click on voir tous les sites and compare values
                            cy.get("[data-cy='nbSites']").should("exist");
                            cy.get("[data-cy='nbSites']").should($div => {
                                nbSites = $div.text();
                            });
                            cy.get("[data-cy='seeAll']")
                                .first()
                                .click();
                            cy.get("[data-cy='nbSites']").should($div => {
                                const nbSites2 = $div.text();
                                expect(nbSites2).equal(nbSites);
                            });
                        });
                    }
                });
            });
        }
    );
});
