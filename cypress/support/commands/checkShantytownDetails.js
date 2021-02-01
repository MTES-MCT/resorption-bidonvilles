/**
 * This command asserts that the details page of a shantytown contains the proper data
 *
 * This command assumes it is ran on a details page (/towns.details.js).
 *
 * @param {Shantytown} shantytown Data expected to be found on the page
 *
 * @returns {undefined}
 */
Cypress.Commands.add("checkShantytownDetails", shantytown => {
    cy.get("[data-cy-data='city']").should(
        "contain",
        `${shantytown.city} (${shantytown.departement})`
    );

    cy.get("[data-cy-data='address']").should(
        "contain",
        `${shantytown.address_simple}${
            shantytown.name ? ` « ${shantytown.name} »` : ""
        }`
    );

    cy.get("[data-cy-data='built_at']").should(
        "contain",
        shantytown.built_at_plain
    );

    cy.get("[data-cy-data='declared_at']").should(
        "contain",
        shantytown.declared_at_plain
    );

    cy.get("[data-cy-data='field_type']").should(
        "contain",
        shantytown.field_type
    );

    if (shantytown.address_details) {
        cy.get("[data-cy-data='address_details']").should(
            "contain",
            shantytown.address_details
        );
    } else {
        cy.get("[data-cy-data='address_details']").should("not.exist");
    }

    cy.get("[data-cy-data='owner_type']").should(
        "contain",
        shantytown.owner_type
    );

    if (shantytown.owner_type !== "Inconnu") {
        cy.get("[data-cy-data='owner']").should(
            "contain",
            shantytown.owner || "non communiqué"
        );
    } else {
        cy.get("[data-cy-data='owner']").should("not.exist");
    }

    cy.get("[data-cy-data='population_total']").should(
        "contain",
        `${
            shantytown.population_total !== null
                ? shantytown.population_total
                : "0"
        } personnes`
    );

    cy.get("[data-cy-data='population_couples']").should(
        "contain",
        `${
            shantytown.population_couples !== null
                ? shantytown.population_couples
                : "0"
        } ménages`
    );

    cy.get("[data-cy-data='population_minors']").should(
        "contain",
        `${
            shantytown.population_minors !== null
                ? shantytown.population_minors
                : "0"
        } mineurs`
    );

    cy.get("[data-cy-data='population_minors_0_3']").should(
        "contain",
        shantytown.population_minors_0_3 !== null
            ? shantytown.population_minors_0_3
            : "NC"
    );

    cy.get("[data-cy-data='population_minors_3_6']").should(
        "contain",
        shantytown.population_minors_3_6 !== null
            ? shantytown.population_minors_3_6
            : "NC"
    );

    cy.get("[data-cy-data='population_minors_6_12']").should(
        "contain",
        shantytown.population_minors_6_12 !== null
            ? shantytown.population_minors_6_12
            : "NC"
    );

    cy.get("[data-cy-data='population_minors_12_16']").should(
        "contain",
        shantytown.population_minors_12_16 !== null
            ? shantytown.population_minors_12_16
            : "NC"
    );

    cy.get("[data-cy-data='population_minors_16_18']").should(
        "contain",
        shantytown.population_minors_16_18 !== null
            ? shantytown.population_minors_16_18
            : "NC"
    );

    if (shantytown.social_origins.length > 0) {
        cy.get("[data-cy-data='social_origins'] div").should(
            "have.length",
            shantytown.social_origins.length
        );
        shantytown.social_origins.forEach(label => {
            cy.get("[data-cy-data='social_origins'] div").should(
                "contain",
                label
            );
        });
    } else {
        cy.get("[data-cy-data='social_origins']").should("contain", "inconnue");
    }

    cy.get("[data-cy-data='census_status']").should(
        "contain",
        shantytown.census_status_plain
    );

    cy.get("[data-cy-data='access_to_water']").should(
        "contain",
        shantytown.access_to_water.toLowerCase()
    );

    if (shantytown.water_comments) {
        cy.get("[data-cy-data='water_comments']").should(
            "contain",
            shantytown.water_comments
        );
    } else {
        cy.get("[data-cy-data='water_comments']").should("not.exist");
    }

    cy.get("[data-cy-data='access_to_sanitary']").should(
        "contain",
        shantytown.access_to_sanitary.toLowerCase()
    );

    if (shantytown.sanitary_comments) {
        cy.get("[data-cy-data='sanitary_comments']").should(
            "contain",
            shantytown.sanitary_comments
        );
    } else {
        cy.get("[data-cy-data='sanitary_comments']").should("not.exist");
    }

    cy.get("[data-cy-data='electricity_type']").should(
        "contain",
        shantytown.electricity_type.toLowerCase()
    );

    if (shantytown.electricity_comments) {
        cy.get("[data-cy-data='electricity_comments']").should(
            "contain",
            shantytown.electricity_comments
        );
    } else {
        cy.get("[data-cy-data='electricity_comments']").should("not.exist");
    }

    cy.get("[data-cy-data='trash_evacuation']").should(
        "contain",
        shantytown.trash_evacuation.toLowerCase()
    );

    cy.get("[data-cy-data='owner_complaint']").should(
        "contain",
        shantytown.owner_complaint_plain
    );

    cy.get("[data-cy-data='justice_procedure']").should(
        "contain",
        shantytown.justice_procedure_plain
    );

    cy.get("[data-cy-data='justice_rendered']").should(
        "contain",
        shantytown.justice_rendered_plain
    );

    cy.get("[data-cy-data='justice_challenged']").should(
        "contain",
        shantytown.justice_challenged_plain
    );

    cy.get("[data-cy-data='police_status']").should(
        "contain",
        shantytown.police_status_plain
    );

    cy.get("[data-cy-data='bailiff']").should(
        "contain",
        shantytown.bailiff || "NC"
    );
});
