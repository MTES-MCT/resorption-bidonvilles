<template>
    <div class="flex justify-between">
        <section class="flex items-end flex-wrap space-x-4">
            <article>
                <p>Filtrer par</p>
                <div class="flex space-x-2">
                    <Filter v-for="filter in defaultFilters" :key="filter.id" :title="filter.label"
                        :options="filter.options" v-model="townsStore.filters.properties[filter.id]"
                        @checkedItem="trackFilter(filter.label, $event)" />
                    <Filter v-if="townsStore.filters.status === 'open'" title="Conditions de vie"
                        v-model="townsStore.filters.properties.conditions"
                        @checkedItem="trackFilter('Conditions de vie', $event)" :options="[
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
                        ]">
                        <template v-slot:default="{ label }">
                            <div class="text-red flex items-center">
                                <div class="mr-2">
                                    <Icon icon="times" />/
                                    <Icon icon="question" class="text-xs" />
                                </div>
                                {{ label }}
                            </div>
                        </template>
                    </Filter>
                </div>
                <div class="mt-2 flex space-x-2" v-if="displayOptionalFilters === true">
                    <Filter v-for="filter in optionalFilters" :key="filter.id" :title="filter.label"
                        :options="filter.options" v-model="townsStore.filters.properties[filter.id]"
                        @checkedItem="trackFilter(filter.label, $event)" />
                </div>
            </article>
            <Link v-if="displayOptionalFilters === false" @click="showOptional">
            Voir plus de filtres
            </Link>
        </section>

        <section>
            <article>
                <p>Trier par</p>
            </article>
            <Sort v-model="townsStore.sort" :options="sortOptions[townsStore.filters.status]" />
        </section>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useTownsStore } from "@/stores/towns.store";
import { useUserStore } from "@/stores/user.store";
import { trackEvent } from "@/helpers/matomo";

import { Filter, Icon, Link, Sort } from "@resorptionbidonvilles/ui";

const townsStore = useTownsStore();
const userStore = useUserStore();
const displayOptionalFilters = ref(false);
const defaultOpenTownsFilter = ref([
    {
        label: "Nombre de personnes",
        id: "population",
        display: true,
        options: [
            { value: null, label: "Inconnu" },
            { value: "-9", label: "Moins de 10 personnes" },
            {
                value: "10-99",
                label: "Entre 10 et 99 personnes",
            },
            {
                value: "100-",
                label: "Plus de 100 personnes",
            },
        ],
    },
    {
        label: "Type de sites",
        id: "fieldType",
        display: true,
        options: [
            { value: 3, label: "Terrain" },
            { value: 2, label: "Immeuble bâti" },
            { value: 1, label: "Inconnu" },
        ],
    },
    {
        label: "Origines",
        id: "origin",
        display: true,
        options: [
            {
                value: 1,
                label: "Français",
            },
            {
                value: 2,
                label: "Union européenne",
            },
            {
                value: 3,
                label: "Hors Union européenne",
            },
            {
                value: null,
                label: "Inconnu",
            },
        ],
    },
]);
const optionalOpenTownFilters = ref([
    {
        label: "Objectif résorption",
        id: "target",
        display: true,
        options: [
            { value: "yes", label: "Oui" },
            { value: "no", label: "Non" },
        ],
    },
    {
        label: "Intervenants",
        display: true,
        id: "actors",
        options: [
            { value: "yes", label: "Oui" },
            { value: "no", label: "Non" },
        ],
    },
    {
        label: "Procédure judiciaire",
        id: "justice",
        display: userStore.user?.hasJusticePermission,
        options: [
            { value: null, label: "Inconnu" },
            { value: "none", label: "Aucune" },
            {
                value: "ownerComplaint",
                label: "Plainte déposée",
            },
            {
                value: "justiceProcedure",
                label: "Procédure en cours",
            },
            {
                value: "justiceRendered",
                label: "Décision rendue",
            },
        ],
    },
    {
        label: "Alerte Canicule",
        id: "heatwave",
        display: true,
        options: [
            { value: "yes", label: "Oui" },
            { value: "no", label: "Non" },
        ],
    },
]);
const defaultClosedTownsFilter = ref([
    {
        label: "Résorbé / fermé",
        id: "solvedOrClosed",
        options: [
            {
                value: "closed",
                label: "Fermé",
            },
            {
                value: "solved",
                label: "Résorbé",
            },
        ],
    },
]);
const optionalClosedTownsFilter = ref([
    {
        label: "Objectif résorption",
        id: "target",
        display: true,
        options: [
            { value: "yes", label: "Oui" },
            { value: "no", label: "Non" },
        ],
    },
    {
        label: "Origines",
        id: "origin",
        display: true,
        options: [
            {
                value: 1,
                label: "Français",
            },
            {
                value: 2,
                label: "Union européenne",
            },
            {
                value: 3,
                label: "Hors Union européenne",
            },
            {
                value: null,
                label: "Inconnu",
            },
        ],
    },
    {
        label: "Cause de la fermeture",
        id: "closingReason",
        display: true,
        options: [
            {
                value: "closed_by_justice",
                label: "Exécution d'une décision de justice",
            },
            {
                value: "closed_by_admin",
                label: "Exécution d'une décision administrative",
            },
            { value: "other", label: "Autre" },
            { value: "unknown", label: "Raison inconnue" },
        ],
    },
    {
        label: "Procédure judiciaire",
        id: "justice",
        display: userStore.user?.hasJusticePermission,
        options: [
            { value: null, label: "Inconnu" },
            { value: "none", label: "Aucune" },
            {
                value: "ownerComplaint",
                label: "Plainte déposée",
            },
            {
                value: "justiceProcedure",
                label: "Procédure en cours",
            },
            {
                value: "justiceRendered",
                label: "Décision rendue",
            },
        ],
    },
    {
        label: "Type de sites",
        id: "fieldType",
        display: true,
        options: [
            { value: 3, label: "Terrain" },
            { value: 2, label: "Immeuble bâti" },
            { value: 1, label: "Inconnu" },
        ],
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
                label: "Entre 10 et 99 personnes",
            },
            {
                value: "100-",
                label: "Plus de 100 personnes",
            },
        ],
    },
]);
const sortOptions = {
    open: [
        {
            value: `cityName`,
            label: `Commune`,
        },
        {
            value: `builtAt`,
            label: `Date d'installation`,
        },
        {
            value: `updatedAt`,
            label: `Date d'actualisation`,
        },
        {
            value: `declaredAt`,
            label: `Date de signalement`,
        },
    ],
    close: [
        {
            value: `cityName`,
            label: `Commune`,
        },
        {
            value: `closedAt`,
            label: `Date de fermeture`,
        },
        {
            value: `updatedAt`,
            label: `Date d'actualisation`,
        },
    ],
};

const defaultFilters = computed(() => {
    return townsStore.filters.status === "close"
        ? defaultClosedTownsFilter.value
        : defaultOpenTownsFilter.value;
});
const optionalFilters = computed(() => {
    return townsStore.filters.status === "close"
        ? optionalClosedTownsFilter.value
        : optionalOpenTownFilters.value;
});

function showOptional() {
    displayOptionalFilters.value = true;
}

function trackFilter(eventAction, { label: eventName }) {
    let eventCategory;
    let eventActionPrefix;

    if (townsStore.filters.status === "close") {
        eventCategory = "Filtre des sites fermés";
        eventActionPrefix = "FDSF";
    } else {
        eventCategory = "Filtre des sites ouverts";
        eventActionPrefix = "FDSO";
    }

    trackEvent(
        eventCategory,
        `${eventActionPrefix} — ${eventAction}`,
        eventName
    );
}
</script>
