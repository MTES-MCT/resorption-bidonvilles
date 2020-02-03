import Table from '#app/components/table/table.vue';
import { list } from '#helpers/api/plan';
import 'vue-good-table/dist/vue-good-table.css';
import NavBar from '#app/layouts/navbar/navbar.vue';
import CollectivityInput from '#app/components/form/input/collectivity/collectivity.vue';
import { open } from '#helpers/tabHelper';
import { get as getConfig, getPermission } from '#helpers/api/config';

export default {
    components: {
        NavBar,
        Table,
        CollectivityInput,
    },

    data() {
        const { user } = getConfig();
        const permission = getPermission('plan.list');
        const hasNationalPermission = permission.geographic_level === 'nation';
        const data = {
            locationTitle: null,
            defaultLocation: null,
            location: null,
        };

        const userLocation = {
            id: user.organization.location.type === 'nation' ? null : user.organization.location[user.organization.location.type].code,
            label: user.organization.location.type === 'nation' ? 'France' : user.organization.location[user.organization.location.type].name,
            category: user.organization.location.type,
            data: {
                code: user.organization.location.type === 'nation' ? null : user.organization.location[user.organization.location.type].code,
                type: user.organization.location.type,
            },
        };

        if (hasNationalPermission !== true || user.organization.location.type === 'nation') {
            data.defaultLocation = Object.assign({}, userLocation);
            data.location = null;
        } else {
            data.defaultLocation = {
                id: null,
                label: 'France',
                category: 'Pays',
                data: {
                    code: null,
                    type: 'nation',
                },
            };
            data.location = Object.assign({}, userLocation);
        }

        if (data.defaultLocation.data.type === 'nation') {
            data.locationTitle = 'National';
        } else {
            data.locationTitle = data.defaultLocation.label;
        }

        return Object.assign(data, {
            /**
             * List of plans
             *
             * @type {Array.<Plan>}
             */
            plans: [],

            /**
             * The error's user message
             *
             * Obivously, null if there is no error
             *
             * @type {string|null}
             */
            error: null,

            /**
             * The current state of the page
             *
             * One out of: 'loading', 'error', or 'loaded'
             *
             * @type {string|null}
             */
            state: null,
        });
    },

    computed: {
        currentLocation() {
            return this.location || this.defaultLocation;
        },
        columns() {
            return [
                { id: 'name', label: 'Nom du dispositif' },
                { id: 'departement', label: 'Dpt' },
                { id: 'location', label: 'Lieu' },
                { id: 'government', label: 'Service de l\'état' },
                { id: 'operator', label: 'Opérateur' },
            ];
        },
        pageContent() {
            return this.plans
                .filter((plan) => {
                    if (this.currentLocation.data.type === 'nation') {
                        return true;
                    }

                    const l = plan.government_contacts[0].organization.location[this.currentLocation.data.type];
                    return l && `${l.code}` === `${this.currentLocation.data.code}`;
                });
        },
    },

    created() {
        this.load();
    },

    methods: {
        dateDiff(...args) {
            return App.dateDiff(...args);
        },

        formatDate(...args) {
            return window.App.formatDate(...args);
        },

        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, 'error'].indexOf(this.state) === -1) {
                return;
            }

            this.state = 'loading';
            this.error = null;

            list()
                .then((plans) => {
                    this.plans = plans;
                    this.state = 'loaded';
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = 'error';
                });
        },

        /**
         * Alias to load(), for better readibility in the view
         *
         * @see load()
         */
        retryLoading() {
            this.load();
        },

        /**
         * Redirects to a plan's details page
         *
         * @param {Object}
         */
        routeToPlan({ id: planId }) {
            const routeData = this.$router.resolve(`/dispositif/${planId}`);
            open(routeData.href);
        },
    },
};
