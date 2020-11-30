/**
 * This command fills in the shantytown creation form with the provided data
 *
 * Please note this command assumes the following:
 * - the form is already up and loaded
 * - the form is empty
 *
 * @param {Shantytown} shantytown Data expected to use for filling the form
 *
 * @returns {undefined}
 */
Cypress.Commands.add("fillCreateTown", shantytown => {
    // adresse
    if (shantytown.address_precomplete && shantytown.address) {
        cy.get("[data-cy-field='address'] input")
            .eq(0)
            .type(shantytown.address_precomplete);
        cy.contains(shantytown.address).click();
    }

    // name
    if (shantytown.name) {
        cy.get("[data-cy-field='name']").type(shantytown.name);
    }

    // address details
    if (shantytown.address_details) {
        cy.get("[data-cy-field='detailed_address']").type(
            shantytown.address_details
        );
    }

    // priority
    if (shantytown.priority !== undefined && shantytown.priority !== null) {
        cy.get(
            `[data-cy-field="priority"][data-cy-label="${shantytown.priority}"]`
        ).check();
    }

    // built at
    if (shantytown.built_at) {
        cy.get("[data-cy-field='built_at']").chooseDate(shantytown.built_at);
    }

    // declared at
    if (shantytown.declared_at) {
        cy.get("[data-cy-field='declared_at']").chooseDate(
            shantytown.declared_at
        );
    }

    // field type
    if (shantytown.field_type) {
        cy.get(
            `[data-cy-field="field_type"][data-cy-label="${shantytown.field_type}"]`
        ).check();
    }

    // owner type
    if (shantytown.owner_type) {
        cy.get(
            `[data-cy-field="owner_type"][data-cy-label="${shantytown.owner_type}"]`
        ).check();
    }

    // owner
    if (shantytown.owner) {
        cy.get('[data-cy-field="owner"]').type(shantytown.owner);
    }

    // census status
    if (shantytown.census_status) {
        cy.get(
            `[data-cy-field="census_status"][data-cy-label="${shantytown.census_status}"]`
        ).check();
    }

    // census conducted at
    if (shantytown.census_conducted_at) {
        cy.get("[data-cy-field='census_conducted_at']").chooseDate(
            shantytown.census_conducted_at
        );
    }

    // census conducted by
    if (shantytown.census_conducted_by) {
        cy.get("[data-cy-field='census_conducted_by']").type(
            shantytown.census_conducted_by
        );
    }

    // population total
    if (
        shantytown.population_total !== undefined &&
        shantytown.population_total !== null
    ) {
        cy.get("[data-cy-field='population_total']").type(
            shantytown.population_total
        );
    }

    // population couples
    if (
        shantytown.population_couples !== undefined &&
        shantytown.population_couples !== null
    ) {
        cy.get("[data-cy-field='population_couples']").type(
            shantytown.population_couples
        );
    }

    // population minors
    if (
        shantytown.population_minors !== undefined &&
        shantytown.population_minors !== null
    ) {
        cy.get("[data-cy-field='population_minors']").type(
            shantytown.population_minors
        );
    }

    // social origins
    if (shantytown.social_origins && shantytown.social_origins.length > 0) {
        shantytown.social_origins.forEach(label => {
            cy.get(
                `[data-cy-field="social_origins"][data-cy-label="${label}"]`
            ).check();
        });
    }

    // electricity type
    if (shantytown.electricity_type) {
        cy.get(
            `[data-cy-field="electricity_type"][data-cy-label="${shantytown.electricity_type}"]`
        ).check();
    }

    // electricity comments
    if (shantytown.electricity_comments) {
        cy.get('[data-cy-field="electricity_comments"]').type(
            shantytown.electricity_comments
        );
    }

    // access to water
    if (shantytown.access_to_water) {
        cy.get(
            `[data-cy-field="access_to_water"][data-cy-label="${shantytown.access_to_water}"]`
        ).check();
    }

    // water comments
    if (shantytown.water_comments) {
        cy.get('[data-cy-field="water_comments"]').type(
            shantytown.water_comments
        );
    }

    // access to sanitary
    if (shantytown.access_to_sanitary) {
        cy.get(
            `[data-cy-field="access_to_sanitary"][data-cy-label="${shantytown.access_to_sanitary}"]`
        ).check();
    }

    // sanitary comments
    if (shantytown.sanitary_comments) {
        cy.get('[data-cy-field="sanitary_comments"]').type(
            shantytown.sanitary_comments
        );
    }

    // trash evacuation
    if (shantytown.trash_evacuation) {
        cy.get(
            `[data-cy-field="trash_evacuation"][data-cy-label="${shantytown.trash_evacuation}"]`
        ).check();
    }

    // owner complaint
    if (shantytown.owner_complaint) {
        cy.get(
            `[data-cy-field="owner_complaint"][data-cy-label="${shantytown.owner_complaint}"]`
        ).check();
    }

    // justice procedure
    if (shantytown.justice_procedure) {
        cy.get(
            `[data-cy-field="justice_procedure"][data-cy-label="${shantytown.justice_procedure}"]`
        ).check();
    }

    // justice rendered
    if (shantytown.justice_rendered) {
        cy.get(
            `[data-cy-field="justice_rendered"][data-cy-label="${shantytown.justice_rendered}"]`
        ).check();
    }

    // justice rendered by
    if (shantytown.justice_rendered_by) {
        cy.get('[data-cy-field="justice_rendered_by"]').type(
            shantytown.justice_rendered_by
        );
    }

    // justice rendered at
    if (shantytown.justice_rendered_at) {
        cy.get("[data-cy-field='justice_rendered_at']").chooseDate(
            shantytown.justice_rendered_at
        );
    }

    // justice challenged
    if (shantytown.justice_challenged) {
        cy.get(
            `[data-cy-field="justice_challenged"][data-cy-label="${shantytown.justice_challenged}"]`
        ).check();
    }

    // police status
    if (shantytown.police_status) {
        cy.get(
            `[data-cy-field="police_status"][data-cy-label="${shantytown.police_status}"]`
        ).check();
    }

    // police requested at
    if (shantytown.police_requested_at) {
        cy.get("[data-cy-field='police_requested_at']").chooseDate(
            shantytown.police_requested_at
        );
    }

    // police granted at
    if (shantytown.police_granted_at) {
        cy.get("[data-cy-field='police_granted_at']").chooseDate(
            shantytown.police_granted_at
        );
    }

    // bailiff
    if (shantytown.bailiff) {
        cy.get('[data-cy-field="bailiff"]').type(shantytown.bailiff);
    }
});
