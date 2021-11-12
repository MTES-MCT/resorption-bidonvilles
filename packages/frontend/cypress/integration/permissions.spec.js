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

                describe(`L'utilisateur ${key} doit etre redirigé sur la cartographie pour les pages sans accès`, () => {
                    beforeEach(() => {
                        cy.restoreLocalStorage();
                    });

                    for (const route of forbiddenRoutes) {
                        it(`L'utilisateur ${key} n'a pas le droit d'accéder à ${route}`, () => {
                            cy.visit(route);
                            cy.url().should("not.include", "/launcher");
                            cy.url().should("include", "/cartographie");
                        });
                    }
                });

                describe(`L'utilisateur ${key} doit pouvoir accéder à certaine pages si il a les permissions`, () => {
                    beforeEach(() => {
                        cy.restoreLocalStorage();
                    });

                    for (const route of allowedRoutes) {
                        it(`L'utilisateur ${key} a le droit d'accéder à ${route}`, () => {
                            cy.visit(route);
                            cy.url().should("not.include", "/launcher");
                            cy.url().should("include", route);
                        });
                    }
                });

                describe(`L'utilisateur ${key} ne doit voir que certaines actions sur la fiche d'un site`, () => {
                    beforeEach(() => {
                        cy.server();
                        cy.restoreLocalStorage();
                        cy.visit(TEST_URL);
                        cy.route(`/towns/*`).as("getShantytown");
                        cy.wait("@getShantytown");
                    });

                    if (userPermissions.shantytown.close) {
                        it(`L'utilisateur ${key} doit pouvoir fermer un site`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("[data-cy='closeTown']").should("exist");
                        });
                    } else {
                        it(`L'utilisateur ${key} ne doit pas pouvoir fermer un site`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("[data-cy='closeTown']").should("not.exist");
                        });
                    }

                    if (userPermissions.shantytown.edit) {
                        it(`L'utilisateur ${key} doit pouvoir mettre à jour un site`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("[data-cy='updateTown']").should("exist");
                        });
                    } else {
                        it(`L'utilisateur ${key} ne doit pas pouvoir mettre à jour un site`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("[data-cy='updateTown']").should(
                                "not.exist"
                            );
                        });
                    }

                    if (userPermissions.shantytown.readPrivateComments) {
                        it(`L'utilisateur ${key} doit pouvoir lire les commentaires privés`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("#comments").should("contain", "2 messages");
                        });
                    } else {
                        it(`L'utilisateur ${key} doit pouvoir lire que les commentaires publiques`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("#comments").should("contain", "1 message");
                        });
                    }

                    if (userPermissions.shantytown.hideJustice) {
                        it(`L'utilisateur ${key} ne doit pas pouvoir lire les procédures judiciaires`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("#judicial").should("not.exist");
                        });
                    } else {
                        it(`L'utilisateur ${key} doit pouvoir lire les procédures judiciaires`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("#judicial").should("exist");
                        });
                    }

                    if (userPermissions.shantytown.hideOwner) {
                        it(`L'utilisateur ${key} ne doit pas pouvoir lire le nom du propriétaire`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("[data-cy-data='owner']").should(
                                "not.exist"
                            );
                        });
                    } else {
                        it(`L'utilisateur ${key} doit pouvoir lire le nom du propriétaire`, () => {
                            cy.url().should("include", TEST_URL);
                            cy.get("[data-cy-data='owner']").should("exist");
                        });
                    }
                });

                describe(`L'utilisateur ${key} ne doit voir que certaines informations sur la liste des sites`, () => {
                    const townListURL = "/liste-des-sites";
                    beforeEach(() => {
                        cy.server();
                        cy.restoreLocalStorage();
                        cy.visit(townListURL);
                        cy.route(`/towns`).as("getShantytowns");
                        cy.wait("@getShantytowns");
                    });

                    if (!userPermissions.shantytown.readOutsideTerritory) {
                        it(`L'utilisateur ${key} ne doit accéder qu'aux sites lié à ${territory}`, () => {
                            let nbSites;

                            cy.url().should("include", townListURL);

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

                describe(`L'utilisateur ${key} ne doit voir que certaines actions sur la liste des dispositifs`, () => {
                    const planListURL = "/liste-des-dispositifs";

                    beforeEach(() => {
                        cy.server();
                        cy.restoreLocalStorage();
                        cy.visit(planListURL);
                        cy.route(`/plans`).as("getPlans");
                        cy.wait("@getPlans");
                    });

                    if (userPermissions.plan.create) {
                        it(`L'utilisateur ${key} doit voir le bouton nouveau dispositif`, () => {
                            cy.url().should("include", planListURL);
                            cy.get("a[href='/nouveau-dispositif']").should(
                                "exist"
                            );
                        });
                    } else {
                        it(`L'utilisateur ${key} ne doit pas voir le bouton nouveau dispositif`, () => {
                            cy.url().should("include", planListURL);
                            cy.get("a[href='/nouveau-dispositif']").should(
                                "not.exist"
                            );
                        });
                    }
                });

                describe(`L'utilisateur ${key} ne doit voir que certaines actions sur la fiche d'un dispositif`, () => {
                    let firstPlanHref;

                    before(() => {
                        cy.restoreLocalStorage();
                        cy.visit("/liste-des-dispositifs");
                        cy.get("tr.table-row--odd")
                            .first()
                            .invoke("attr", "href")
                            .then(href => {
                                firstPlanHref = href;
                            });
                    });

                    beforeEach(() => {
                        cy.server();
                        cy.restoreLocalStorage();
                        cy.visit(firstPlanHref);
                        cy.route(`/plans/*`).as("getPlan");
                        cy.wait("@getPlan");
                    });

                    if (userPermissions.plan.update) {
                        it(`L'utilisateur ${key} peut mettre à jour le dispositif`, () => {
                            cy.url().should("include", firstPlanHref);
                            cy.get("[data-cy='planUpdate']").should("exist");
                        });
                    } else {
                        it(`L'utilisateur ${key} ne doit pas pouvoir mettre à jour le dispositif`, () => {
                            cy.url().should("include", firstPlanHref);
                            cy.get("[data-cy='planUpdate']").should(
                                "not.exist"
                            );
                        });
                    }

                    if (userPermissions.plan.updateMarks) {
                        it(`L'utilisateur ${key} peut mettre à jour les indicateurs`, () => {
                            cy.url().should("include", firstPlanHref);
                            cy.get("[data-cy='planMarks']").should("exist");
                        });
                    } else {
                        it(`L'utilisateur ${key} ne doit pas pouvoir mettre à jour les indicateurs`, () => {
                            cy.url().should("include", firstPlanHref);
                            cy.get("[data-cy='planMarks']").should("not.exist");
                        });
                    }

                    if (userPermissions.plan.close) {
                        it(`L'utilisateur ${key} peut fermer un dispositif`, () => {
                            cy.url().should("include", firstPlanHref);
                            cy.get("[data-cy='planClose']").should("exist");
                        });
                    } else {
                        it(`L'utilisateur ${key} ne doit pas pouvoir fermer un dispositif`, () => {
                            cy.url().should("include", firstPlanHref);
                            cy.get("[data-cy='planClose']").should("not.exist");
                        });
                    }
                });
            });
        }
    );
});
