<template>
    <div class="flex justify-between items-start mb-8">
        <div>
            <h1 class="text-display-lg mb-2 whitespace-nowrap">Actions</h1>
            <h2 v-if="state !== 'loading'">
                L'ensemble des actions sur votre territoire :
                <span class="font-bold">{{ location.label }}</span>
            </h2>
        </div>

        <div class="flex items-end space-x-6">
            <div v-if="hasPermission('plan.create')">
                <router-link to="/nouvelle-action">
                    <Button
                        icon="plus"
                        iconPosition="left"
                        variant="secondary"
                        class="whitespace-no-wrap mb-4 md:mb-0"
                    >
                        Déclarer une nouvelle action</Button
                    >
                </router-link>
            </div>
            <Button
                v-if="hasPermission('plan.export')"
                icon="file-excel"
                iconPosition="left"
                variant="primary"
                @click="exportPlans"
                :loading="exportIsPending"
                >Exporter</Button
            >
        </div>
    </div>
</template>

<script>
import { exportPlans } from "#helpers/api/plan";
import { mapGetters } from "vuex";
import { notify } from "#helpers/notificationHelper";

export default {
    methods: {
        async exportPlans() {
            if (this.exportIsPending === true) {
                return;
            }

            this.exportIsPending = true;

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
                    text: "Une erreur est survenue durant l'export des actions",
                });
            }

            this.exportIsPending = false;
        },
    },

    data() {
        return {
            exportIsPending: false,
        };
    },

    computed: {
        ...mapGetters({
            location: "plansLocationFilter",
            hasPermission: "config/hasPermission",
            state: "plansState",
        }),
    },
};
</script>
