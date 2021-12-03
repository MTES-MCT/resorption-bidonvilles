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
        ).myCheck();
    }

    // owner type
    if (shantytown.owner_type) {
        cy.get(
            `[data-cy-field="owner_type"][data-cy-label="${shantytown.owner_type}"]`
        ).myCheck();
    }

    // owner
    if (shantytown.owner) {
        cy.get('[data-cy-field="owner"]').type(shantytown.owner);
    }

    // reinstallation
    if (shantytown.is_reinstallation) {
        cy.get(
            `[data-cy-field="is_reinstallation"][data-cy-label="${shantytown.is_reinstallation}"]`
        ).myCheck();
    }

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

    // population minors 0-3y
    if (
        shantytown.population_minors_0_3 !== undefined &&
        shantytown.population_minors_0_3 !== null
    ) {
        cy.get("[data-cy-field='population_minors_0_3']").type(
            shantytown.population_minors_0_3
        );
    }

    // population minors 3-6y
    if (
        shantytown.population_minors_3_6 !== undefined &&
        shantytown.population_minors_3_6 !== null
    ) {
        cy.get("[data-cy-field='population_minors_3_6']").type(
            shantytown.population_minors_3_6
        );
    }

    // population minors 6-12y
    if (
        shantytown.population_minors_6_12 !== undefined &&
        shantytown.population_minors_6_12 !== null
    ) {
        cy.get("[data-cy-field='population_minors_6_12']").type(
            shantytown.population_minors_6_12
        );
    }

    // population minors 12-16y
    if (
        shantytown.population_minors_12_16 !== undefined &&
        shantytown.population_minors_12_16 !== null
    ) {
        cy.get("[data-cy-field='population_minors_12_16']").type(
            shantytown.population_minors_12_16
        );
    }

    // population minors 16-18y
    if (
        shantytown.population_minors_16_18 !== undefined &&
        shantytown.population_minors_16_18 !== null
    ) {
        cy.get("[data-cy-field='population_minors_16_18']").type(
            shantytown.population_minors_16_18
        );
    }

    // minors in school
    if (
        shantytown.minors_in_school !== undefined &&
        shantytown.minors_in_school !== null
    ) {
        cy.get("[data-cy-field='minors_in_school']").type(
            shantytown.minors_in_school
        );
    }

    // social origins
    if (shantytown.social_origins && shantytown.social_origins.length > 0) {
        shantytown.social_origins.forEach(label => {
            cy.get(
                `[data-cy-field="social_origins"][data-cy-label="${label}"]`
            ).myCheck();
        });
    }

    // electricity type
    if (shantytown.electricity_type) {
        cy.get(
            `[data-cy-field="electricity_type"][data-cy-label="${shantytown.electricity_type}"]`
        ).myCheck();
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
        ).myCheck();
    }

    // water_potable
    if (shantytown.water_potable) {
        cy.get(
            `[data-cy-field="water_potable"][data-cy-label="${shantytown.water_potable}"]`
        ).myCheck();
    }

    // water_continuous_access
    if (shantytown.water_continuous_access) {
        cy.get(
            `[data-cy-field="water_continuous_access"][data-cy-label="${shantytown.water_continuous_access}"]`
        ).myCheck();
    }

    // water_public_point
    if (shantytown.water_public_point) {
        cy.get(
            `[data-cy-field="water_public_point"][data-cy-label="${shantytown.water_public_point}"]`
        ).myCheck();
    }

    // water_distance
    if (shantytown.water_distance) {
        cy.get(
            `[data-cy-field="water_distance"][data-cy-label="${shantytown.water_distance}"]`
        ).myCheck();
    }

    // water_roads_to_cross
    if (shantytown.water_roads_to_cross) {
        cy.get(
            `[data-cy-field="water_roads_to_cross"][data-cy-label="${shantytown.water_roads_to_cross}"]`
        ).myCheck();
    }

    // water_everyone_has_access
    if (shantytown.water_everyone_has_access) {
        cy.get(
            `[data-cy-field="water_everyone_has_access"][data-cy-label="${shantytown.water_everyone_has_access}"]`
        ).myCheck();
    }

    // water_stagnant_water
    if (shantytown.water_stagnant_water) {
        cy.get(
            `[data-cy-field="water_stagnant_water"][data-cy-label="${shantytown.water_stagnant_water}"]`
        ).myCheck();
    }

    // water_hand_wash_access
    if (shantytown.water_hand_wash_access) {
        cy.get(
            `[data-cy-field="water_hand_wash_access"][data-cy-label="${shantytown.water_hand_wash_access}"]`
        ).myCheck();
    }

    // water_hand_wash_access_number
    if (
        shantytown.water_hand_wash_access &&
        shantytown.water_hand_wash_access_number
    ) {
        cy.get(`[data-cy-field="water_hand_wash_access_number"]`).type(
            shantytown.water_hand_wash_access_number
        );
    }

    // access to sanitary
    if (shantytown.access_to_sanitary) {
        cy.get(
            `[data-cy-field="access_to_sanitary"][data-cy-label="${shantytown.access_to_sanitary}"]`
        ).myCheck();
    }

    // sanitary_number
    if (shantytown.sanitary_number) {
        cy.get(`[data-cy-field="sanitary_number"]`).type(
            shantytown.sanitary_number
        );
    }

    // sanitary_insalubrious
    if (shantytown.sanitary_insalubrious) {
        cy.get(
            `[data-cy-field="sanitary_insalubrious"][data-cy-label="${shantytown.sanitary_insalubrious}"]`
        ).myCheck();
    }

    // sanitary_on_site
    if (shantytown.sanitary_on_site) {
        cy.get(
            `[data-cy-field="sanitary_on_site"][data-cy-label="${shantytown.sanitary_on_site}"]`
        ).myCheck();
    }

    // trash evacuation
    if (shantytown.trash_evacuation) {
        cy.get(
            `[data-cy-field="trash_evacuation"][data-cy-label="${shantytown.trash_evacuation}"]`
        ).myCheck();
    }

    // trash_cans_on_site
    if (shantytown.trash_cans_on_site) {
        cy.get(`[data-cy-field="trash_cans_on_site"]`).type(
            shantytown.trash_cans_on_site
        );
    }

    // trash_accumulation
    if (shantytown.trash_accumulation) {
        cy.get(
            `[data-cy-field="trash_accumulation"][data-cy-label="${shantytown.trash_accumulation}"]`
        ).myCheck();
    }

    // trash_evacuation_regular
    if (shantytown.trash_evacuation_regular) {
        cy.get(
            `[data-cy-field="trash_evacuation_regular"][data-cy-label="${shantytown.trash_evacuation_regular}"]`
        ).myCheck();
    }

    // vermin
    if (shantytown.vermin) {
        cy.get(
            `[data-cy-field="vermin"][data-cy-label="${shantytown.vermin}"]`
        ).myCheck();
    }

    // vermin_comments
    if (shantytown.vermin_comments) {
        cy.get('[data-cy-field="vermin_comments"]').type(
            shantytown.vermin_comments
        );
    }

    // fire_prevention_measures
    if (shantytown.fire_prevention_measures) {
        cy.get(
            `[data-cy-field="fire_prevention_measures"][data-cy-label="${shantytown.fire_prevention_measures}"]`
        ).myCheck();
    }

    // fire_prevention_diagnostic
    if (shantytown.fire_prevention_diagnostic) {
        cy.get(
            `[data-cy-field="fire_prevention_diagnostic"][data-cy-label="${shantytown.fire_prevention_diagnostic}"]`
        ).myCheck();
    }

    // fire_prevention_site_accessible
    if (shantytown.fire_prevention_site_accessible) {
        cy.get(
            `[data-cy-field="fire_prevention_site_accessible"][data-cy-label="${shantytown.fire_prevention_site_accessible}"]`
        ).myCheck();
    }

    // fire_prevention_devices
    if (shantytown.fire_prevention_devices) {
        cy.get(
            `[data-cy-field="fire_prevention_devices"][data-cy-label="${shantytown.fire_prevention_devices}"]`
        ).myCheck();
    }

    // fire_prevention_comments
    if (shantytown.fire_prevention_comments) {
        cy.get(`[data-cy-field="fire_prevention_comments"]`).type(
            shantytown.fire_prevention_comments
        );
    }

    // water comments
    if (shantytown.water_comments) {
        cy.get('[data-cy-field="water_comments"]').type(
            shantytown.water_comments
        );
    }

    // sanitary comments
    if (shantytown.sanitary_comments) {
        cy.get('[data-cy-field="sanitary_comments"]').type(
            shantytown.sanitary_comments
        );
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
