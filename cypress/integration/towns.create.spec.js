describe('Gestion des sites', () => {
    it('Je peux déclarer un site', () => {
        cy.fixture('users').then(({ admin }) => {
            cy.server();
            cy.route('/config').as('getConfig');
            cy.signinAs(admin);
            cy.wait('@getConfig').then(() => {
                /* **********************************************************************************
                 * Create the shantytown
                 ********************************************************************************* */

                // -- open the form
                cy.contains('Déclarer un site').click({ force: true });

                // -- fill in the form
                // adresse
                cy.get('#address input[type=text]').type('1 rue des acacias');
                cy.contains('1 Rue des Acacias 34090 Montpellier, 34, Hérault, Occitanie').click();

                // address details
                cy.get('#addressDetails input').type('accès');

                // priority
                cy.get('#priority input').eq(1).click();

                // built at
                cy.get('#builtAt input').click();
                cy.get('#builtAt .cell.day:not(.day-header):not(.blank)').first().click();

                // declared at
                cy.get('#declaredAt input').click();
                cy.get('#declaredAt .cell.day:not(.day-header):not(.blank)').eq(1).click();

                // field type
                cy.get('#fieldType input').eq(1).click();

                // owner type
                cy.get('#ownerType input').eq(1).click();

                // owner
                cy.get('#owner input').type('nom du propriétaire');

                // census status
                cy.get('#censusStatus input').eq(2).click();

                // census conducted at
                cy.get('#censusConductedAt input').click();
                cy.get('#censusConductedAt .cell.day:not(.day-header):not(.blank)').first().click();

                // census conducted by
                cy.get('#censusConductedBy input').type('nom d\'opérateur');

                // population total
                cy.get('#populationTotal input').type(30);

                // population couples
                cy.get('#populationCouples input').type(20);

                // population minors
                cy.get('#populationMinors input').type(5);

                // social origins
                cy.get('#socialOrigins input').eq(0).click();
                cy.get('#socialOrigins input').eq(2).click();

                // electricity type
                cy.get('#electricityType input').eq(1).click();

                // electricity comments
                cy.get('#electricityComments textarea').type('accès à l\'électricité\navec un saut de ligne');

                // access to water
                cy.get('#accessToWater input').eq(0).click();

                // water comments
                cy.get('#waterComments textarea').type('accès à l\'eau\navec un saut de ligne');

                // trash evacuation
                cy.get('#trashEvacuation input').eq(1).click();

                // owner complaint
                cy.get('#ownerComplaint input').eq(0).click();

                // justice procedure
                cy.get('#justiceProcedure input').eq(0).click();

                // justice rendered
                cy.get('#justiceRendered input').eq(0).click();

                // justice rendered by
                cy.get('#justiceRenderedBy input').type('TGI');

                // justice rendered at
                cy.get('#justiceRenderedAt input').click();
                cy.get('#justiceRenderedAt .cell.day:not(.day-header):not(.blank)').first().click();

                // justice challenged
                cy.get('#justiceChallenged input').eq(0).click();

                // police status
                cy.get('#policeStatus input').eq(2).click();

                // police requested at
                cy.get('#policeRequestedAt input').click();
                cy.get('#policeRequestedAt .cell.day:not(.day-header):not(.blank)').first().click();

                // police granted at
                cy.get('#policeGrantedAt input').click();
                cy.get('#policeGrantedAt .cell.day:not(.day-header):not(.blank)').eq(1).click();

                // bailiff
                cy.get('#bailiff input').type('huissier');

                // submit!
                cy.get('.form-stepButton').click();

                /* **********************************************************************************
                 * Ensure we are redirected to the newly created shantytown with all the proper data
                 ********************************************************************************* */
                function formGroup(index) {
                    return cy.get('.container .form__group').eq(index);
                }

                cy.get('.town-name h1').should('have.text', 'Site 1 Rue des Acacias existe');
                cy.get('.town-name h2').should('have.text', 'Montpellier');

                formGroup(0).contains('p', 'Niveau de priorité du site : 2');
                formGroup(0).contains('p', 'Date d\'installation du site : 01/09/2020');
                formGroup(0).contains('p', 'Date de signalement du site : 02/09/2020');

                formGroup(1).contains('p', 'Adresse : 1 Rue des Acacias 34090 Montpellier, 34, Hérault, Occitanie');
                // formGroup(1).contains('p', 'Informations d\'accès : accès');
                formGroup(1).contains('p', 'Type de site : Immeuble bâti');
                formGroup(1).contains('p', 'Type de propriétaire : Privé');
                formGroup(1).contains('p', 'Propriétaire : nom du propriétaire');

                formGroup(2).contains('p', 'Statut du diagnostic : Réalisé');
                formGroup(2).contains('p', 'Date du diagnostic : 01/09/2020');
                formGroup(2).contains('p', 'Opérateur en charge du diagnostic : nom d\'opérateur');
                formGroup(2).contains('p', 'Nombre de personnes : 30');
                formGroup(2).contains('p', 'Nombre de ménages : 20');
                formGroup(2).contains('p', 'Nombre de mineurs : 5');
                formGroup(2).contains('li', 'Ressortissants français');
                formGroup(2).contains('li', 'Ressortissants extracommunautaires');

                formGroup(3).contains('p', 'Accès à l\'électricité: Non');
                formGroup(3).contains('p', 'Modalités d\'accès à l\'électricité : accès à l\'électricité avec un saut de ligne');
                formGroup(3).contains('p', 'Accès à l\'eau : oui');
                formGroup(3).contains('p', 'Modalités d\'accès à l\'eau : accès à l\'eau avec un saut de ligne');
                formGroup(3).contains('p', 'Évacuation des déchets : non');

                formGroup(4).contains('p', 'Dépôt de plainte par le propriétaire : Oui');
                formGroup(4).contains('p', 'Existence d’une procédure judiciaire : Oui');
                formGroup(4).contains('p', 'Décision de justice rendue : Oui');
                formGroup(4).contains('p', 'Origine de la décision : TGI');
                formGroup(4).contains('p', 'Date de la décision : 01/09/2020');
                formGroup(4).contains('p', 'Contentieux relatif à la décision de justice : Oui');
                formGroup(4).contains('p', 'Concours de la force publique : Obtenu');
                formGroup(4).contains('p', 'Date de la demande du CFP : 01/09/2020');
                formGroup(4).contains('p', 'Date d\'octroi du CFP : 02/09/2020');
                formGroup(4).contains('p', 'Nom de l\'étude d\'huissiers : huissier');
            });
        });
    });
});
