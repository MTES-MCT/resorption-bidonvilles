<template>
    <PrivateLayout v-if="error !== null">
        <div class="bg-red600 text-center text-primary text-display-lg mt-16">
            {{ error }}
        </div>
    </PrivateLayout>

    <PrivateLayout v-else-if="town === null">
        <div class="text-center text-primary text-display-lg mt-16">
            <Spinner />
        </div>
    </PrivateLayout>

    <PrivateLayout v-else>
        <TownForm mode="update" :data="town"></TownForm>
    </PrivateLayout>
</template>

<script>
import TownForm from "#app/components/TownForm/TownForm.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import { get } from "#helpers/api/town";

export default {
    components: {
        TownForm,
        PrivateLayout
    },

    data() {
        return {
            loading: false,
            error: null,
            town: null
        };
    },

    mounted() {
        this.fetchData();
    },

    methods: {
        fetchData() {
            if (this.loading === true) {
                return;
            }

            this.loading = true;
            this.error = null;

            get(this.$route.params.id)
                .then(town => {
                    this.town = town;
                    this.loading = false;
                })
                .catch(errors => {
                    this.error = errors.user_message;
                    this.loading = false;
                });
        }
    }
};
</script>
