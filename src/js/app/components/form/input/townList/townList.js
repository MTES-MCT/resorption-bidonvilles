import { get as getConfig, getPermission } from "#helpers/api/config";
import { all as fetchAll } from "#helpers/api/town";
import Table from "#app/components/table/table.vue";
import CollectivityInput from "#app/components/form/input/collectivity/collectivity.vue";

export default {
    components: {
        Table,
        CollectivityInput
    },

    props: {
        /**
         * @type {Array.<Number>}
         */
        value: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },

        /**
         * Whether the input should be disabled or not
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },

        /**
         * A function that takes a town as input, and returns a boolean
         *
         * @type {Function}
         */
        filter: {
            type: Function,
            required: false,
            default: null
        }
    },

    data() {
        const { field_types: fieldTypes, user } = getConfig();
        const permission = getPermission("shantytown.list");

        const userLocation = {
            id:
                user.organization.location.type === "nation"
                    ? null
                    : user.organization.location[
                          user.organization.location.type
                      ].code,
            label:
                user.organization.location.type === "nation"
                    ? "France"
                    : user.organization.location[
                          user.organization.location.type
                      ].name,
            category: user.organization.location.type,
            data: {
                code:
                    user.organization.location.type === "nation"
                        ? null
                        : user.organization.location[
                              user.organization.location.type
                          ].code,
                type: user.organization.location.type
            }
        };
        const hasNationalPermission = permission.geographic_level === "nation";

        let location;
        let defaultLocation;
        if (
            hasNationalPermission !== true ||
            user.organization.location.type === "nation"
        ) {
            defaultLocation = { ...userLocation };
            location = null;
        } else {
            defaultLocation = {
                id: null,
                label: "France",
                category: "Pays",
                data: {
                    code: null,
                    type: "nation"
                }
            };
            location = { ...userLocation };
        }

        return {
            location,
            defaultLocation,

            columns: [
                { id: "checkbox", label: "" },
                { id: "city", label: "Commune" },
                { id: "address", label: "Adresse" },
                { id: "fieldType", label: "Type de site" },
                { id: "people", label: "Nombre de personnes" }
            ],

            fieldTypes: fieldTypes.reduce(
                (acc, fieldType) => ({ ...acc, [fieldType.id]: fieldType }),
                {}
            ),

            /**
             * Data loading status
             *
             * @type {String|null} Either 'loading', 'loaded', 'error'
             */
            status: null,

            /**
             * Data loading error message
             *
             * @type {String|null}
             */
            loadingError: null,

            /**
             * List of towns
             *
             * @type {Array.<Object>}
             */
            towns: [],

            /**
             * Ids of selected towns
             *
             * @type {Array.<Number>}
             */
            selectedTowns: this.value,

            /**
             * Status of visible towns
             *
             * @type {'open'|'closed'}
             */
            statusOfVisibleTowns: "open"
        };
    },

    computed: {
        currentLocation() {
            return this.location || this.defaultLocation;
        },

        pageContent() {
            return this.towns
                .filter(({ closedAt }) => {
                    if (this.statusOfVisibleTowns === "open") {
                        return closedAt === null;
                    }
                    return closedAt !== null;
                })
                .filter(shantytown => {
                    if (this.currentLocation.data.type === "nation") {
                        return true;
                    }

                    const l = shantytown[this.currentLocation.data.type];
                    return (
                        l && `${l.code}` === `${this.currentLocation.data.code}`
                    );
                });
        }
    },

    watch: {
        // two-way binding
        value() {
            this.selectedTowns = this.value;
        },

        selectedTowns() {
            this.$emit("input", this.selectedTowns);
        }
    },

    mounted() {
        // on mount, try to load the list of shantytowns
        this.load();
    },

    methods: {
        /**
         * Loads shantytowns
         *
         * @returns {undefined}
         */
        load() {
            if (this.status === "loaded" || this.status === "loading") {
                return;
            }

            this.status = "loading";
            this.loadingError = null;

            fetchAll({}, ["city.asc", "population.desc"])
                .then(data => {
                    this.status = "loaded";
                    this.towns = data;
                })
                .catch(({ user_message: error }) => {
                    this.status = "error";
                    this.loadingError = error;
                });
        },

        /**
         * Changes which towns are displayed in the list
         *
         * @param {'open'|'closed'} status
         *
         * @returns {undefined}
         */
        showTowns(status) {
            this.statusOfVisibleTowns = status;
        },

        /**
         * Adds/removes a town from the list of selected towns
         *
         * @param {Shantytown} town
         *
         * @returns {undefined}
         */
        toggleTown({ id: townId }, event) {
            if (event && event.target && event.target.type === "checkbox") {
                return;
            }

            if (this.disabled) {
                return;
            }

            const index = this.selectedTowns.findIndex(id => id === townId);
            if (index !== -1) {
                this.selectedTowns.splice(index, 1);
            } else {
                this.selectedTowns.push(townId);
            }
        }
    }
};
