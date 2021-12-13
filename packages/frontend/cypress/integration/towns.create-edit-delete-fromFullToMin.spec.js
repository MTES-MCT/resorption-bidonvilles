describe("Gestion des sites", () => {
    it("Je peux déclarer un site complet, le modifier au minimum, puis le supprimer", () => {
        cy.fixture("users").then(({ admin }) => {
            cy.intercept("GET", "/config").as("getConfig");
            cy.signinAs(admin);
            cy.wait("@getConfig").then(() => {
                cy.fixture("shantytowns").then(
                    ({ full: fullShantytown, min: minShantytown }) => {
                        /* ******************************************************************************
                         * Create the shantytown
                         ****************************************************************************** */

                        // prepare
                        cy.contains("Déclarer un site").click({ force: true });
                        cy.url().should("include", "/nouveau-site");
                        cy.fillCreateTown(fullShantytown);
                        cy.get("[data-cy-button='submit']").click();

                        // assert
                        cy.get(".vue-notification").should(
                            "contain",
                            "La déclaration du site a réussi"
                        );
                        cy.checkShantytownDetails(fullShantytown);

                        /* **********************************************************************************
                         * Update the shantytown
                         ********************************************************************************* */

                        // prepare
                        cy.url().then(url => {
                            const siteId = url.split("/").pop();

                            cy.contains("Mettre à jour").click();
                            cy.fillEditTown(minShantytown);
                            cy.get("[data-cy-button='submit']").click();

                            // assert
                            cy.get(".vue-notification").should(
                                "contain",
                                "Le site a bien été modifié"
                            );
                            cy.checkShantytownDetails(minShantytown);

                            /* **************************************************************************
                             * Delete the shantytown
                             ************************************************************************* */

                            // prepare
                            cy.get("[data-cy-button='delete']").click();

                            // assert
                            cy.url().should("contain", "/liste-des-sites");
                            cy.visit(`/site/${siteId}`);
                            cy.get("body").should(
                                "contain",
                                "Le site demandé n'existe pas en base de données"
                            );
                        });
                    }
                );
            });
        });
    });
});
