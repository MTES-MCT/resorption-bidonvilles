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
        const clearer = cy.wrap(subject).get(".autocompleter-clearIcon");
        if (clearer) {
            clearer.click();
        }
    }
);
