import { all as fetchAll } from "#helpers/api/town";
import {
    get as getConfig,
    hasPermission,
    getPermission
} from "#helpers/api/config";
import { open } from "#helpers/tabHelper";
import NavBar from "#app/layouts/navbar/navbar.vue";
import CollectivityInput from "#app/components/form/input/collectivity/collectivity.vue";
import TableFilter from "#app/components/tableFilter/tableFilter.vue";
import Export from "#app/components/export/export.vue";

function getSince(ts) {
    const now = new Date();
    const then = new Date(ts * 1000);

    let months = 0;
    if (now.getFullYear() === then.getFullYear()) {
        months = Math.max(0, now.getMonth() - then.getMonth());
    } else if (now.getFullYear() > then.getFullYear()) {
        const diff = now.getFullYear() - then.getFullYear();
        months = (diff - 1) * 12 + (now.getMonth() + 12 - then.getMonth());
    }

    return {
        years: Math.floor(months / 12),
        months: months % 12
    };
}

const PER_PAGE = 10;

const statusDetails = {
    closed_by_justice: "Exécution d'une décision de justice",
    closed_by_admin: "Exécution d'une décision administrative",
    other: "Autre",
    unknown: "Raison inconnue"
};

export default {
    components: {
        NavBar,
        CollectivityInput,
        TableFilter,
        Export
    },

    data() {
        const {
            field_types: fieldTypes,
            closing_solutions: closingSolutions,
            user
        } = getConfig();
        const permission = getPermission("shantytown.list");

        const data = {
            /**
             * List of shantytowns
             *
             * @type {Array.<Shantytown>}
             */
            shantytowns: [],

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

            /**
             * Map of field-type ids and their associated color
             *
             * @type {Object.<Number,String>}
             */
            fieldTypeColors: fieldTypes.reduce(
                (acc, fieldType) =>
                    Object.assign(acc, {
                        [fieldType.id]: fieldType.color
                    }),
                {}
            ),

            /**
             * Map of closing-solution ids and their associated label
             *
             * @type {Object.<Number,String>}
             */
            closingSolutionNames: closingSolutions.reduce(
                (acc, closingSolution) =>
                    Object.assign(acc, {
                        [closingSolution.id]: closingSolution.label.split(
                            "("
                        )[0]
                    }),
                {}
            ),

            /**
             * Map of census status values and labels
             *
             * @type {Object.<String,String>}
             */
            censusStatuses: {
                none: "Non prévu",
                scheduled: "Prévu"
            },

            boolToLabel: {
                [null]: "inconnu",
                [true]: "oui",
                [false]: "non"
            },
            boolToCss: {
                [null]: "unknown",
                [true]: "yes",
                [false]: "no"
            },

            currentPage: 0,

            fieldFilterItems: fieldTypes.map(({ id, label, color }) => ({
                value: id,
                label,
                color,
                checked: false
            })),

            populationFilterItems: [
                { label: "Inconnu", value: null, checked: false },
                { label: "Moins de 10 personnes", value: "-9", checked: false },
                {
                    label: "Entre 10 et 99 personnes",
                    value: "10-99",
                    checked: false
                },
                {
                    label: "Plus de 100 personnes",
                    value: "100-",
                    checked: false
                }
            ],

            justiceFilterItems: [
                { label: "Inconnu", value: null, checked: false },
                { label: "Aucune", value: "none", checked: false },
                {
                    label: "Plainte déposée",
                    value: "ownerComplaint",
                    checked: false
                },
                {
                    label: "Procédure en cours",
                    value: "justiceProcedure",
                    checked: false
                },
                {
                    label: "Décision rendue",
                    value: "justiceRendered",
                    checked: false
                }
            ],

            statusFilterItems: [
                { label: "Raison inconnue", value: "unknown", checked: false },
                {
                    label: "Décision de justice",
                    value: "closed_by_justice",
                    checked: false
                },
                {
                    label: "Décision administrative",
                    value: "closed_by_admin",
                    checked: false
                },
                { label: "Autre", value: "other", checked: false }
            ],

            currentFilter: null,

            hasNationalPermission: permission.geographic_level === "nation",
            hasJusticePermission: permission.data_justice === true,

            showClosedTowns: false,

            locationTitle: null,
            defaultLocation: null,
            location: null,
            exportIsVisible: false
        };

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

        if (
            data.hasNationalPermission !== true ||
            user.organization.location.type === "nation"
        ) {
            data.defaultLocation = { ...userLocation };
            data.location = null;
        } else {
            data.defaultLocation = {
                id: null,
                label: "France",
                category: "Pays",
                data: {
                    code: null,
                    type: "nation"
                }
            };
            data.location = { ...userLocation };
        }

        if (data.defaultLocation.data.type === "nation") {
            data.locationTitle = "National";
        } else {
            data.locationTitle = data.defaultLocation.label;
        }

        return data;
    },

    computed: {
        pageTitle() {
            return this.showClosedTowns === true ? "fermés" : "existants";
        },
        currentLocation() {
            return this.location || this.defaultLocation;
        },
        populationTotal() {
            return this.dashboardShantytowns.reduce(
                (total, { populationTotal }) => total + (populationTotal || 0),
                0
            );
        },
        minorsTotal() {
            return this.dashboardShantytowns.reduce(
                (total, { populationMinors }) =>
                    total + (populationMinors || 0),
                0
            );
        },
        justiceTotal() {
            return this.dashboardShantytowns.filter(
                ({ justiceProcedure }) => justiceProcedure === true
            ).length;
        },
        lastUpdate() {
            return this.dashboardShantytowns.reduce(
                (mostRecentDate, { updatedAt }) => {
                    if (mostRecentDate === null) {
                        return updatedAt;
                    }

                    if (updatedAt !== null && updatedAt > mostRecentDate) {
                        return updatedAt;
                    }

                    return mostRecentDate;
                },
                null
            );
        },
        dashboardShantytowns() {
            return this.shantytowns
                .filter(shantytown => {
                    if (this.showClosedTowns) {
                        return shantytown.status !== "open";
                    }

                    return shantytown.status === "open";
                })
                .filter(shantytown => {
                    if (this.currentLocation.data.type === "nation") {
                        return true;
                    }

                    const l = shantytown[this.currentLocation.data.type];
                    if (!l) {
                        return true;
                    }

                    if (l.code === `${this.currentLocation.data.code}`) {
                        return true;
                    }

                    return l.main === `${this.currentLocation.data.code}`;
                });
        },
        filteredShantytowns() {
            const fieldFilters = this.fieldFilterItems
                .filter(({ checked }) => checked)
                .map(({ value }) => value);
            const populationFilters = this.populationFilterItems
                .filter(({ checked }) => checked)
                .map(({ value }) => value);
            const justiceFilters = this.justiceFilterItems
                .filter(({ checked }) => checked)
                .map(({ value }) => value);
            const statusFilters = this.statusFilterItems
                .filter(({ checked }) => checked)
                .map(({ value }) => value);

            if (
                fieldFilters.length +
                    populationFilters.length +
                    justiceFilters.length +
                    statusFilters.length ===
                0
            ) {
                return this.dashboardShantytowns;
            }

            return this.dashboardShantytowns.filter(shantytown => {
                if (
                    fieldFilters.length > 0 &&
                    !this.checkFieldType(shantytown, fieldFilters)
                ) {
                    return false;
                }

                if (
                    populationFilters.length > 0 &&
                    !this.checkPopulation(shantytown, populationFilters)
                ) {
                    return false;
                }

                if (
                    justiceFilters.length > 0 &&
                    !this.checkJustice(shantytown, justiceFilters)
                ) {
                    return false;
                }

                if (
                    statusFilters.length > 0 &&
                    !this.checkStatus(shantytown, statusFilters)
                ) {
                    return false;
                }

                return true;
            });
        },
        pageContent() {
            return this.filteredShantytowns.slice(
                this.currentPage * PER_PAGE,
                this.currentPage * PER_PAGE + PER_PAGE
            );
        },
        lastPage() {
            return Math.max(
                0,
                Math.ceil(this.filteredShantytowns.length / PER_PAGE) - 1
            );
        },
        pageBeginning() {
            return this.filteredShantytowns.length > 0
                ? this.currentPage * PER_PAGE + 1
                : 0;
        },
        pageEnd() {
            return Math.min(
                this.pageBeginning - 1 + PER_PAGE,
                this.filteredShantytowns.length
            );
        },
        checkedFieldFilterItems() {
            return this.fieldFilterItems.filter(({ checked }) => checked)
                .length;
        },
        checkedPopulationFilterItems() {
            return this.populationFilterItems.filter(({ checked }) => checked)
                .length;
        },
        checkedJusticeFilterItems() {
            return this.justiceFilterItems.filter(({ checked }) => checked)
                .length;
        },
        checkedStatusFilterItems() {
            return this.statusFilterItems.filter(({ checked }) => checked)
                .length;
        }
    },

    created() {
        this.load();
    },

    watch: {
        location() {
            this.currentPage = 0;
        },
        filteredShantytowns() {
            this.currentPage = 0;
        }
    },

    methods: {
        /**
         * Tries fetching the data from the API
         *
         * Please note that this cannot be done if the data has already been loaded
         * before.
         */
        load() {
            // loading data is forbidden if the component is already loading or loaded
            if ([null, "error"].indexOf(this.state) === -1) {
                return;
            }

            this.state = "loading";
            this.error = null;

            fetchAll()
                .then(shantytowns => {
                    this.shantytowns = shantytowns.map(this.enrichShantytown);
                    this.state = "loaded";
                })
                .catch(({ user_message: error }) => {
                    this.error = error;
                    this.state = "error";
                });
        },

        /**
         * Enriches the given town with computed properties
         *
         * @param {Shantytown} shantytowns
         *
         * @returns {EnrichedShantytown}
         */
        enrichShantytown(shantytown) {
            // electricity
            let electricityValue = true;
            if (shantytown.electricityType.label === "Inconnu") {
                electricityValue = null;
            } else if (shantytown.electricityType.label === "Non") {
                electricityValue = false;
            }

            // justice statuses
            const justiceStatuses = [];

            if (
                shantytown.justiceChallenged === true ||
                shantytown.justiceRendered === true
            ) {
                justiceStatuses.push({
                    label: "Décision rendue",
                    date: shantytown.justiceRenderedAt
                });

                if (shantytown.justiceChallenged === true) {
                    justiceStatuses.push({
                        label: "Contentieux"
                    });
                }
            } else if (shantytown.justiceProcedure === true) {
                justiceStatuses.push({
                    label: "Procédure en cours"
                });
            }

            if (shantytown.ownerComplaint === true) {
                justiceStatuses.push({
                    label: "Plainte déposée"
                });
            }

            switch (shantytown.policeStatus) {
                case "none":
                    justiceStatuses.push({
                        label: "Concours de la force publique non demandé"
                    });
                    break;

                case "requested":
                    justiceStatuses.push({
                        label: "Concours de la force publique demandé",
                        date: shantytown.policeRequestedAt
                    });
                    break;

                case "granted":
                    justiceStatuses.push({
                        label: "Concours de la force publique accordé",
                        date: shantytown.policeGrantedAt
                    });
                    break;

                default:
                case null:
                    justiceStatuses.push({
                        label: "Concours de la force publique : NC"
                    });
                    break;
            }

            // status
            let statusName;
            let statusDate;
            const statusSince = [];
            if (shantytown.status === "open") {
                if (shantytown.builtAt) {
                    statusName = "Existe";
                    statusDate = shantytown.builtAt;
                } else if (shantytown.declaredAt) {
                    statusName = "Signalé";
                    statusDate = shantytown.declaredAt;
                } else {
                    statusName = null;
                    statusDate = null;
                }
            } else {
                statusName = "Fermé";
                statusDate = shantytown.closedAt;
            }

            if (statusDate !== null) {
                const { years, months } = getSince(statusDate);
                if (years > 0) {
                    statusSince.push(`${years} an${years > 1 ? "s" : ""}`);
                }

                if (months > 0) {
                    statusSince.push(`${months} mois`);
                }
            }

            // closing solutions
            const totalSolutions = shantytown.closingSolutions.reduce(
                (total, solution) => {
                    if (!solution.householdsAffected) {
                        return total;
                    }

                    return (total || 0) + solution.householdsAffected;
                },
                null
            );

            // final object
            return {
                ...shantytown,
                statusName,
                statusDate,
                statusSince: statusSince.join(" "),
                statusDetails: statusDetails[shantytown.status],
                fieldType: {
                    ...shantytown.fieldType,
                    color: this.fieldTypeColors[shantytown.fieldType.id]
                },
                electricityType: {
                    ...shantytown.electricityType,
                    value: electricityValue
                },
                justiceStatuses,
                totalSolutions
            };
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
         * @see index.js
         */
        formatDate(...args) {
            return window.App.formatDate.apply(window, args);
        },

        /**
         *
         */
        previousPage() {
            this.currentPage = Math.max(0, this.currentPage - 1);
        },

        /**
         *
         */
        nextPage() {
            this.currentPage = Math.min(this.lastPage, this.currentPage + 1);
        },

        /**
         *
         */
        routeToTown(shantytown) {
            const routeData = this.$router.resolve(`/site/${shantytown.id}`);
            open(routeData.href);
        },

        /**
         *
         */
        toggleFilter(name) {
            if (this.currentFilter === name) {
                this.currentFilter = null;
            } else {
                this.currentFilter = name;
            }
        },

        /**
         *
         */
        hideFilter() {
            this.currentFilter = null;
        },

        /**
         *
         */
        checkFieldType(shantytown, filters) {
            return filters.indexOf(shantytown.fieldType.id) !== -1;
        },

        /**
         *
         */
        checkPopulation(shantytown, filters) {
            return filters.some(value => {
                if (value === null) {
                    return shantytown.populationTotal === null;
                }

                if (shantytown.populationTotal === null) {
                    return false;
                }

                const [min, max] = value.split("-");
                if (
                    min !== "" &&
                    parseInt(min, 10) > shantytown.populationTotal
                ) {
                    return false;
                }

                if (
                    max !== "" &&
                    parseInt(max, 10) < shantytown.populationTotal
                ) {
                    return false;
                }

                return true;
            });
        },

        /**
         *
         */
        checkJustice(shantytown, filters) {
            return filters.some(value => {
                if (value === "ownerComplaint") {
                    return shantytown.ownerComplaint === true;
                }

                if (shantytown.justiceRendered === true) {
                    return value === "justiceRendered";
                }

                if (shantytown.justiceProcedure === true) {
                    return value === "justiceProcedure";
                }

                return value === null;
            });
        },

        /**
         *
         */
        checkStatus(shantytown, filters) {
            return filters.indexOf(shantytown.status) !== -1;
        },

        showTowns(status) {
            if (this.showClosedTowns === (status === "closed")) {
                return;
            }

            this.showClosedTowns = status === "closed";
            this.currentPage = 0;
            this.cleanFilters();
        },

        cleanFilters() {
            const filters = [
                "fieldFilterItems",
                "populationFilterItems",
                "justiceFilterItems",
                "statusFilterItems"
            ];

            filters.forEach(filter => {
                for (let i = 0; i < this[filter].length; i += 1) {
                    this[filter][i].checked = false;
                }
            });
        },

        showExport() {
            setTimeout(() => {
                this.exportIsVisible = true;
            }, 100);
        },

        hideExport() {
            this.exportIsVisible = false;
        },

        hasPermission(...args) {
            return hasPermission(...args);
        }
    }
};
