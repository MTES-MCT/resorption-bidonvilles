/**
 * This command takes a location autocompleter input and selects the expected result
 *
 * Please note the input is emptied beforehand automatically, if necessary
 *
 * @param {HTMLElement} subject  The autocompleter input wrapper
 * @param {String}      category The category of the result (Département, Région, etc.)
 * @param {String}      name     The name of the result
 *
 * @returns {undefined}
 */
Cypress.Commands.add(
    "autocompleteLocation",
    { prevSubject: true },
    (subject, category, name) => {
        const clearer = cy.wrap(subject).get("[data-cy-button='clear']");
        if (clearer) {
            clearer.click();
        }

        const input = cy.wrap(subject.find("input"));
        input.should("have.value", "");
        input.type(name);

        cy.get(`[data-cy-value='${category} - ${name}']`)
            .should("exist")
            .click();
    }
);
