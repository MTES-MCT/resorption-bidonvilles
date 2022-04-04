<template>
    <div class="bg-G200 py-6">
        <h1 class="text-display-md text-center">
            Rechercher une action, une commune, un département... ?
        </h1>

        <GeoSearchbar
            class="mt-4"
            :allowShowAll="false"
            v-model="location"
            @blur="handleBlur"
            :allowFreeInput="true"
            placeholder="Nom d'une action, commune, département..."
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
                if (value === undefined) {
                    // case of native submit, which is handled by blur
                    return;
                }

                this.$store.commit("setPlansLocationFilter", value);
            }
        }
    },

    methods: {
        handleBlur(data) {
            if (data.value !== null) {
                return;
            }

            this.$store.commit("setPlansLocationFilter", {
                label: data.search
            });
        }
    }
};
</script>
