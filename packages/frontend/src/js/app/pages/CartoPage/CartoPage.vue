<template>
    <PrivateLayout>
        <div v-if="loading">
            <FullBottomSection
                :centered="true"
                class="text-primary text-display-lg"
            >
                <template>
                    <Spinner />
                </template>
            </FullBottomSection>
        </div>

        <div v-else>
            <TownView
                :town="quickview.town"
                :origin="quickview.originEvent"
                @outside-click="hideQuickview"
            >
            </TownView>
            <POIView
                :poi="poiview.poi"
                :origin="poiview.originEvent"
                @outside-click="hidePOIView"
            >
            </POIView>
            <div class="dashboard">
                <simplebar
                    class="filters"
                    ref="filters"
                    data-simplebar-auto-hide="false"
                >
                    <FilterCard
                        v-for="filterGroup in allowedFilters"
                        :id="filterGroup.id"
                        :key="filterGroup.id"
                        :filter="filterGroup"
                    >
                    </FilterCard>
                </simplebar>

                <div
                    v-bind:style="{ width: !loading && !error ? 'auto' : 0 }"
                    class="content"
                    ref="main"
                >
                    <Map
                        v-bind="rendererProps"
                        @town-click="showQuickview"
                        @poi-click="showPOIView"
                        @on-row-click="routeToTown"
                        ref="map"
                    >
                    </Map>
                </div>
            </div>
        </div>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import FilterCard from "./FilterCard.vue";
import simplebar from "simplebar-vue";
import Map from "#app/components/map/map.vue";
import TownView from "./TownView/TownView.vue";
import POIView from "./POIView.vue";
import "#app/components/map/map.scss"; // on importe le scss ici pour que le html généré par le js y ait accès

import { mapGetters } from "vuex";
import { all as fetchAllPois } from "#helpers/api/poi";
import { get as getConfig, getPermission } from "#helpers/api/config";
import { open } from "#helpers/tabHelper";

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
        PrivateLayout,
        FilterCard,
        Map,
        TownView,
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
                    id: "waterAccessConditions",
                    options: [
                        {
                            value: "true",
                            label: "Oui",
                            checked: true,
                            icon: { id: "tint", color: "00a0e3" }
                        },
                        {
                            value: "toImprove",
                            label: "A améliorer",
                            checked: true,
                            icon: { id: "tint", color: "ff6f4c" }
                        },
                        {
                            value: "false",
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
                    faIcon: "home",
                    label: "Types de site",
                    id: "fieldType",
                    options: [],
                    opened: true
                },
                {
                    faIcon: "users",
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
                    faIcon: "ban",
                    label: "Statut des sites",
                    id: "status",
                    options: [
                        { value: "closed", label: "Fermés", checked: false },
                        { value: "opened", label: "Existants", checked: true }
                    ]
                },
                {
                    faIcon: "users",
                    label: "Type de propriétaire",
                    id: "ownerType",
                    options: getConfig().owner_types.map(type => ({
                        value: type.id,
                        label: type.label,
                        checked: true
                    }))
                },
                {
                    faIcon: "map-marker-alt",
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
                    case "waterAccessConditions":
                        {
                            const allowed = filterGroup.options
                                .filter(option => option.checked)
                                .map(option => option.value);
                            visibleTowns = visibleTowns.filter(
                                town =>
                                    allowed.indexOf(
                                        town.waterAccessConditions
                                    ) !== -1
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
        onLocationChange() {
            return;
        },
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
            var space =
                window.innerHeight -
                this.absoluteOffsetTop(element) -
                element.offsetHeight;
            const height = element.offsetHeight;
            const newHeight = height + space;

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
                    ? this.$store.dispatch("fetchTowns")
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
                            checked: true,
                            icon: {
                                id: "square",
                                color: fieldType.color.slice(1)
                            }
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
</script>
