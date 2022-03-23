<template>
    <div class="bg-G200 py-6">
        <h1 class="text-display-md text-center">
            Rechercher une commune, un département... ?
        </h1>

        <GeoSearchbar
            class="mt-4"
            :allowShowAll="false"
            v-model="location"
            placeholder="Nom d'une commune, département..."
        ></GeoSearchbar>
    </div>
</template>

<script>
import GeoSearchbar from "#app/components/GeoSearchbar/GeoSearchbar.vue";

export default {
    components: {
        GeoSearchbar
    },

    computed: {
        location: {
            get() {
                return this.$store.state.plans.locationFilter;
            },
            set(value) {
                this.$store.commit("setPlansLocationFilter", value);
            }
        }
    }
};
</script>
