// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

Cypress.Commands.add('signinAs', ({ email, password }) => {
    cy.visit('/#/connexion');
    cy.get('#input-email')
        .type(email);
    cy.get('#input-password')
        .type(password);
    cy.contains('Me connecter').click();
});
