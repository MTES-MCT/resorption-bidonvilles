<template>
    <div>
        <h1 class="text-display-lg mb-4 whitespace-nowrap">Dispositifs</h1>
        <h2 class="mb-4">
            L'ensemble des dispositifs sur votre territoire :
            <span class="font-bold">{{ location.label }}</span>
        </h2>
        <div class="md:flex md:flex-row-reverse mb-6">
            <div v-if="hasPermission('plan.create')">
                <router-link to="/nouveau-dispositif">
                    <Button
                        icon="plus"
                        iconPosition="left"
                        variant="secondary"
                        class="whitespace-no-wrap mb-4 md:mb-0"
                    >
                        Déclarer un nouveau dispositif</Button
                    >
                </router-link>
            </div>
            <Button
                v-if="hasPermission('plan.export')"
                icon="file-excel"
                iconPosition="left"
                variant="primary"
                class="mr-6"
                @click="exportPlans"
                >Exporter</Button
            >
        </div>
    </div>
</template>

<script>
import { exportPlans } from "#helpers/api/plan";
import { hasPermission } from "#helpers/api/config";
import { mapGetters } from "vuex";
import { notify } from "#helpers/notificationHelper";

export default {
    methods: {
        hasPermission(...args) {
            return hasPermission(...args);
        },
        async exportPlans() {
            try {
                const { csv } = await exportPlans();
                const hiddenElement = document.createElement("a");
                hiddenElement.href =
                    "data:text/csv;charset=utf-8," + encodeURI(csv);
                hiddenElement.target = "_blank";
                hiddenElement.download = "plans.csv";
                hiddenElement.click();
            } catch (err) {
                notify({
                    group: "notifications",
                    type: "error",
                    title: "Une erreur est survenue",
                    text: "Une erreur est survenue durant l'export des actions"
                });
            }
        }
    },

    computed: {
        ...mapGetters({
            location: "plansLocationFilter"
        })
    }
};
</script>
