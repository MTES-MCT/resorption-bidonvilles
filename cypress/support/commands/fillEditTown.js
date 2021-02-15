/**
 * This command fills in the shantytown edition form with the provided data
 *
 * Please note the following:
 * - this command assumes the form is already up and loaded
 * - if an entry is set to null or undefined the related input field is emptied
 *
 * @param {Shantytown} shantytown Data expected to use for filling the form
 *
 * @returns {undefined}
 */
Cypress.Commands.add("fillEditTown", shantytown => {
    // adresse
    if (shantytown.address) {
        if (
            cy.get("[data-cy-field='address'] input").eq(0).value !==
            shantytown.address
        ) {
            cy.get("[data-cy-field='address']").emptyAdressAutocompleter();
            cy.get("[data-cy-field='address'] input")
                .eq(0)
                .type(shantytown.address_precomplete);
            cy.contains(shantytown.address).click();
        }
    } else {
        cy.get("[data-cy-field='address']").emptyAdressAutocompleter();
    }

    // name
    if (shantytown.name) {
        cy.get("[data-cy-field='name']").typeReplace(shantytown.name);
    } else {
        cy.get("[data-cy-field='name']").clear();
    }

    // built at
    if (shantytown.built_at) {
        cy.get("[data-cy-field='built_at']").chooseDate(shantytown.built_at);
    } else {
        cy.get("[data-cy-field='built_at']").emptyDate();
    }

    // declared at
    if (shantytown.declared_at) {
        cy.get("[data-cy-field='declared_at']").chooseDate(
            shantytown.declared_at
        );
    } else {
        cy.get("[data-cy-field='declared_at']").emptyDate();
    }

    // field type
    if (shantytown.field_type) {
        cy.get(
            `[data-cy-field="field_type"][data-cy-label="${shantytown.field_type}"]`
        ).myCheck();
    }

    // address details
    if (shantytown.address_details) {
        cy.get("[data-cy-field='detailed_address']").typeReplace(
            shantytown.address_details
        );
    } else {
        cy.get("[data-cy-field='detailed_address']").clear();
    }

    // owner type
    if (shantytown.owner_type) {
        cy.get(
            `[data-cy-field="owner_type"][data-cy-label="${shantytown.owner_type}"]`
        ).myCheck();
    }

    // owner
    if (shantytown.owner) {
        cy.get("[data-cy-field='owner']").typeReplace(shantytown.owner);
    } else if (shantytown.owner_type !== "Inconnu") {
        cy.get("[data-cy-field='owner']").clear();
    }

    // population total
    if (
        shantytown.population_total !== undefined &&
        shantytown.population_total !== null
    ) {
        cy.get("[data-cy-field='population_total']").typeReplace(
            shantytown.population_total
        );
    } else {
        cy.get("[data-cy-field='population_total']").clear();
    }

    // population couples
    if (
        shantytown.population_couples !== undefined &&
        shantytown.population_couples !== null
    ) {
        cy.get("[data-cy-field='population_couples']").typeReplace(
            shantytown.population_couples
        );
    } else {
        cy.get("[data-cy-field='population_couples']").clear();
    }

    // population minors
    if (
        shantytown.population_minors !== undefined &&
        shantytown.population_minors !== null
    ) {
        cy.get("[data-cy-field='population_minors']").typeReplace(
            shantytown.population_minors
        );
    } else {
        cy.get("[data-cy-field='population_minors']").clear();
    }

    // social origins
    cy.get('[data-cy-field="social_origins"]').each($el => {
        if (
            shantytown.social_origins &&
            shantytown.social_origins.indexOf($el.data("cy-label")) !== -1
        ) {
            cy.wrap($el).myCheck();
        } else {
            cy.wrap($el).myUncheck();
        }
    });

    // census status
    if (shantytown.census_status) {
        cy.get(
            `[data-cy-field="census_status"][data-cy-label="${shantytown.census_status}"]`
        ).myCheck();
    }

    // census conducted at
    if (shantytown.census_conducted_at) {
        cy.get("[data-cy-field='census_conducted_at']").chooseDate(
            shantytown.census_conducted_at
        );
    } else if (
        shantytown.census_status === "Prévu" ||
        shantytown.census_status === "Réalisé"
    ) {
        cy.get("[data-cy-field='census_conducted_at']").emptyDate();
    }

    // census conducted by
    if (shantytown.census_conducted_by) {
        cy.get("[data-cy-field='census_conducted_by']").typeReplace(
            shantytown.census_conducted_by
        );
    } else if (
        shantytown.census_status === "Prévu" ||
        shantytown.census_status === "Réalisé"
    ) {
        cy.get("[data-cy-field='census_conducted_by']").clear();
    }

    // population minors 0-3y
    if (
        shantytown.population_minors_0_3 !== undefined &&
        shantytown.population_minors_0_3 !== null
    ) {
        cy.get("[data-cy-field='population_minors_0_3']").typeReplace(
            shantytown.population_minors_0_3
        );
    } else {
        cy.get("[data-cy-field='population_minors_0_3']").clear();
    }

    // population minors 3-6y
    if (
        shantytown.population_minors_3_6 !== undefined &&
        shantytown.population_minors_3_6 !== null
    ) {
        cy.get("[data-cy-field='population_minors_3_6']").typeReplace(
            shantytown.population_minors_3_6
        );
    } else {
        cy.get("[data-cy-field='population_minors_3_6']").clear();
    }

    // population minors 6-12y
    if (
        shantytown.population_minors_6_12 !== undefined &&
        shantytown.population_minors_6_12 !== null
    ) {
        cy.get("[data-cy-field='population_minors_6_12']").typeReplace(
            shantytown.population_minors_6_12
        );
    } else {
        cy.get("[data-cy-field='population_minors_6_12']").clear();
    }

    // population minors 12-16y
    if (
        shantytown.population_minors_12_16 !== undefined &&
        shantytown.population_minors_12_16 !== null
    ) {
        cy.get("[data-cy-field='population_minors_12_16']").typeReplace(
            shantytown.population_minors_12_16
        );
    } else {
        cy.get("[data-cy-field='population_minors_12_16']").clear();
    }

    // population minors 16-18y
    if (
        shantytown.population_minors_16_18 !== undefined &&
        shantytown.population_minors_16_18 !== null
    ) {
        cy.get("[data-cy-field='population_minors_16_18']").typeReplace(
            shantytown.population_minors_16_18
        );
    } else {
        cy.get("[data-cy-field='population_minors_16_18']").clear();
    }

    // minors in school
    if (
        shantytown.minors_in_school !== undefined &&
        shantytown.minors_in_school !== null
    ) {
        cy.get("[data-cy-field='minors_in_school']").typeReplace(
            shantytown.minors_in_school
        );
    } else {
        cy.get("[data-cy-field='minors_in_school']").clear();
    }

    // access to water
    if (shantytown.access_to_water) {
        cy.get(
            `[data-cy-field="access_to_water"][data-cy-label="${shantytown.access_to_water}"]`
        ).myCheck();
    }

    // water comments
    if (shantytown.water_comments) {
        cy.get("[data-cy-field='water_comments']").typeReplace(
            shantytown.water_comments
        );
    } else {
        cy.get("[data-cy-field='water_comments']").clear();
    }

    // access to sanitary
    if (shantytown.access_to_sanitary) {
        cy.get(
            `[data-cy-field="access_to_sanitary"][data-cy-label="${shantytown.access_to_sanitary}"]`
        ).myCheck();
    }

    // sanitary comments
    if (shantytown.sanitary_comments) {
        cy.get("[data-cy-field='sanitary_comments']").typeReplace(
            shantytown.sanitary_comments
        );
    } else {
        cy.get("[data-cy-field='sanitary_comments']").clear();
    }

    // electricity type
    if (shantytown.electricity_type) {
        cy.get(
            `[data-cy-field="electricity_type"][data-cy-label="${shantytown.electricity_type}"]`
        ).myCheck();
    }

    // electricity comments
    if (shantytown.electricity_comments) {
        cy.get("[data-cy-field='electricity_comments']").typeReplace(
            shantytown.electricity_comments
        );
    } else {
        cy.get("[data-cy-field='electricity_comments']").clear();
    }

    // trash evacuation
    if (shantytown.trash_evacuation) {
        cy.get(
            `[data-cy-field="trash_evacuation"][data-cy-label="${shantytown.trash_evacuation}"]`
        ).myCheck();
    }

    // owner complaint
    if (shantytown.owner_complaint) {
        cy.get(
            `[data-cy-field="owner_complaint"][data-cy-label="${shantytown.owner_complaint}"]`
        ).myCheck();
    }

    // justice procedure
    if (shantytown.justice_procedure) {
        cy.get(
            `[data-cy-field="justice_procedure"][data-cy-label="${shantytown.justice_procedure}"]`
        ).myCheck();
    }

    // justice rendered
    if (shantytown.justice_rendered) {
        cy.get(
            `[data-cy-field="justice_rendered"][data-cy-label="${shantytown.justice_rendered}"]`
        ).myCheck();
    }

    // justice rendered by
    if (shantytown.justice_rendered_by) {
        cy.get("[data-cy-field='justice_rendered_by']").typeReplace(
            shantytown.justice_rendered_by
        );
    } else if (shantytown.justice_rendered === "Oui") {
        cy.get("[data-cy-field='justice_rendered_by']").clear();
    }

    // justice rendered at
    if (shantytown.justice_rendered_at) {
        cy.get("[data-cy-field='justice_rendered_at']").chooseDate(
            shantytown.justice_rendered_at
        );
    } else if (shantytown.justice_rendered === "Oui") {
        cy.get("[data-cy-field='justice_rendered_at']").emptyDate();
    }

    // justice challenged
    if (shantytown.justice_challenged) {
        cy.get(
            `[data-cy-field="justice_challenged"][data-cy-label="${shantytown.justice_challenged}"]`
        ).myCheck();
    }

    // police status
    if (shantytown.police_status) {
        cy.get(
            `[data-cy-field="police_status"][data-cy-label="${shantytown.police_status}"]`
        ).myCheck();
    }

    // police requested at
    if (shantytown.police_requested_at) {
        cy.get("[data-cy-field='police_requested_at']").chooseDate(
            shantytown.police_requested_at
        );
    } else if (
        shantytown.police_status === "Demandé" ||
        shantytown.police_status === "Obtenu"
    ) {
        cy.get("[data-cy-field='police_requested_at']").emptyDate();
    }

    // police granted at
    if (shantytown.police_granted_at) {
        cy.get("[data-cy-field='police_granted_at']").chooseDate(
            shantytown.police_granted_at
        );
    } else if (shantytown.police_status === "Obtenu") {
        cy.get("[data-cy-field='police_granted_at']").emptyDate();
    }

    // bailiff
    if (shantytown.bailiff) {
        cy.get("[data-cy-field='bailiff']").typeReplace(shantytown.bailiff);
    } else {
        cy.get("[data-cy-field='bailiff']").clear();
    }
});
