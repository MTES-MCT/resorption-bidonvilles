/**
 * This command takes a datepicker in input and empties it
 *
 * @param {HTMLElement} subject The datepicker wrapper
 *
 * @returns {undefined}
 */
Cypress.Commands.add("emptyDate", { prevSubject: true }, subject => {
    const clearer = cy.wrap(subject).get(".vdp-datepicker__clear-button");
    if (clearer) {
        clearer.click();
    }
});
