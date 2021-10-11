/* eslint-disable no-undef */
const permissions = require("../fixtures/permissions");
const users = require("../fixtures/users.json");

const TEST_SHANTYTOWN_ID = 999999;
const TEST_URL = `/site/${TEST_SHANTYTOWN_ID}`;

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

const tests = {
    // intervenant: permissions.intervenant,
    // localAdmin: permissions.localAdmin
    departement: permissions.departement
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
                        cy.wait(100)
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
                        cy.wait(100)
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
                        cy.wait(100)
                        cy.visit(TEST_URL);
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

                    if (userPermissions.shantytown.readPrivateComments) {
                        it(`L'utilisateur ${key} doit pouvoir lire les commentaires privés`, () => {
                            cy.get("#comments").should("contain", "2 messages");
                        });
                    } else {
                        it(`L'utilisateur ${key} doit pouvoir lire que les commentaires publiques`, () => {
                            cy.get("#comments").should("contain", "1 message");
                        });
                    }

                    if (userPermissions.shantytown.hideJustice) {
                        it(`L'utilisateur ${key} ne doit pas pouvoir lire les procédures judiciaires`, () => {
                            cy.get("#judicial").should("not.exist");
                        });
                    } else {
                        it(`L'utilisateur ${key} doit pouvoir lire les procédures judiciaires`, () => {
                            cy.get("#judicial").should("exist");
                        });
                    }
                });

                describe("L'utilisateur ne doit voir que certaines informations sur la liste des sites", () => {
                    beforeEach(() => {
                        cy.restoreLocalStorage();
                        cy.wait(100)
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

                describe("L'utilisateur ne doit voir que certaines actions sur la liste des dispositifs", () => {
                    beforeEach(() => {
                        cy.restoreLocalStorage();
                        cy.wait(100)
                        cy.visit("/liste-des-dispositifs");
                    });

                    if (userPermissions.plan.create) {
                        it("L'utilisateur doit voir le bouton nouveau dispositif", () => {
                            cy.get("a[href='/nouveau-dispositif']").should(
                                "exist"
                            );
                        });
                    } else {
                        it("L'utilisateur ne doit pas voir le bouton nouveau dispositif", () => {
                            cy.get("a[href='/nouveau-dispositif']").should(
                                "not.exist"
                            );
                        });
                    }
                });

                describe("L'utilisateur ne doit voir que certaines actions sur la fiche d'un dispositif", () => {
                    beforeEach(() => {
                        cy.restoreLocalStorage();
                        cy.wait(100)
                        cy.visit("/liste-des-dispositifs");
                        cy.get("tr.table-row--odd")
                            .first()
                            .invoke("attr", "href")
                            .then(href => cy.visit(href));
                    });

                    if (userPermissions.plan.update) {
                        it("L'utilisateur peut mettre à jour le dispositif", () => {
                            cy.get("[data-cy='planUpdate']").should("exist");
                        });
                    } else {
                        it("L'utilisateur ne doit pas pouvoir mettre à jour le dispositif", () => {
                            cy.get("[data-cy='planUpdate']").should(
                                "not.exist"
                            );
                        });
                    }

                    if (userPermissions.plan.updateMarks) {
                        it("L'utilisateur peut mettre à jour les indicateurs", () => {
                            cy.get("[data-cy='planMarks']").should("exist");
                        });
                    } else {
                        it("L'utilisateur ne doit pas pouvoir mettre à jour les indicateurs", () => {
                            cy.get("[data-cy='planMarks']").should("not.exist");
                        });
                    }

                    if (userPermissions.plan.close) {
                        it("L'utilisateur peut fermer un dispositif", () => {
                            cy.get("[data-cy='planClose']").should("exist");
                        });
                    } else {
                        it("L'utilisateur ne doit pas pouvoir fermer un dispositif", () => {
                            cy.get("[data-cy='planClose']").should("not.exist");
                        });
                    }
                });
            });
        }
    );
});
