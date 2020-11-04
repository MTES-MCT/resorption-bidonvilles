describe("Gestion des sites", () => {
    it("Je peux déclarer un site au minimum, le modifier au maximum, puis le supprimer", () => {
        cy.fixture("users").then(({ admin }) => {
            cy.server();
            cy.route("/config").as("getConfig");
            cy.signinAs(admin);
            cy.wait("@getConfig").then(() => {
                cy.fixture("shantytowns").then(
                    ({ full: fullShantytown, min: minShantytown }) => {
                        /* ******************************************************************************
                         * Create the shantytown
                         ****************************************************************************** */

                        // prepare
                        cy.contains("Déclarer un site").click({ force: true });
                        cy.fillCreateTown(minShantytown);
                        cy.get("[data-cy-button='submit']").click();

                        // assert
                        cy.get(".vue-notification").should(
                            "contain",
                            "La déclaration du site a réussi"
                        );
                        cy.checkShantytownDetails(minShantytown);

                        /* **********************************************************************************
                         * Update the shantytown
                         ********************************************************************************* */

                        // prepare
                        cy.url().then(url => {
                            const siteId = url.split("/").pop();

                            cy.contains("Mettre à jour").click();
                            cy.fillEditTown(fullShantytown);
                            cy.get("[data-cy-field='submit']").click();

                            // assert
                            cy.get(".vue-notification").should(
                                "contain",
                                "Le site a bien été modifié"
                            );
                            cy.checkShantytownDetails(fullShantytown);

                            /* **************************************************************************
                             * Delete the shantytown
                             ************************************************************************* */

                            // prepare
                            cy.get("[data-cy-button='delete']").click();

                            // assert
                            cy.url().should("contain", "/liste-des-sites");
                            cy.visit(`/#/site/${siteId}`);
                            cy.get(".notification.error").should(
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
