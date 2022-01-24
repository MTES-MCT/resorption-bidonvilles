<template>
    <div class="bg-G100 py-6">
        <h1 class="text-display-md text-center">
            Rechercher un site, une commune, un département... ?
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
                return null;
            },
            set(value) {
                this.$emit("locationChange", value);
            }
        }
    }
};
</script>
