import NavBar from '#app/layouts/navbar/navbar.vue';
import PlanFunding from '#app/components/planFunding/planFunding.vue';
import Operator from '#app/components/operator/operator.vue';
import Datepicker from 'vuejs-datepicker';
import { fr } from 'vuejs-datepicker/dist/locale';
import { get as getConfig } from '#helpers/api/config';
import { create } from '#helpers/api/plan';

const fieldsByType = {
    'Espace temporaire d’insertion': [
        'households_affected', 'people_affected', 'children_schoolable', 'households_who_got_housing_with_help',
        'households_who_got_housing_without_help', 'households_who_were_hosted', 'children_schooled',
        'people_accessing_health', 'people_helped_for_employment', 'people_who_got_employment',
        'households_domiciled', 'people_included', 'people_successfully_helped', 'people_excluded',
        'people_who_resigned', 'average_duration',
    ],
    'Diagnostic social': [
        'households', 'people', 'european_people', 'french_people', 'non_european_people',
        'children_schoolable',
    ],
    'Accompagnement social global': [
        'households_affected', 'people_affected', 'children_schoolable', 'households_who_got_housing_with_help',
        'households_who_got_housing_without_help', 'households_who_were_hosted', 'children_schooled',
        'people_accessing_health', 'people_helped_for_employment', 'people_who_got_employment',
        'households_domiciled', 'people_included', 'people_successfully_helped', 'people_excluded',
        'people_who_resigned', 'average_duration',
    ],
    'Intervention sanitaire': [
        'households_affected', 'people_affected', 'people_asking_for_cmu', 'people_with_cmu',
    ],
    'Accompagnement scolaire': [
        'households_affected', 'people_affected', 'young_kids', 'other_kids', 'schooled_kids',
        'households_domiciled',
    ],
    'Protection de l’enfance': [
        'minors_with_admin_procedure', 'minors_with_justice_procedure',
    ],
    'Accompagnement emploi': [
        'households_affected', 'people_affected', 'people_pole_emploi', 'people_mission_locale',
        'people_with_bank_account', 'people_trainee',
    ],
};

export default {
    components: {
        Datepicker,
        NavBar,
        PlanFunding,
        Operator,
    },

    data() {
        return {
            /**
             * List of plan-types
             *
             * @type {Array.<PlanType>}
             */
            planTypes: getConfig().plan_types || [],

            /**
             * Language set for the datepicker
             *
             * @type {Object}
             */
            dateLanguage: fr,

            /**
             *
             */
            departements: getConfig().departements,

            form: {
                pending: false,
                mainError: null,
                errors: {},
                data: {
                    ngo: null,
                    planType: null,
                    startedAt: null,
                    funding: [],
                    departement: getConfig().user.departement,
                },
            },

            fieldsLabel: {
                households_affected: 'Nombre de ménages concernés',
                people_affected: 'Nombre de personnes concernées',
                children_schoolable: 'Nombre d\'enfants en âge d\'être scolarisés',
                households_who_got_housing_with_help: 'Nombre de ménages ayant accédé à un logement accompagné/adapté dans l\'année',
                households_who_got_housing_without_help: 'Nombre de ménages ayant accédé à un logement sans accompagnement dans l\'année (parc privé/logement social)',
                households_who_were_hosted: 'Nombre de ménages ayant été hébergés dans l\'année ( CHRS, CHU, ) hors mises à l\'abri',
                children_schooled: 'Nombre d\'enfants agés de 3 à 16 ans scolarisés (inscrits) ',
                people_accessing_health: 'Nombre de personnes bénéficiant d\'un accompagnement sanitaire dans l\'année',
                people_helped_for_employment: 'Nombre de personnes bénéficiant d\'un accompagnement vers l\'emploi dans l\'année (inscription à Pôle emploi ou dans une mission locale, formation, POEC...)',
                people_who_got_employment: 'Nombre d\'adultes accompagnés vers l\'emploi ayant accédé à l\'emploi dans l\'année  (CDD, CDI, interim, CUI, CDDI) ',
                households_domiciled: 'Nombre de ménages domiciliés dans l\'année',
                people_included: 'Nombre de personnes entrées dans le dispositif pendant l\'année',
                people_successfully_helped: 'nombre de sorties considérées comme positives (insertion, logement, autonomie)',
                people_excluded: 'Nombre de sorties sur exclusions',
                people_who_resigned: 'Nombre d\'abandons volontaires sans insertion',
                people_pole_emploi: 'Nombre de personnes inscrites à Pôle emploi dans l\'année',
                people_mission_locale: 'Nombre de personnes inscrites dans une Mission locale dans l\'année',
                people_with_bank_account: 'Nombre de personnes ayant ouvert un compte bancaire dans l\'année',
                people_trainee: 'Nombre de personnes stagiaires de la formation professionnelle dans l\'année',
                average_duration: 'Durée moyenne de présence dans le dispositif',
                households: 'Nombre de ménages identifiés',
                people: 'Nombre de personnes identifiées',
                european_people: 'dont nombre de personnes intraUE',
                french_people: 'dont nombre de personnes françaises',
                non_european_people: 'dont nombre de personnes extraUE',
                young_kids: 'Nombre d\'enfants 0-3 ans ',
                other_kids: 'Nombre d\'enfants 3-16 ans',
                schooled_kids: 'Nombre d\'enfants 3-16 ans scolarisés dans l\'année',
                people_asking_for_cmu: 'Nombre de personnes ayant déposé une demande CMU et/ou AME dans l\'année',
                people_with_cmu: 'Nombre de personnes ayant  une demande CMU et/ou AME ouverte dans l\'année',
                minors_with_admin_procedure: 'Nombre de mineurs concernés par une mesure de protection administrative',
                minors_with_justice_procedure: 'Nombre de mineurs concernés par une mesure de protection judiciaire',
            },
        };
    },

    computed: {
        /**
         * Parses the form data and returns it without unecessary values
         *
         * @returns {Object}
         */
        formData() {
            const data = Object.assign({}, this.form.data);
            data.ngo = (data.operator && data.operator.ngo_id) || null;

            return data;
        },

        /**
         * Returns the currently selected plan type, if any
         *
         * @returns {PlanType|null}
         */
        planType() {
            return this.getPlanType(this.form.data.planType);
        },

        /**
         *
         */
        customFields() {
            const planType = this.planTypes.find(type => type.id === this.form.data.planType);
            if (planType === undefined) {
                return [];
            }

            const customFields = fieldsByType[planType.label];
            Object.keys(this.fieldsLabel)
                .filter(label => customFields.indexOf(label) === -1)
                .forEach((label) => {
                    this.form.data[label] = undefined;
                });

            return customFields;
        },
    },

    methods: {
        /**
         * Finds a plan-type by id
         *
         * @param {number} id
         *
         * @returns {PlanType|null}
         */
        getPlanType(id) {
            return this.planTypes.find(({ id: planTypeId }) => planTypeId === id) || null;
        },

        /**
         * Submits the form
         */
        submit() {
            // avoid submitting the form twice
            if (this.form.pending === true) {
                return;
            }

            this.form.pending = true;
            this.form.errors = {};
            this.form.mainError = null;

            create(this.formData)
                .then(() => {
                    this.form.pending = false;

                    this.$notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Dispositif correctement déclaré',
                        text: 'Le dispositif a bien été ajouté en base de données',
                    });

                    this.$router.push('/liste-des-dispositifs');
                })
                .catch(({ user_message: userMessage, fields }) => {
                    this.form.mainError = userMessage;
                    this.form.errors = fields || {};
                    this.form.pending = false;
                });
        },
    },
};
