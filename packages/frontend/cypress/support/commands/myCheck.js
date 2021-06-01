/**
 * This command takes a Radio or Checkbox in input and checks it
 *
 * @param {HTMLElement} subject The datepicker wrapper
 *
 * @returns {undefined}
 */
Cypress.Commands.add("myCheck", { prevSubject: true }, subject => {
    return cy
        .wrap(subject)
        .invoke("attr", "data-cy-checked")
        .then(checked => {
            if (checked !== "true") {
                cy.wrap(subject).click();
            }
        });
});
