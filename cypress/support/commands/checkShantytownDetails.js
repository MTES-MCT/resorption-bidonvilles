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

    cy.get("[data-cy-data='populationTotal']").should(
        "contain",
        shantytown.population_total !== null ? shantytown.population_total : "-"
    );

    cy.get("[data-cy-data='populationCouples']").should(
        "contain",
        shantytown.population_couples !== null
            ? shantytown.population_couples
            : "-"
    );

    cy.get("[data-cy-data='populationMinors']").should(
        "contain",
        shantytown.population_minors !== null
            ? shantytown.population_minors
            : "-"
    );

    cy.get("[data-cy-data='populationMinors0To3']").should(
        "contain",
        shantytown.population_minors_0_3 !== null
            ? shantytown.population_minors_0_3
            : "-"
    );

    cy.get("[data-cy-data='populationMinors3To6']").should(
        "contain",
        shantytown.population_minors_3_6 !== null
            ? shantytown.population_minors_3_6
            : "-"
    );

    cy.get("[data-cy-data='populationMinors6To12']").should(
        "contain",
        shantytown.population_minors_6_12 !== null
            ? shantytown.population_minors_6_12
            : "-"
    );

    cy.get("[data-cy-data='populationMinors12To16']").should(
        "contain",
        shantytown.population_minors_12_16 !== null
            ? shantytown.population_minors_12_16
            : "-"
    );

    cy.get("[data-cy-data='populationMinors16To18']").should(
        "contain",
        shantytown.population_minors_16_18 !== null
            ? shantytown.population_minors_16_18
            : "-"
    );

    cy.get("[data-cy-data='minorsInSchool']").should(
        "contain",
        shantytown.minors_in_school !== null ? shantytown.minors_in_school : "-"
    );

    if (shantytown.social_origins_details.length > 0) {
        cy.get("[data-cy-data='social_origins'] div").should(
            "have.length",
            shantytown.social_origins_details.length
        );
        shantytown.social_origins_details.forEach(label => {
            cy.get("[data-cy-data='social_origins'] div").should(
                "contain",
                label
            );
        });
    } else {
        cy.get("[data-cy-data='social_origins']").should("contain", "inconnu");
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

    if (shantytown.water_details && shantytown.water_details.positive) {
        cy.get(`[data-cy-data='water_details_positive']`)
            .children()
            .should("have.length", shantytown.water_details.positive.length);

        shantytown.water_details.positive.forEach((item, i) => {
            cy.get(
                `[data-cy-data='water_details_positive'] li:nth-child(${i + 1})`
            ).should("contain", shantytown.water_details.positive[i]);
        });
    } else {
        cy.get("[data-cy-data='water_details_positive']").should("not.exist");
    }

    if (shantytown.water_details && shantytown.water_details.negative) {
        cy.get(`[data-cy-data='water_details_negative']`)
            .children()
            .should("have.length", shantytown.water_details.negative.length);

        shantytown.water_details.negative.forEach((item, i) => {
            cy.get(
                `[data-cy-data='water_details_negative'] li:nth-child(${i + 1})`
            ).should("contain", shantytown.water_details.negative[i]);
        });
    } else {
        cy.get("[data-cy-data='water_details_negative']").should("not.exist");
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

    if (shantytown.sanitary_details && shantytown.sanitary_details.positive) {
        cy.get(`[data-cy-data='sanitary_details_positive']`)
            .children()
            .should("have.length", shantytown.sanitary_details.positive.length);

        shantytown.sanitary_details.positive.forEach((item, i) => {
            cy.get(
                `[data-cy-data='sanitary_details_positive'] li:nth-child(${i +
                    1})`
            ).should("contain", shantytown.sanitary_details.positive[i]);
        });
    } else {
        cy.get("[data-cy-data='sanitary_details_positive']").should(
            "not.exist"
        );
    }

    if (shantytown.sanitary_details && shantytown.sanitary_details.negative) {
        cy.get(`[data-cy-data='sanitary_details_negative']`)
            .children()
            .should("have.length", shantytown.sanitary_details.negative.length);

        shantytown.sanitary_details.negative.forEach((item, i) => {
            cy.get(
                `[data-cy-data='sanitary_details_negative'] li:nth-child(${i +
                    1})`
            ).should("contain", shantytown.sanitary_details.negative[i]);
        });
    } else {
        cy.get("[data-cy-data='sanitary_details_negative']").should(
            "not.exist"
        );
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

    if (shantytown.trash_details && shantytown.trash_details.positive) {
        cy.get(`[data-cy-data='trash_details_positive']`)
            .children()
            .should("have.length", shantytown.trash_details.positive.length);

        shantytown.trash_details.positive.forEach((item, i) => {
            cy.get(
                `[data-cy-data='trash_details_positive'] li:nth-child(${i + 1})`
            ).should("contain", shantytown.trash_details.positive[i]);
        });
    } else {
        cy.get("[data-cy-data='trash_details_positive']").should("not.exist");
    }

    if (shantytown.trash_details && shantytown.trash_details.negative) {
        cy.get(`[data-cy-data='trash_details_negative']`)
            .children()
            .should("have.length", shantytown.trash_details.negative.length);

        shantytown.trash_details.negative.forEach((item, i) => {
            cy.get(
                `[data-cy-data='trash_details_negative'] li:nth-child(${i + 1})`
            ).should("contain", shantytown.trash_details.negative[i]);
        });
    } else {
        cy.get("[data-cy-data='trash_details_negative']").should("not.exist");
    }

    cy.get("[data-cy-data='vermin']").should(
        "contain",
        shantytown.vermin.toLowerCase()
    );

    if (shantytown.vermin_comments) {
        cy.get("[data-cy-data='vermin_comments']").should(
            "contain",
            shantytown.vermin_comments
        );
    } else {
        cy.get("[data-cy-data='vermin_comments']").should("not.exist");
    }

    if (shantytown.fire_details && shantytown.fire_details.positive) {
        cy.get(`[data-cy-data='fire_prevention_details_positive']`)
            .children()
            .should("have.length", shantytown.fire_details.positive.length);

        shantytown.fire_details.positive.forEach((item, i) => {
            cy.get(
                `[data-cy-data='fire_prevention_details_positive'] li:nth-child(${i +
                    1})`
            ).should("contain", shantytown.fire_details.positive[i]);
        });
    } else {
        cy.get("[data-cy-data='fire_prevention_details_positive']").should(
            "not.exist"
        );
    }

    if (shantytown.fire_details && shantytown.fire_details.negative) {
        cy.get(`[data-cy-data='fire_prevention_details_negative']`)
            .children()
            .should("have.length", shantytown.fire_details.negative.length);

        shantytown.fire_details.negative.forEach((item, i) => {
            cy.get(
                `[data-cy-data='fire_prevention_details_negative'] li:nth-child(${i +
                    1})`
            ).should("contain", shantytown.fire_details.negative[i]);
        });
    } else {
        cy.get("[data-cy-data='fire_prevention_details_negative']").should(
            "not.exist"
        );
    }

    cy.get("[data-cy-data='fire_prevention_measures']").should(
        "contain",
        shantytown.fire_prevention_measures.toLowerCase()
    );

    if (shantytown.fire_prevention_comments) {
        cy.get("[data-cy-data='fire_prevention_comments']").should(
            "contain",
            shantytown.fire_prevention_comments
        );
    } else {
        cy.get("[data-cy-data='fire_prevention_comments']").should("not.exist");
    }

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
