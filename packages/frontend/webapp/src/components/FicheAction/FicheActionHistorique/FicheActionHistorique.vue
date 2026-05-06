<template>
    <PanneauLateral icon="history" ref="panneauLateral">
        <template v-slot:header>Historique des modifications</template>

        <Filter
            v-model="actionCategoryFilter"
            title="Filtrer par rubrique"
            :options="filters.categories"
            class="border-1 !border-primary rounded hover:bg-blue200"
        />

        <p
            class="text-sm mt-4"
            :class="filteredChangelog.length < 1 ? 'mb-4' : ''"
        >
            <span class="font-bold">
                {{
                    filteredChangelog.length >= 1
                        ? filteredChangelog.length
                        : "Aucune"
                }}
                modification{{ filteredChangelog.length > 1 ? "s" : "" }}
            </span>
            <br />
            <span v-if="actionCategoryFilter.length">
                correspondant à vos filtres, sur un total de
                {{ changelog.length }} modifications
            </span>
        </p>

        <FicheActionHistoriqueItem
            v-for="(change, index) in filteredChangelog"
            :key="`${change.date}-${index}`"
            :author="change.author"
            :date="change.date"
            :diff="change.diff"
        />

        <FicheActionHistoriqueItem
            v-if="action.created_by && actionCategoryFilter.length === 0"
            :author="action.created_by"
            :date="new Date(action.created_at).getTime() / 1000"
        >
            Création de l'action
        </FicheActionHistoriqueItem>
    </PanneauLateral>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import filters from "../FicheAction.filter";
import { getActionHistory } from "@/api/actions.api";

import { Filter, PanneauLateral } from "@resorptionbidonvilles/ui";
import FicheActionHistoriqueItem from "./FicheActionHistoriqueItem/FicheActionHistoriqueItem.vue";

const props = defineProps({
    action: Object,
});
const { action } = toRefs(props);
const panneauLateral = ref(null);
const actionCategoryFilter = ref([]);
const changelog = ref([]);
const loading = ref(false);

const open = async (categoryFilter = null) => {
    if (panneauLateral.value) {
        panneauLateral.value.open();

        if (categoryFilter) {
            actionCategoryFilter.value = Array.isArray(categoryFilter)
                ? [...categoryFilter]
                : [categoryFilter];
        }

        // Toujours recharger l'historique pour afficher les modifications récentes
        if (!loading.value) {
            await loadHistory();
        }
    }
};

const loadHistory = async () => {
    loading.value = true;
    try {
        const history = await getActionHistory(action.value.id);
        changelog.value = history.filter((item) => item.action === "update");
    } catch {
        changelog.value = [];
    } finally {
        loading.value = false;
    }
};

defineExpose({
    open,
});

function checkFilter(field) {
    let res = false;
    actionCategoryFilter.value.forEach((category) => {
        filters.fields[category].forEach((filterField) => {
            if (field === filterField || field.startsWith(filterField + ".")) {
                res = true;
            }
        });
    });
    return res;
}

const filteredChangelog = computed(() => {
    let changes = changelog.value;

    if (actionCategoryFilter.value.length > 0) {
        changes = changes
            .map((change) => {
                const filteredDiff = change.diff.filter((difference) => {
                    return checkFilter(difference.fieldKey);
                });

                return {
                    ...change,
                    diff: filteredDiff,
                };
            })
            .filter((change) => change.diff.length !== 0);
    }

    // Trier par date décroissante (plus récent en premier)
    return [...changes].sort((a, b) => {
        const aDate = a.date * 1000;
        const bDate = b.date * 1000;
        return bDate - aDate;
    });
});
</script>
