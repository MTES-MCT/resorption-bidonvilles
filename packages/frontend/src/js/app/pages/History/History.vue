<template>
    <PrivateLayout>
        <HistorySearchbar></HistorySearchbar>

        <div>
            <HistoryLoader v-if="loading"></HistoryLoader>

            <HistoryError v-else-if="error !== null" @retry="load">
                <template>{{ error }}</template>
            </HistoryError>

            <PrivateContainer v-else class="py-6">
                <h1 class="text-display-xl">Dernières activités</h1>
                <HistoryFilterBar class="mb-6"></HistoryFilterBar>

                <HistoryCardGroup
                    v-for="(group, index) in currentPageGroups"
                    :date="group.date"
                    :items="group.items"
                    :key="index"
                    class="mb-4"
                ></HistoryCardGroup>

                <HistoryPagination
                    class="mt-10 -mr-6 flex justify-end"
                ></HistoryPagination>
            </PrivateContainer>
        </div>
    </PrivateLayout>
</template>

<script>
import PrivateLayout from "#app/components/PrivateLayout";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer.vue";
import HistoryLoader from "./HistoryLoader.vue";
import HistorySearchbar from "./HistorySearchbar.vue";
import HistoryError from "./HistoryError.vue";
import HistoryFilterBar from "./HistoryFilterBar.vue";
import HistoryPagination from "./HistoryPagination.vue";
import HistoryCardGroup from "./HistoryCardGroup.vue";

import store from "#app/store";
import { mapGetters } from "vuex";

export default {
    components: {
        PrivateLayout,
        PrivateContainer,
        HistoryLoader,
        HistorySearchbar,
        HistoryError,
        HistoryFilterBar,
        HistoryPagination,
        HistoryCardGroup
    },
    computed: {
        ...mapGetters({
            loading: "activitiesLoading",
            error: "activitiesError",
            activities: "activitiesFilteredItems"
        }),
        currentPageItems() {
            const { itemsPerPage, currentPage } = store.state.activities;
            const start = (currentPage - 1) * itemsPerPage;

            return this.activities.slice(start, start + itemsPerPage);
        },
        currentPageGroups() {
            // on groupe les items de la page par date
            const groups = [];
            for (
                let i = 0, lastDate;
                i < this.currentPageItems.length;
                i += 1
            ) {
                const item = this.currentPageItems[i];
                const date = new Date(item.date * 1000);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                const dateStr = `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;

                // si cet item n'est pas à la même date que le précédent on crée un nouveau groupe
                if (!lastDate || dateStr !== lastDate) {
                    groups.push({
                        date,
                        items: [item]
                    });
                }
                // sinon on ajoute l'item au dernier groupe en date
                else {
                    groups[groups.length - 1].items.push(item);
                }

                lastDate = dateStr;
            }

            return groups;
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        load() {
            store.dispatch("fetchActivities");
        }
    }
};
</script>
