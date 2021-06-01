/**
 * This command takes a datepicker in input and empties it
 *
 * @param {HTMLElement} subject The datepicker wrapper
 *
 * @returns {undefined}
 */
Cypress.Commands.add("emptyDate", { prevSubject: true }, subject => {
    const clearer = cy.wrap(subject).siblings("[data-cy-button='clear']");
    if (clearer) {
        clearer.click();
    }
});
