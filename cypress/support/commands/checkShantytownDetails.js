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
    cy.get("[data-cy-data='address']").should(
        "contain",
        `Site ${shantytown.address_simple}`
    );

    if (shantytown.name) {
        cy.get("[data-cy-data='name']").should("contain", `${shantytown.name}`);
    } else {
        cy.get("[data-cy-data='name']").should("not.exist");
    }

    cy.get("[data-cy-data='city']").should("contain", shantytown.city);

    cy.get("[data-cy-data='priority']").should("contain", shantytown.priority);

    cy.get("[data-cy-data='built_at']").should("contain", shantytown.built_at);

    cy.get("[data-cy-data='declared_at']").should(
        "contain",
        shantytown.declared_at || "Inconnue"
    );

    cy.get("[data-cy-data='address']").should("contain", shantytown.address);

    if (shantytown.address_details) {
        cy.get("[data-cy-data='address_details']").should(
            "contain",
            shantytown.address_details
        );
    }

    cy.get("[data-cy-data='field_type']").should(
        "contain",
        shantytown.field_type
    );

    cy.get("[data-cy-data='owner_type']").should(
        "contain",
        shantytown.owner_type
    );

    cy.get("[data-cy-data='owner']").should(
        "contain",
        shantytown.owner || "Inconnu"
    );

    cy.get("[data-cy-data='census_status']").should(
        "contain",
        shantytown.census_status
    );

    if (shantytown.census_conducted_at) {
        cy.get("[data-cy-data='census_conducted_at']").should(
            "contain",
            shantytown.census_conducted_at || "Inconnue"
        );
    } else {
        cy.get("[data-cy-data='census_conducted_at']").should("not.exist");
    }

    if (shantytown.census_conducted_by) {
        cy.get("[data-cy-data='census_conducted_by']").should(
            "contain",
            shantytown.census_conducted_by || "Inconnu"
        );
    } else {
        cy.get("[data-cy-data='census_conducted_by']").should("not.exist");
    }

    cy.get("[data-cy-data='population_total']").should(
        "contain",
        shantytown.population_total !== null
            ? shantytown.population_total
            : "inconnu"
    );

    cy.get("[data-cy-data='population_couples']").should(
        "contain",
        shantytown.population_couples !== null
            ? shantytown.population_couples
            : "inconnu"
    );

    cy.get("[data-cy-data='population_minors']").should(
        "contain",
        shantytown.population_minors !== null
            ? shantytown.population_minors
            : "inconnu"
    );

    // @todo: update bug
    cy.get("[data-cy-data='social_origins'] li").should(
        "have.length",
        shantytown.social_origins.length
    );
    shantytown.social_origins.forEach(label => {
        cy.get("[data-cy-data='social_origins'] li").should("contain", label);
    });

    cy.get("[data-cy-data='electricity_type']").should(
        "contain",
        shantytown.electricity_type
    );

    if (shantytown.electricity_comments) {
        cy.get("[data-cy-data='electricity_comments']").should(
            "contain",
            shantytown.electricity_comments
        );
    } else {
        cy.get("[data-cy-data='electricity_comments']").should("not.exist");
    }

    cy.get("[data-cy-data='access_to_water']").should(
        "contain",
        shantytown.access_to_water
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
        shantytown.access_to_sanitary
    );

    if (shantytown.sanitary_comments) {
        cy.get("[data-cy-data='sanitary_comments']").should(
            "contain",
            shantytown.sanitary_comments
        );
    } else {
        cy.get("[data-cy-data='sanitary_comments']").should("not.exist");
    }

    cy.get("[data-cy-data='trash_evacuation']").should(
        "contain",
        shantytown.trash_evacuation
    );

    if (shantytown.owner_complaint) {
        cy.get("[data-cy-data='owner_complaint']").should(
            "contain",
            shantytown.owner_complaint
        );
    } else {
        cy.get("[data-cy-data='owner_complaint']").should("not.exist");
    }

    if (shantytown.justice_procedure) {
        cy.get("[data-cy-data='justice_procedure']").should(
            "contain",
            shantytown.justice_procedure
        );
    } else {
        cy.get("[data-cy-data='justice_procedure']").should("not.exist");
    }

    if (shantytown.justice_rendered) {
        cy.get("[data-cy-data='justice_rendered']").should(
            "contain",
            shantytown.justice_rendered
        );
    } else {
        cy.get("[data-cy-data='justice_rendered']").should("not.exist");
    }

    if (shantytown.justice_rendered_by) {
        cy.get("[data-cy-data='justice_rendered_by']").should(
            "contain",
            shantytown.justice_rendered_by
        );
    } else {
        cy.get("[data-cy-data='justice_rendered_by']").should("not.exist");
    }

    if (shantytown.justice_rendered_at) {
        cy.get("[data-cy-data='justice_rendered_at']").should(
            "contain",
            shantytown.justice_rendered_at
        );
    } else {
        cy.get("[data-cy-data='justice_rendered_at']").should("not.exist");
    }

    if (shantytown.justice_challenged) {
        cy.get("[data-cy-data='justice_challenged']").should(
            "contain",
            shantytown.justice_challenged
        );
    } else {
        cy.get("[data-cy-data='justice_challenged']").should("not.exist");
    }

    cy.get("[data-cy-data='police_status']").should(
        "contain",
        shantytown.police_status
    );

    if (shantytown.police_requested_at) {
        cy.get("[data-cy-data='police_requested_at']").should(
            "contain",
            shantytown.police_requested_at
        );
    } else {
        cy.get("[data-cy-data='police_requested_at']").should("not.exist");
    }

    if (shantytown.police_granted_at) {
        cy.get("[data-cy-data='police_granted_at']").should(
            "contain",
            shantytown.police_granted_at
        );
    } else {
        cy.get("[data-cy-data='police_granted_at']").should("not.exist");
    }

    cy.get("[data-cy-data='bailiff']").should(
        "contain",
        shantytown.bailiff || "Inconnues"
    );
});
