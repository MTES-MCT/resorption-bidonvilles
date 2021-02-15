/**
 * This command takes an adresse autocompleter in input and empties it
 *
 * @param {HTMLElement} subject The autocompleter wrapper
 *
 * @returns {undefined}
 */
Cypress.Commands.add(
    "emptyAdressAutocompleter",
    { prevSubject: true },
    subject => {
        const clearer = cy.wrap(subject).find("[data-cy-button='clear']");
        if (clearer) {
            clearer.click();
        }
    }
);
