import NavBar from '#app/layouts/navbar/navbar.vue';
import PlanFunding from '#app/components/planFunding/planFunding.vue';
import Operator from '#app/components/operator/operator.vue';
import Datepicker from 'vuejs-datepicker';
import { fr } from 'vuejs-datepicker/dist/locale';
import { get as getConfig, hasPermission } from '#helpers/api/config';
import { create } from '#helpers/api/plan';
import { all as fetchAll } from '#helpers/api/town';
import { VueGoodTable } from 'vue-good-table';

export default {
    components: {
        Datepicker,
        NavBar,
        PlanFunding,
        Operator,
        VueGoodTable,
    },

    data() {
        return {
            /**
             *
             */
            status: null,

            /**
             *
             */
            error: null,

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

            /**
             *
             */
            towns: [],

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

            if (data.targetedOnTowns === true) {
                data.towns = this.$refs.towns.selectedRows.map(({ id }) => id);
            }

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
        filteredTowns() {
            return this.towns.filter(({ departement: { code } }) => code === this.form.data.departement);
        },

        /**
         *
         */
        tableProps() {
            const columns = [
                {
                    label: 'Commune',
                    field: 'city.name',
                },
                {
                    label: 'Adresse',
                    field: 'address',
                    permissions: [
                        { type: 'data', name: 'address' },
                    ],
                },
            ];

            return {
                styleClass: 'table',
                columns: columns.filter(column => !column.permissions || column.permissions.every(permission => hasPermission(permission))),
                rows: this.filteredTowns,
                'sort-options': {
                    enabled: true,
                },
                'pagination-options': {
                    enabled: true,
                    perPage: 10,
                    perPageDropdown: [5, 10, 20, 30, 40, 50],
                    nextLabel: 'Suivant',
                    prevLabel: 'Précédent',
                    rowsPerPageLabel: 'Nombre de sites par page',
                    ofLabel: 'sur',
                    pageLabel: 'Page', // for 'pages' mode
                    allLabel: 'Tous',
                },
                'select-options': {
                    enabled: true,
                    selectionText: 'sites sélectionnés',
                    clearSelectionText: 'annuler',
                },
            };
        },
    },

    created() {
        this.load();
    },

    methods: {
        /**
         *
         */
        load() {
            if (['loading', 'loaded'].indexOf(this.status) !== -1) {
                return;
            }

            this.status = 'loading';
            this.error = null;

            fetchAll({ status: 'open' })
                .then((data) => {
                    this.towns = data;
                    this.status = 'loaded';
                })
                .catch(({ user_message: message }) => {
                    this.error = message;
                    this.status = 'loadingError';
                });
        },

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
