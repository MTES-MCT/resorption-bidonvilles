/**
 * This command replaces the content of a text input (if needed)
 *
 * @param {HTMLElement} subject The input
 * @param {String}      str     New value of the input
 *
 * @returns {undefined}
 */
Cypress.Commands.add("typeReplace", { prevSubject: true }, (subject, str) => {
    if (subject.value === str) {
        return;
    }

    cy.wrap(subject)
        .clear()
        .type(str);
});
