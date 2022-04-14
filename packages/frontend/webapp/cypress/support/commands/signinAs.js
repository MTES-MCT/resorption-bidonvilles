/**
 * This command signs in to the app
 *
 * @param {String} email
 * @param {String} password
 *
 * @returns {undefined}
 */
Cypress.Commands.add("signinAs", ({ email, password }) => {
    cy.visit("/connexion");
    cy.get("[data-cy-field='email']").type(email);
    cy.get("[data-cy-field='password']").type(password);
    cy.contains("Me connecter").click();
});
