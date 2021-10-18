import "./commands/index";

Cypress.on("uncaught:exception", error => {
    // Vue router guardians throws an error
    if (
        error.message.includes("Redirected") ||
        error.message.includes("NavigationDuplicated")
    ) {
        // returning false here prevents Cypress from
        // failing the test
        return false;
    }
});
