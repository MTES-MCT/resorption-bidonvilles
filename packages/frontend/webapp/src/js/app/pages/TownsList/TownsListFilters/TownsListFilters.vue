<template>
    <div>
        <div class="mb-2">Filtrer par</div>
        <div class="flex items-center flex-wrap">
            <CustomFilter
                v-for="filter in defaultFilters"
                :key="filter.id"
                :title="filter.label"
                class="mr-2 mb-2"
                :value="filters[filter.id]"
                @input="val => updateFilters(filter.id, val)"
                @checkedItem="trackFilter(filter.label, $event)"
                :options="filter.options"
            />

            <CustomFilter
                v-if="filters.status === 'open'"
                title="Conditions de vie"
                class="mr-2 mb-2"
                :value="filters.conditions"
                @input="val => updateFilters('conditions', val)"
                @checkedItem="trackFilter('Conditions de vie', $event)"
                :options="[
                    {
                        value: 'accessToWater',
                        label: 'eau'
                    },
                    {
                        value: 'accessToSanitary',
                        label: 'toilettes'
                    },
                    {
                        value: 'accessToElectricity',
                        label: 'électricité'
                    },
                    {
                        value: 'accessToTrash',
                        label: 'évac. des déchets'
                    },

                    {
                        value: 'vermin',
                        label: 'pres. de nuisibles'
                    },
                    {
                        value: 'firePreventionMeasures',
                        label: 'prev. incendie'
                    }
                ]"
            >
                <template v-slot:default="{ label }">
                    <div class="text-red flex items-center">
                        <div class="mr-2">
                            <Icon icon="times" />/<Icon
                                icon="question"
                                class="text-xs"
                            />
                        </div>
                        {{ label }}
                    </div>
                </template>
            </CustomFilter>
            <div
                class="flex items-center flex-wrap"
                v-if="displayOptionalFilters === true"
            >
                <CustomFilter
                    v-for="filter in optionalFilters"
                    :key="filter.id"
                    :title="filter.label"
                    class="mr-2 mb-2"
                    :value="filters[filter.id]"
                    @input="val => updateFilters(filter.id, val)"
                    @checkedItem="trackFilter(filter.label, $event)"
                    :options="filter.options"
                />
            </div>

            <p
                v-if="displayOptionalFilters === false"
                class="text-primary cursor-pointer"
                @click="showOptional"
            >
                Voir plus de filtres
            </p>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            displayOptionalFilters: false,
            defaultOpenTownsFilter: [
                {
                    label: "Nombre de personnes",
                    id: "population",
                    display: true,
                    options: [
                        { value: null, label: "Inconnu" },
                        { value: "-9", label: "Moins de 10 personnes" },
                        {
                            value: "10-99",
                            label: "Entre 10 et 99 personnes"
                        },
                        {
                            value: "100-",
                            label: "Plus de 100 personnes"
                        }
                    ]
                },
                {
                    label: "Type de sites",
                    id: "fieldType",
                    display: true,
                    options: [
                        { value: 3, label: "Terrain" },
                        { value: 2, label: "Immeuble bâti" },
                        { value: 1, label: "Inconnu" }
                    ]
                },
                {
                    label: "Origines",
                    id: "origin",
                    display: true,
                    options: [
                        {
                            value: 1,
                            label: "Français"
                        },
                        {
                            value: 2,
                            label: "Union européenne"
                        },
                        {
                            value: 3,
                            label: "Hors Union européenne"
                        },
                        {
                            value: null,
                            label: "Inconnu"
                        }
                    ]
                }
            ],
            optionalOpenTownFilters: [
                {
                    label: "Objectif résorption",
                    id: "target",
                    display: true,
                    options: [
                        { value: "yes", label: "Oui" },
                        { value: "no", label: "Non" }
                    ]
                },
                {
                    label: "Intervenants",
                    display: true,
                    id: "actors",
                    options: [
                        { value: "yes", label: "Oui" },
                        { value: "no", label: "Non" }
                    ]
                },
                {
                    label: "Procédure judiciaire",
                    id: "justice",
                    display: this.hasJusticePermission,
                    options: [
                        { value: null, label: "Inconnu" },
                        { value: "none", label: "Aucune" },
                        {
                            value: "ownerComplaint",
                            label: "Plainte déposée"
                        },
                        {
                            value: "justiceProcedure",
                            label: "Procédure en cours"
                        },
                        {
                            value: "justiceRendered",
                            label: "Décision rendue"
                        }
                    ]
                },
                {
                    label: "AlerteCanicule",
                    id: "heatwave",
                    display: true,
                    options: [
                        { value: "yes", label: "Oui" },
                        { value: "no", label: "Non" }
                    ]
                }
            ],
            defaultClosedTownsFilter: [
                {
                    label: "Résorbé / fermé",
                    id: "solvedOrClosed",
                    options: [
                        {
                            value: "closed",
                            label: "Fermé"
                        },
                        {
                            value: "solved",
                            label: "Résorbé"
                        }
                    ]
                }
            ],
            optionalClosedTownsFilter: [
                {
                    label: "Objectif résorption",
                    id: "target",
                    display: true,
                    options: [
                        { value: "yes", label: "Oui" },
                        { value: "no", label: "Non" }
                    ]
                },
                {
                    label: "Origines",
                    id: "origin",
                    display: true,
                    options: [
                        {
                            value: 1,
                            label: "Français"
                        },
                        {
                            value: 2,
                            label: "Union européenne"
                        },
                        {
                            value: 3,
                            label: "Hors Union européenne"
                        },
                        {
                            value: null,
                            label: "Inconnu"
                        }
                    ]
                },
                {
                    label: "Cause de la fermeture",
                    id: "closingReason",
                    display: true,
                    options: [
                        {
                            value: "closed_by_justice",
                            label: "Exécution d'une décision de justice"
                        },
                        {
                            value: "closed_by_admin",
                            label: "Exécution d'une décision administrative"
                        },
                        { value: "other", label: "Autre" },
                        { value: "unknown", label: "Raison inconnue" }
                    ]
                },
                {
                    label: "Procédure judiciaire",
                    id: "justice",
                    display: this.hasJusticePermission,
                    options: [
                        { value: null, label: "Inconnu" },
                        { value: "none", label: "Aucune" },
                        {
                            value: "ownerComplaint",
                            label: "Plainte déposée"
                        },
                        {
                            value: "justiceProcedure",
                            label: "Procédure en cours"
                        },
                        {
                            value: "justiceRendered",
                            label: "Décision rendue"
                        }
                    ]
                },
                {
                    label: "Type de sites",
                    id: "fieldType",
                    display: true,
                    options: [
                        { value: 3, label: "Terrain" },
                        { value: 2, label: "Immeuble bâti" },
                        { value: 1, label: "Inconnu" }
                    ]
                },
                {
                    label: "Nombre de personnes",
                    id: "population",
                    display: true,
                    options: [
                        { value: null, label: "Inconnu" },
                        { value: "-9", label: "Moins de 10 personnes" },
                        {
                            value: "10-99",
                            label: "Entre 10 et 99 personnes"
                        },
                        {
                            value: "100-",
                            label: "Plus de 100 personnes"
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            filters: "townsFilters"
        }),
        hasJusticePermission() {
            return (
                this.$store.getters["config/getPermission"](
                    "shantytown_justice.access"
                ) !== null
            );
        },
        defaultFilters() {
            return this.filters.status === "close"
                ? this.defaultClosedTownsFilter
                : this.defaultOpenTownsFilter;
        },
        optionalFilters() {
            return this.filters.status === "close"
                ? this.optionalClosedTownsFilter
                : this.optionalOpenTownFilters;
        }
    },
    methods: {
        showOptional() {
            this.displayOptionalFilters = true;
        },
        trackFilter(eventAction, { label: eventName }) {
            let eventCategory;
            let eventActionPrefix;

            if (this.filters.status === "close") {
                eventCategory = "Filtre des sites fermés";
                eventActionPrefix = "FDSF";
            } else {
                eventCategory = "Filtre des sites ouverts";
                eventActionPrefix = "FDSO";
            }

            this.$trackMatomoEvent(
                eventCategory,
                `${eventActionPrefix} — ${eventAction}`,
                eventName
            );
        },
        onChangePage(page) {
            this.$store.commit("setCurrentPage", page);
        },
        updateFilters(filter, val) {
            this.$store.commit("setFilters", {
                ...this.filters,
                [filter]: val
            });
            this.onChangePage(1);
        }
    }
};
</script>
