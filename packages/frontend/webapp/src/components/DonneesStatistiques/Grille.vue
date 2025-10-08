vue
<template>
    <section>
        <div class="z-10 grid grid-template text-sm bg-white sticky top-0">
            <GrilleHeader :separator="false" />
            <GrilleHeader
                sortable
                sortKey="number_of_towns_with_water"
                :sortDirection="getSortDirection('number_of_towns_with_water')"
                @sort="handleSort"
                >Sites avec accès à l'eau<br />(nbre hab.
                couverts)</GrilleHeader
            >
            <GrilleHeader
                sortable
                sortKey="number_of_persons"
                :sortDirection="getSortDirection('number_of_persons')"
                @sort="handleSort"
                >Habitants</GrilleHeader
            >
            <GrilleHeader
                :separator="false"
                sortable
                sortKey="number_of_towns"
                :sortDirection="getSortDirection('number_of_towns')"
                @sort="handleSort"
                >Nombre de sites</GrilleHeader
            >
        </div>

        <GrilleLigne
            v-for="(m, index) in sortedMetrics"
            :key="m.uid"
            variant="primary"
            :class="index === 0 ? 'mt-4' : 'mt-2'"
            :metrics="m"
            :collapseByDefault="collapseByDefault"
        />
    </section>
</template>

<style scoped lang="scss" src="./grid.scss" />

<script>
export default {
    name: "RbGrille",
};
</script>

<script setup>
import { toRefs, computed, ref } from "vue";
import GrilleHeader from "./GrilleHeader.vue";
import GrilleLigne from "./GrilleLigne.vue";

const props = defineProps({
    metrics: {
        type: Object,
        required: true,
    },
    collapseByDefault: {
        type: Boolean,
        required: false,
        default: true,
    },
});

const { metrics, collapseByDefault } = toRefs(props);

// État du tri : un seul critère actif à la fois
const sortCriteria = ref(null);

// Gestion du tri à critère unique
const handleSort = (sortKey) => {
    if (sortCriteria.value && sortCriteria.value.key === sortKey) {
        // Même critère : passer de croissant à décroissant à null
        if (sortCriteria.value.direction === "asc") {
            sortCriteria.value.direction = "desc";
        } else {
            sortCriteria.value = null;
        }
    } else {
        // Nouveau critère : remplacer par croissant
        sortCriteria.value = { key: sortKey, direction: "asc" };
    }
};

// Obtenir la direction de tri pour un critère donné
const getSortDirection = (sortKey) => {
    return sortCriteria.value && sortCriteria.value.key === sortKey
        ? sortCriteria.value.direction
        : null;
};

// Fonction pour extraire la valeur numérique d'une métrique
const getMetricValue = (item, key) => {
    const metric = item.metrics[key];
    if (typeof metric === "number") {
        return metric;
    }
    if (typeof metric === "object" && metric.to !== undefined) {
        return metric.to;
    }
    return 0;
};

// Fonction de tri récursive qui applique le critère
const sortItemsRecursively = (items) => {
    if (!items || items.length === 0) {
        return;
    }

    // Trier les éléments du niveau actuel
    items.sort((a, b) => {
        // Si aucun critère de tri utilisateur, tri alphabétique direct
        if (!sortCriteria.value) {
            return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
        }

        // Tri par le critère sélectionné
        const valueA = getMetricValue(a, sortCriteria.value.key);
        const valueB = getMetricValue(b, sortCriteria.value.key);

        let comparison = 0;
        if (valueA < valueB) {
            comparison = -1;
        } else if (valueA > valueB) {
            comparison = 1;
        }

        if (comparison !== 0) {
            return sortCriteria.value.direction === "asc"
                ? comparison
                : -comparison;
        }

        // En cas d'égalité, tri alphabétique
        return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
    });

    // Appliquer récursivement le tri aux enfants
    for (const item of items) {
        if (item.children) {
            sortItemsRecursively(item.children);
        }
    }
};

// Métriques triées (computed)
const sortedMetrics = computed(() => {
    if (!metrics.value) {
        return metrics.value;
    }

    // Crée une copie profonde une seule fois pour éviter de muter les props
    const metricsCopy = JSON.parse(JSON.stringify(metrics.value));

    // Si c'est un tableau (les 3 objets nation), traiter chaque objet séparément
    if (Array.isArray(metricsCopy)) {
        // D'abord trier les objets nation eux-mêmes
        metricsCopy.sort((a, b) => {
            // Maintenir l'ordre hiérarchique par défaut pour les nations
            const nationOrder = {
                france: 1,
                metropole: 2,
                outremer: 3,
            };

            // Si aucun critère de tri, ordre par défaut
            if (!sortCriteria.value) {
                const orderA = nationOrder[a.uid] || 999;
                const orderB = nationOrder[b.uid] || 999;
                return orderA - orderB;
            }

            // Sinon, trier par le critère utilisateur
            const valueA = getMetricValue(a, sortCriteria.value.key);
            const valueB = getMetricValue(b, sortCriteria.value.key);

            let comparison = 0;
            if (valueA < valueB) {
                comparison = -1;
            } else if (valueA > valueB) {
                comparison = 1;
            }
            if (comparison !== 0) {
                return sortCriteria.value.direction === "asc"
                    ? comparison
                    : -comparison;
            }

            // En cas d'égalité, maintenir l'ordre par défaut
            const orderA = nationOrder[a.uid] || 999;
            const orderB = nationOrder[b.uid] || 999;
            return orderA - orderB;
        });

        // Puis trier les enfants de chaque nation
        for (const nationItem of metricsCopy) {
            if (nationItem.level === "nation" && nationItem.children) {
                sortItemsRecursively(nationItem.children);
            }
        }

        return metricsCopy;
    }

    // Si c'est un objet unique avec children
    if (metricsCopy.children) {
        sortItemsRecursively(metricsCopy.children);
    }

    return metricsCopy;
});
</script>
