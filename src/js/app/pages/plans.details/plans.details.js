import Datepicker from 'vuejs-datepicker';
import { fr as datepickerFr } from 'vuejs-datepicker/dist/locale';
import NavBar from '#app/layouts/navbar/navbar.vue';
import SlideNote from '#app/components/slide-note/slide-note.vue';
import Map from '#app/pages/townExplorer/map/map.vue';
import { get, update, destroy } from '#helpers/api/plan';
import { hasPermission, get as getConfig } from '#helpers/api/config';
import { shortAddress } from '#helpers/townHelper';
import { notify } from '#helpers/notificationHelper';

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
        SlideNote,
        Map,
    },

    data() {
        return {
            /**
             * List of funding-types
             *
             * @type {Array.<FinanceType>}
             */
            financeTypes: (getConfig().finance_types || []).reduce((acc, type) => Object.assign({}, acc, {
                [type.uid]: type.name,
            }), {}),
            status: null,
            error: null,
            plan: null,
            mode: 'read',
            currentTab: 'main',
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
            form: {
                error: null,
                pending: false,
                data: {},
            },
            etpTypes: [
                {
                    id: 'social',
                    label: 'Travailleur social',
                },
                {
                    id: 'cip',
                    label: 'CIP (Conseiller d\'insertion Pro.)',
                },
                {
                    id: 'service',
                    label: 'Service civique',
                },
                {
                    id: 'caretaking',
                    label: 'Entretien / gardiennage',
                },
                {
                    id: 'manager',
                    label: 'Coordinateur ou chef de service',
                },
                {
                    id: 'interpreter',
                    label: 'Interprète',
                },
                {
                    id: 'volunteer',
                    label: 'Bénévole',
                },
            ],
            frequencies: {
                every_day: 'Tous les jours',
                several_times_a_week: 'Plusieurs fois par semaine',
                every_week: 'Toutes les semaines',
                less_than_once_a_week: 'Moins d\'une fois par semaine',
            },
        };
    },

    created() {
        this.load();
    },

    computed: {
        availableEtpTypes() {
            return this.etpTypes.filter(({ id }) => this.plan.team.some(({ etp }) => etp.find(({ type }) => id === type) !== undefined));
        },
        address() {
            if (!this.plan.location) {
                return null;
            }

            return {
                latitude: this.plan.location.latitude,
                longitude: this.plan.location.longitude,
                address: this.plan.location.label,
            };
        },
        center() {
            if (!this.plan.location) {
                return null;
            }

            return {
                center: [this.plan.location.latitude, this.plan.location.longitude],
                zoom: 15,
            };
        },
        dateProps() {
            return {
                language: datepickerFr,
                mondayFirst: true,
                fullMonthName: true,
                format: 'dd MMMM yyyy',
                calendarButton: true,
                calendarButtonIconContent: '',
                clearButton: true,
            };
        },
        customFields() {
            if (!this.plan) {
                return [];
            }

            if (this.currentTab === 'main') {
                return [];
            }

            const fields = fieldsByType[this.plan.type.label];
            let obj;
            if (this.currentTab === 'details') {
                obj = this.plan.details;
            } else {
                obj = this.plan.towns.find(({ detailId }) => detailId === this.currentTab);
            }

            return fields.map(field => ({
                id: field,
                label: this.fieldsLabel[field],
                value: obj[this.toCamelCase(field)],
            }));
        },
        details() {
            if (!this.plan) {
                return [];
            }

            if (this.plan.targetedOnTowns === true) {
                return this.plan.towns.map(town => ({
                    id: town.detailId,
                    label: shortAddress(town),
                }));
            }

            return [
                {
                    id: 'details',
                    label: 'Suivi du dispositif',
                },
            ];
        },
    },

    methods: {
        hasPermission,
        fundingTotal() {
            return this.plan.fundings[0].lines.reduce((total, { amount }) => total + parseFloat(amount), 0);
        },
        load() {
            if (['loading', 'loaded'].indexOf(this.status) !== -1) {
                return;
            }

            this.status = 'loading';
            this.error = null;

            get(this.$route.params.id)
                .then((data) => {
                    this.plan = data;
                    this.status = 'loaded';
                })
                .catch(({ user_message: message }) => {
                    this.error = message;
                    this.status = 'loadingError';
                });
        },
        numericValue(str) {
            if (str === null || str === undefined) {
                return 'Inconnu';
            }

            const int = parseInt(str, 10);
            if (Number.isNaN(int)) {
                return 'Inconnu';
            }

            return int;
        },
        escapeHtml(...args) {
            return App.escapeHtml(...args);
        },
        dateDiff(...args) {
            return App.dateDiff(...args);
        },
        formatDate(...args) {
            return App.formatDate(...args);
        },
        fromCamelCase(str) {
            const atoms = str.split(/[A-Z]/g);
            const camels = str.match(/[A-Z]/g);

            let newStr = atoms[0];
            for (let i = 0; i < camels.length; i += 1) {
                newStr += `_${camels[i].toLowerCase()}${atoms[i + 1]}`;
            }

            return newStr;
        },
        toCamelCase(str) {
            const atoms = str.split('_');

            let newStr = atoms[0];
            for (let i = 1; i < atoms.length; i += 1) {
                newStr += atoms[i].slice(0, 1).toUpperCase() + atoms[i].slice(1);
            }

            return newStr;
        },
        showTab(id) {
            this.currentTab = id;
        },
        setMode(mode) {
            if (mode === 'edit' && this.currentTab === 'main') {
                return;
            }

            if (mode === 'edit') {
                this.form.data = this.customFields.reduce((acc, field) => Object.assign({}, acc, {
                    [field.id]: field.value,
                }), {});
            }

            this.mode = mode;
        },
        destroy() {
            // eslint-disable-next-line
            const confirmed = confirm('Êtes-vous sûr ? Cette suppression est irréversible');

            if (confirmed === true) {
                destroy(this.$route.params.id)
                    .then(() => {
                        this.$router.push('/liste-des-dispositifs');
                    })
                    .catch((error) => {
                        // eslint-disable-next-line
                        alert(error.user_message);
                    });
            }
        },
        submit() {
            if (this.currentTab === 'main') {
                return;
            }

            if (this.form.pending === true) {
                return;
            }

            this.form.pending = true;
            this.form.error = null;

            const camelData = {};
            Object.keys(this.form.data).forEach((key) => {
                camelData[this.toCamelCase(key)] = this.form.data[key];
            });

            update(
                this.currentTab === 'details' ? null : this.currentTab,
                camelData,
            )
                .then(() => {
                    notify({
                        group: 'notifications',
                        type: 'success',
                        title: 'Indicateurs correctement sauvegardés',
                        text: 'Le dispositif a bien été modifié',
                    });

                    this.form.pending = false;
                    this.form.error = null;
                    this.setMode('read');

                    this.status = null;
                    this.load();
                })
                .catch((response) => {
                    this.form.pending = false;
                    this.form.error = response.user_message;
                });
        },
    },
};
