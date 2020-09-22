describe('Gestion des sites', () => {
    it('Je peux déclarer un site', () => {
        cy.fixture('users').then(({ admin }) => {
            cy.server();
            cy.route('/config').as('getConfig');
            cy.signinAs(admin);
            cy.wait('@getConfig').then(() => {
                cy.fixture('shantytowns').then((shantytown) => {
                    /* **********************************************************************************
                    * Create the shantytown
                    ********************************************************************************* */

                    // -- open the form
                    cy.contains('Déclarer un site').click({ force: true });

                    // -- fill in the form
                    // adresse
                    cy.get('#address input[type=text]').type(shantytown.address_precomplete);
                    cy.contains(shantytown.address).click();

                    // // address details
                    cy.get('#addressDetails input').type(shantytown.address_details);

                    // priority
                    cy.get('#priority').pickOption(shantytown.priority);

                    // built at
                    cy.get('#builtAt .vdp-datepicker').chooseDate(shantytown.built_at);

                    // declared at
                    cy.get('#declaredAt .vdp-datepicker').chooseDate(shantytown.declared_at);

                    // field type
                    cy.get('#fieldType').pickOption(shantytown.field_type);

                    // owner type
                    cy.get('#ownerType').pickOption(shantytown.owner_type);

                    // owner
                    cy.get('#owner input').type(shantytown.owner);

                    // census status
                    cy.get('#censusStatus').pickOption(shantytown.census_status);

                    // census conducted at
                    cy.get('#censusConductedAt .vdp-datepicker').chooseDate(shantytown.census_conducted_at);

                    // census conducted by
                    cy.get('#censusConductedBy input').type(shantytown.census_conducted_by);

                    // population total
                    cy.get('#populationTotal input').type(shantytown.population_total);

                    // population couples
                    cy.get('#populationCouples input').type(shantytown.population_couples);

                    // population minors
                    cy.get('#populationMinors input').type(shantytown.population_minors);

                    // social origins
                    shantytown.social_origins.forEach((label) => {
                        cy.get('#socialOrigins').pickOption(label);
                    });

                    // electricity type
                    cy.get('#electricityType').pickOption(shantytown.electricity_type);

                    // electricity comments
                    cy.get('#electricityComments textarea').type(shantytown.electricity_comments);

                    // access to water
                    cy.get('#accessToWater').pickOption(shantytown.access_to_water);

                    // water comments
                    cy.get('#waterComments textarea').type(shantytown.water_comments);

                    // access to sanitary
                    cy.get('#accessToSanitary').pickOption(shantytown.access_to_sanitary);

                    // sanitary comments
                    cy.get('#sanitaryComments textarea').type(shantytown.sanitary_comments);

                    // trash evacuation
                    cy.get('#trashEvacuation').pickOption(shantytown.trash_evacuation);

                    // owner complaint
                    cy.get('#ownerComplaint').pickOption(shantytown.owner_complaint);

                    // justice procedure
                    cy.get('#justiceProcedure').pickOption(shantytown.justice_procedure);

                    // justice rendered
                    cy.get('#justiceRendered').pickOption(shantytown.justice_rendered);

                    // justice rendered by
                    cy.get('#justiceRenderedBy input').type(shantytown.justice_rendered_by);

                    // justice rendered at
                    cy.get('#justiceRenderedAt .vdp-datepicker').chooseDate(shantytown.justice_rendered_at);

                    // justice challenged
                    cy.get('#justiceChallenged').pickOption(shantytown.justice_challenged);

                    // police status
                    cy.get('#policeStatus').pickOption(shantytown.police_status);

                    // police requested at
                    cy.get('#policeRequestedAt .vdp-datepicker').chooseDate(shantytown.police_requested_at);

                    // police granted at
                    cy.get('#policeGrantedAt .vdp-datepicker').chooseDate(shantytown.police_granted_at);

                    // bailiff
                    cy.get('#bailiff input').type(shantytown.bailiff);

                    // // submit!
                    cy.get('.form-stepButton').click();

                    // /* **********************************************************************************
                    // * Ensure we are redirected to the newly created shantytown with all the proper data
                    // ********************************************************************************* */
                    function formGroup(index) {
                        return cy.get('.container .form__group').eq(index);
                    }

                    cy.get('.town-name h1').should('have.text', `Site ${shantytown.address_simple} existe`);
                    cy.get('.town-name h2').should('have.text', shantytown.city);

                    formGroup(0).contains('p', `Niveau de priorité du site : ${shantytown.priority}`);
                    formGroup(0).contains('p', `Date d'installation du site : ${shantytown.built_at}`);
                    formGroup(0).contains('p', `Date de signalement du site : ${shantytown.declared_at}`);

                    formGroup(1).contains('p', `Adresse : ${shantytown.address}`);
                    // formGroup(1).contains('p', `Informations d'accès : ${shantytown.address_details}`);
                    formGroup(1).contains('p', `Type de site : ${shantytown.field_type}`);
                    formGroup(1).contains('p', `Type de propriétaire : ${shantytown.owner_type}`);
                    formGroup(1).contains('p', `Propriétaire : ${shantytown.owner}`);

                    formGroup(2).contains('p', `Statut du diagnostic : ${shantytown.census_status}`);
                    formGroup(2).contains('p', `Date du diagnostic : ${shantytown.census_conducted_at}`);
                    formGroup(2).contains('p', `Opérateur en charge du diagnostic : ${shantytown.census_conducted_by}`);
                    formGroup(2).contains('p', `Nombre de personnes : ${shantytown.population_total}`);
                    formGroup(2).contains('p', `Nombre de ménages : ${shantytown.population_couples}`);
                    formGroup(2).contains('p', `Nombre de mineurs : ${shantytown.population_minors}`);

                    shantytown.social_origins.forEach((label) => {
                        formGroup(2).contains('li', label);
                    });

                    formGroup(3).contains('p', `Accès à l'électricité: ${shantytown.electricity_type}`);
                    formGroup(3).contains('p', `Modalités d'accès à l'électricité : ${shantytown.electricity_comments.replace('\n', ' ')}`);
                    formGroup(3).contains('p', `Accès à l'eau : ${shantytown.access_to_water}`);
                    formGroup(3).contains('p', `Modalités d'accès à l'eau : ${shantytown.water_comments.replace('\n', ' ')}`);
                    formGroup(3).contains('p', `Accès aux toilettes : ${shantytown.access_to_sanitary}`);
                    formGroup(3).contains('p', `Modalités d'accès aux toilettes : ${shantytown.sanitary_comments.replace('\n', ' ')}`);
                    formGroup(3).contains('p', `Évacuation des déchets : ${shantytown.trash_evacuation}`);

                    formGroup(4).contains('p', `Dépôt de plainte par le propriétaire : ${shantytown.owner_complaint}`);
                    formGroup(4).contains('p', `Existence d’une procédure judiciaire : ${shantytown.justice_procedure}`);
                    formGroup(4).contains('p', `Décision de justice rendue : ${shantytown.justice_rendered}`);
                    formGroup(4).contains('p', `Origine de la décision : ${shantytown.justice_rendered_by}`);
                    formGroup(4).contains('p', `Date de la décision : ${shantytown.justice_rendered_at}`);
                    formGroup(4).contains('p', `Contentieux relatif à la décision de justice : ${shantytown.justice_challenged}`);
                    formGroup(4).contains('p', `Concours de la force publique : ${shantytown.police_status}`);
                    formGroup(4).contains('p', `Date de la demande du CFP : ${shantytown.police_requested_at}`);
                    formGroup(4).contains('p', `Date d'octroi du CFP : ${shantytown.police_granted_at}`);
                    formGroup(4).contains('p', `Nom de l'étude d'huissiers : ${shantytown.bailiff}`);
                });
            });
        });
    });
});
