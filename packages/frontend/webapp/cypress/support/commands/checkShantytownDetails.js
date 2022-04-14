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
    cy.get("[data-cy-data='city']").contains(
        `${shantytown.city} (${shantytown.departement})`
    );

    cy.get("[data-cy-data='address']").contains(
        `${shantytown.address_simple}${
            shantytown.name ? ` « ${shantytown.name} »` : ""
        }`
    );

    cy.get("[data-cy-data='built_at']").contains(shantytown.built_at_plain);

    cy.get("[data-cy-data='declared_at']").contains(
        shantytown.declared_at_plain
    );

    cy.get("[data-cy-data='field_type']").contains(shantytown.field_type);

    if (shantytown.address_details) {
        cy.get("[data-cy-data='address_details']").contains(
            shantytown.address_details
        );
    } else {
        cy.get("[data-cy-data='address_details']").should("not.exist");
    }

    cy.get("[data-cy-data='owner_type']").contains(shantytown.owner_type);

    if (shantytown.owner_type !== "Inconnu") {
        cy.get("[data-cy-data='owner']").contains(
            shantytown.owner || "non communiqué"
        );
    } else {
        cy.get("[data-cy-data='owner']").should("not.exist");
    }

    cy.get("[data-cy-data='is_reinstallation']").contains(
        shantytown.is_reinstallation_plain
    );

    if (shantytown.reinstallation_comments) {
        cy.get("[data-cy-data='reinstallation_comments']").should($div => {
            expect($div.text()).contains(shantytown.reinstallation_comments);
        });
    } else {
        cy.get("[data-cy-data='reinstallation_comments']").should("not.exist");
    }

    cy.get("[data-cy-data='populationTotal']").contains(
        shantytown.population_total !== null ? shantytown.population_total : "-"
    );

    cy.get("[data-cy-data='populationCouples']").contains(
        shantytown.population_couples !== null
            ? shantytown.population_couples
            : "-"
    );

    cy.get("[data-cy-data='populationMinors']").contains(
        shantytown.population_minors !== null
            ? shantytown.population_minors
            : "-"
    );

    cy.get("[data-cy-data='populationMinors0To3']").contains(
        shantytown.population_minors_0_3 !== null
            ? shantytown.population_minors_0_3
            : "-"
    );

    cy.get("[data-cy-data='populationMinors3To6']").contains(
        shantytown.population_minors_3_6 !== null
            ? shantytown.population_minors_3_6
            : "-"
    );

    cy.get("[data-cy-data='populationMinors6To12']").contains(
        shantytown.population_minors_6_12 !== null
            ? shantytown.population_minors_6_12
            : "-"
    );

    cy.get("[data-cy-data='populationMinors12To16']").contains(
        shantytown.population_minors_12_16 !== null
            ? shantytown.population_minors_12_16
            : "-"
    );

    cy.get("[data-cy-data='populationMinors16To18']").contains(
        shantytown.population_minors_16_18 !== null
            ? shantytown.population_minors_16_18
            : "-"
    );

    cy.get("[data-cy-data='minorsInSchool']").contains(
        shantytown.minors_in_school !== null ? shantytown.minors_in_school : "-"
    );

    if (shantytown.social_origins_details.length > 0) {
        cy.get("[data-cy-data='social_origins'] div").should(
            "have.length",
            shantytown.social_origins_details.length
        );
        shantytown.social_origins_details.forEach(label => {
            cy.get("[data-cy-data='social_origins'] div").contains(label);
        });
    } else {
        cy.get("[data-cy-data='social_origins']").contains("inconnu");
    }

    cy.get("[data-cy-data='census_status']").contains(
        shantytown.census_status_plain
    );

    cy.get("[data-cy-data='access_to_water']").contains(
        shantytown.access_to_water.toLowerCase()
    );

    if (shantytown.water_comments) {
        cy.get("[data-cy-data='water_comments']").should($div => {
            expect($div.text()).contains(shantytown.water_comments);
        });
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
            ).contains(shantytown.water_details.positive[i]);
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
            ).contains(shantytown.water_details.negative[i]);
        });
    } else {
        cy.get("[data-cy-data='water_details_negative']").should("not.exist");
    }

    cy.get("[data-cy-data='access_to_sanitary']").should(
        "contain",
        shantytown.access_to_sanitary.toLowerCase()
    );

    if (shantytown.sanitary_comments) {
        cy.get("[data-cy-data='sanitary_comments']").should($div => {
            expect($div.text()).contains(shantytown.sanitary_comments);
        });
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
            ).contains(shantytown.sanitary_details.positive[i]);
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
            ).contains(shantytown.sanitary_details.negative[i]);
        });
    } else {
        cy.get("[data-cy-data='sanitary_details_negative']").should(
            "not.exist"
        );
    }

    cy.get("[data-cy-data='electricity_type']").contains(
        shantytown.electricity_type.toLowerCase()
    );

    if (shantytown.electricity_comments) {
        cy.get("[data-cy-data='electricity_comments']").should($div => {
            expect($div.text()).contains(shantytown.electricity_comments);
        });
    } else {
        cy.get("[data-cy-data='electricity_comments']").should("not.exist");
    }

    cy.get("[data-cy-data='trash_evacuation']").contains(
        shantytown.trash_evacuation.toLowerCase()
    );

    if (shantytown.trash_details && shantytown.trash_details.positive) {
        cy.get(`[data-cy-data='trash_details_positive']`)
            .children()
            .should("have.length", shantytown.trash_details.positive.length);

        shantytown.trash_details.positive.forEach((item, i) => {
            cy.get(
                `[data-cy-data='trash_details_positive'] li:nth-child(${i + 1})`
            ).contains(shantytown.trash_details.positive[i]);
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
            ).contains(shantytown.trash_details.negative[i]);
        });
    } else {
        cy.get("[data-cy-data='trash_details_negative']").should("not.exist");
    }

    cy.get("[data-cy-data='vermin']").contains(shantytown.vermin.toLowerCase());

    if (shantytown.vermin_comments) {
        cy.get("[data-cy-data='vermin_comments']").should($div => {
            expect($div.text()).contains(shantytown.vermin_comments);
        });
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
            ).contains(shantytown.fire_details.positive[i]);
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
            ).contains(shantytown.fire_details.negative[i]);
        });
    } else {
        cy.get("[data-cy-data='fire_prevention_details_negative']").should(
            "not.exist"
        );
    }

    cy.get("[data-cy-data='fire_prevention_measures']").contains(
        shantytown.fire_prevention_measures.toLowerCase()
    );

    if (shantytown.fire_prevention_comments) {
        cy.get("[data-cy-data='fire_prevention_comments']").should($div => {
            expect($div.text()).contains(shantytown.fire_prevention_comments);
        });
    } else {
        cy.get("[data-cy-data='fire_prevention_comments']").should("not.exist");
    }

    cy.get("[data-cy-data='owner_complaint']").contains(
        shantytown.owner_complaint_plain
    );

    cy.get("[data-cy-data='justice_procedure']").contains(
        shantytown.justice_procedure_plain
    );

    cy.get("[data-cy-data='justice_rendered']").contains(
        shantytown.justice_rendered_plain
    );

    cy.get("[data-cy-data='justice_challenged']").contains(
        shantytown.justice_challenged_plain
    );

    cy.get("[data-cy-data='police_status']").contains(
        shantytown.police_status_plain
    );

    cy.get("[data-cy-data='bailiff']").contains(shantytown.bailiff || "NC");
});
