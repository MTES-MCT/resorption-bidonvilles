import simplebar from "simplebar-vue";
import NavBar from "#app/layouts/navbar/navbar.vue";
import FilterGroup from "./filterGroup/filterGroup.vue";
import Map from "#app/components/map/map.vue";
import Quickview from "#app/components/quickview/quickview.vue";
import POIView from "./POIView.vue";
import store from "#app/store";
import { mapGetters } from "vuex";
import { all as fetchAllPois } from "#helpers/api/poi";
import { get as getConfig, getPermission } from "#helpers/api/config";
import { open } from "#helpers/tabHelper";

import iconType from "../../../../../public/img/type.svg";
import iconPeople from "../../../../../public/img/people.svg";
import iconStatus from "../../../../../public/img/status.svg";
import iconPin from "../../../../../public/img/pin.svg";

/**
 * Returns the appropriate zoom level for the given location type
 *
 * @param {String} locationType
 *
 * @returns {Number}
 */
function getDefaultZoomFor(locationType) {
    switch (locationType) {
        case "nation":
        case "region":
            return 6;

        default:
        case "departement":
        case "epci":
        case "city":
            return 10;
    }
}

export default {
    components: {
        NavBar,
        FilterGroup,
        Map,
        Quickview,
        POIView,
        simplebar
    },
    data() {
        const { user } = getConfig();

        return {
            error: undefined,
            loading: false,
            defaultMapView: {
                center: [
                    user.organization.location.latitude,
                    user.organization.location.longitude
                ],
                zoom: getDefaultZoomFor(user.organization.location.type)
            },
            pois: [],
            quickview: {
                town: null,
                originEvent: null
            },
            poiview: {
                poi: null,
                originEvent: null
            },
            permission: getPermission("shantytown.list"),
            filters: [
                {
                    faIcon: "tint",
                    label: "Accès à l'eau",
                    id: "accessToWater",
                    options: [
                        {
                            value: true,
                            label: "Oui",
                            checked: true,
                            icon: { id: "tint", color: "00a0e3" }
                        },
                        {
                            value: null,
                            label: "A améliorer",
                            checked: true,
                            icon: { id: "tint", color: "ff6f4c" }
                        },
                        {
                            value: false,
                            label: "Non",
                            checked: true,
                            icon: { id: "tint-slash", color: "ADB9C9" }
                        },
                        {
                            value: null,
                            label: "Inconnu",
                            checked: true,
                            icon: { id: "question", color: "ADB9C9" }
                        }
                    ],
                    opened: true
                },
                {
                    icon: iconType,
                    label: "Types de site",
                    id: "fieldType",
                    options: [],
                    opened: true
                },
                {
                    icon: iconPeople,
                    label: "Nombre de personnes",
                    id: "population",
                    options: [
                        { value: null, label: "Inconnu", checked: true },
                        {
                            value: "-9",
                            label: "Moins de 10 personnes",
                            checked: true
                        },
                        {
                            value: "10-99",
                            label: "Entre 10 et 99 personnes",
                            checked: true
                        },
                        {
                            value: "100-",
                            label: "100 personnes et plus",
                            checked: true
                        }
                    ]
                },
                {
                    icon: iconStatus,
                    label: "Statut des sites",
                    id: "status",
                    options: [
                        { value: "closed", label: "Disparus", checked: false },
                        { value: "opened", label: "Existants", checked: true }
                    ]
                },
                {
                    icon: iconPeople,
                    label: "Type de propriétaire",
                    id: "ownerType",
                    options: getConfig().owner_types.map(type => ({
                        value: type.id,
                        label: type.label,
                        checked: true
                    }))
                },
                {
                    icon: iconPin,
                    label: "Points d'intérêts",
                    id: "poi",
                    options: [
                        {
                            value: "food_bank",
                            label: "Distribution alimentaire",
                            checked: true
                        }
                    ],
                    opened: true
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            towns: "towns"
        }),
        allowedFilters() {
            if (!this.permission) {
                return [];
            }

            return this.filters.filter(
                filter =>
                    !filter.permissions ||
                    filter.permissions.every(
                        permission => this.permission[permission]
                    )
            );
        },
        rendererProps() {
            return {
                towns: this.visibleTowns,
                pois: this.visiblePOIs,
                defaultView: this.defaultMapView
            };
        },
        visiblePOIs() {
            let pois = this.pois;

            this.allowedFilters.forEach(filterGroup => {
                switch (filterGroup.id) {
                    case "poi":
                        {
                            pois = pois.filter(
                                () => filterGroup.options[0].checked
                            );
                        }
                        break;

                    default:
                }
            });

            return pois;
        },
        visibleTowns() {
            let visibleTowns = this.towns;

            this.allowedFilters.forEach(filterGroup => {
                switch (filterGroup.id) {
                    case "accessToWater":
                        {
                            const allowed = filterGroup.options
                                .filter(option => option.checked)
                                .map(option => option.value);

                            visibleTowns = visibleTowns.filter(
                                town =>
                                    allowed.indexOf(town.accessToWater) !== -1
                            );
                        }
                        break;

                    case "fieldType":
                        {
                            const allowedFieldTypes = filterGroup.options
                                .filter(option => option.checked)
                                .map(option => option.value);

                            visibleTowns = visibleTowns.filter(
                                town =>
                                    town.fieldType &&
                                    allowedFieldTypes.indexOf(
                                        town.fieldType.id
                                    ) !== -1
                            );
                        }
                        break;

                    case "population":
                        {
                            const disallowedPopulation = filterGroup.options
                                .filter(option => !option.checked)
                                .map(option => option.value);

                            disallowedPopulation.forEach(value => {
                                if (value === null) {
                                    visibleTowns = visibleTowns.filter(
                                        town => town.populationTotal !== null
                                    );
                                    return;
                                }

                                let [min, max] = value.split("-");
                                min = parseInt(min, 10);
                                max = parseInt(max, 10);

                                visibleTowns = visibleTowns.filter(town => {
                                    if (town.populationTotal === null) {
                                        return true;
                                    }

                                    if (
                                        !Number.isNaN(min) &&
                                        !Number.isNaN(max)
                                    ) {
                                        return (
                                            town.populationTotal < min ||
                                            town.populationTotal > max
                                        );
                                    }

                                    if (!Number.isNaN(min)) {
                                        return town.populationTotal < min;
                                    }

                                    if (!Number.isNaN(max)) {
                                        return town.populationTotal > max;
                                    }

                                    return true;
                                });
                            });
                        }
                        break;

                    case "status":
                        {
                            const disallowedStatuses = filterGroup.options
                                .filter(option => !option.checked)
                                .map(option => option.value);

                            disallowedStatuses.forEach(value => {
                                if (value === "closed") {
                                    visibleTowns = visibleTowns.filter(
                                        town => town.status === "open"
                                    );
                                } else if (value === "opened") {
                                    visibleTowns = visibleTowns.filter(
                                        town => town.status !== "open"
                                    );
                                }
                            });
                        }
                        break;

                    case "ownerType":
                        {
                            const allowedOwnerTypes = filterGroup.options
                                .filter(option => option.checked)
                                .map(option => option.value);

                            visibleTowns = visibleTowns.filter(
                                town =>
                                    town.ownerType &&
                                    allowedOwnerTypes.indexOf(
                                        town.ownerType.id
                                    ) !== -1
                            );
                        }
                        break;

                    default:
                }
            });

            return visibleTowns;
        }
    },
    created() {
        this.fetchData();
    },
    mounted() {
        window.addEventListener("resize", this.resize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resize);
    },
    methods: {
        sortNumber(x, y) {
            if (x === "inconnu" && y === "inconnu") {
                return 0;
            }

            if (x === "inconnu") {
                return -1;
            }

            if (y === "inconnu") {
                return 1;
            }

            if (x < y) {
                return -1;
            }

            if (x > y) {
                return 1;
            }

            return 0;
        },
        showQuickview(town, event) {
            this.quickview = {
                town,
                originEvent: event.originalEvent
            };
        },
        showPOIView(poi, event) {
            this.poiview = {
                poi,
                originEvent: event.originalEvent
            };
        },
        hideQuickview() {
            this.quickview = {
                town: null,
                originEvent: null
            };
        },
        hidePOIView() {
            this.poiview = {
                town: null,
                originEvent: null
            };
        },
        routeToTown(params) {
            const routeData = this.$router.resolve(`/site/${params.row.id}`);
            open(routeData.href);
        },
        resize() {
            if (!this.$refs.main) {
                return;
            }

            this.stretchToBottom(this.$refs.main);
            this.stretchToBottom(this.$refs.filters.$el);
        },
        stretchToBottom(element) {
            const height = element.offsetHeight;
            const newHeight =
                height +
                (document.body.offsetHeight -
                    (this.absoluteOffsetTop(element) + height));

            // eslint-disable-next-line
            element.style.height = `${newHeight}px`;
        },
        absoluteOffsetTop(element) {
            let top = 0;
            let el = element;

            do {
                top += el.offsetTop || 0;
                el = el.offsetParent;
            } while (el);

            return top;
        },
        fetchData() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = undefined;

            Promise.all([
                this.towns.length === 0
                    ? store.dispatch("fetchTowns")
                    : Promise.resolve(),
                fetchAllPois().catch(() => [])
            ])
                .then(([, pois]) => {
                    const { field_types: fieldTypes } = getConfig();

                    this.loading = false;

                    // build the field-type filter
                    const fieldTypeFilter = this.filters.filter(
                        ({ id }) => id === "fieldType"
                    )[0];
                    fieldTypeFilter.options = [
                        // options based on field-types returned by the api
                        ...fieldTypes.map(fieldType => ({
                            id: fieldType.id,
                            value: fieldType.id,
                            label: fieldType.label,
                            checked: true
                        }))
                    ];

                    this.pois = pois;
                    this.$nextTick(() => {
                        this.resize();
                        this.$refs.map.resize();
                    });
                })
                .catch(errors => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
        }
    }
};
