<template>
    <PrivateLayout v-if="error !== null">
        <div
            class="bg-red600 text-center text-primary text-display-lg font-bold mt-16"
        >
            {{ error }}
        </div>
    </PrivateLayout>

    <PrivateLayout v-else-if="plan === null">
        <div class="text-center text-primary text-display-lg font-bold mt-16">
            <Spinner />
        </div>
    </PrivateLayout>

    <PrivateLayout v-else>
        <PlanMarksForm :data="plan" />
    </PrivateLayout>
</template>

<script>
import PlanMarksForm from "./PlanMarksForm.vue";
import PrivateLayout from "#app/components/PrivateLayout";
import { get } from "#helpers/api/plan";

export default {
    components: {
        PlanMarksForm,
        PrivateLayout
    },

    data() {
        return {
            loading: false,
            error: null,
            plan: null
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
                .then(plan => {
                    this.plan = plan;
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
