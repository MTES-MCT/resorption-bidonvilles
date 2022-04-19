/**
 * This command takes a datepicker in input and empties it
 *
 * @param {HTMLElement} subject The datepicker wrapper
 *
 * @returns {undefined}
 */
Cypress.Commands.add("emptyDate", { prevSubject: true }, subject => {
    return cy
        .wrap(subject)
        .find("input")
        .then(input => {
            if (input[0].value !== "") {
                cy.wrap(subject)
                    .siblings("[data-cy-button='clear']")
                    .click();
            }
        });
});
