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

Cypress.Commands.add('pickOption', { prevSubject: true }, (subject, label) => {
    const wrappedSubject = cy.wrap(subject);
    wrappedSubject.find('label').contains(label).find('input').click();
    return wrappedSubject;
});

const MONTHS = {
    Janvier: 0,
    Février: 1,
    Mars: 2,
    Avril: 3,
    Mai: 4,
    Juin: 5,
    Juillet: 6,
    Août: 7,
    Septembre: 8,
    Octobre: 9,
    Novembre: 10,
    Décembre: 11,
};
Cypress.Commands.add('chooseDate', { prevSubject: true }, (subject, date) => {
    subject.find('input').click();

    // extract month and year
    const [initialMonthStr, initialYearStr] = subject.find('.day__month_btn')[0].textContent.split(' ');
    const initial = {
        month: MONTHS[initialMonthStr],
        year: parseInt(initialYearStr, 10),
    };

    const [day, month, year] = date.split('/');
    const target = {
        day: parseInt(day, 10),
        month: parseInt(month, 10) - 1,
        year: parseInt(year, 10),
    };

    // select the proper year
    if (initial.year !== target.year) {
        subject.find('.day__month_btn').click();

        if (initial.year > target.year) {
            for (let i = 0; i < initial.year - target.year; i += 1) {
                subject.find('.month__year_btn').siblings('.prev').click();
            }
        } else {
            for (let i = 0; i < target.year - initial.year; i += 1) {
                subject.find('.month__year_btn').siblings('.next').click();
            }
        }

        cy.wait(100);
    }

    // select the proper month
    if (initial.year !== target.year || initial.month !== target.month) {
        if (initial.year === target.year) {
            subject.find('.day__month_btn').click();
            cy.wait(1000);
        }

        cy.wrap(subject).find('.cell.month').contains(Object.keys(MONTHS)[target.month]).click({
            force: true,
        });
    }

    // select the proper day
    cy.wrap(subject).find('.cell.day').contains(new RegExp(`^${target.day}$`, 'g')).click({
        force: true,
    });
});
