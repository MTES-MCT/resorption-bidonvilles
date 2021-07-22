<template>
    <div class="bg-G100 py-6">
        <h1 class="text-display-md text-center">
            Rechercher un site, une commune, un département... ?
        </h1>

        <GeoSearchbar
            class="mt-4"
            :allowShowAll="false"
            v-model="location"
        ></GeoSearchbar>
    </div>
</template>

<script>
import GeoSearchbar from "#app/components/GeoSearchbar/GeoSearchbar.vue";
import store from "#app/store";

export default {
    components: {
        GeoSearchbar
    },

    computed: {
        location: {
            get() {
                return store.state.activities.filters.location;
            },
            set(value) {
                store.commit("setActivityLocationFilter", value);
            }
        }
    }
};
</script>

<style scoped>
.searchbox {
    max-width: 500px;
    min-width: 500px;
}
</style>
