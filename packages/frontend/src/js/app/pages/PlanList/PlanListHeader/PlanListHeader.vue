<template>
    <div>
        <TabList :tabs="[{ id: 'open', label: 'Actions existantes' }]" />

        <div class="flex justify-between items-start mb-8">
            <h1 class="text-display-xl my-4 whitespace-nowrap">
                <span v-if="state !== 'loading'">{{ location }}</span>
            </h1>

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
    </div>
</template>

<script>
import TabList from "#app/components/TabList/TabList.vue";
import { exportPlans } from "#helpers/api/plan";
import { mapGetters } from "vuex";
import { notify } from "#helpers/notificationHelper";

export default {
    components: {
        TabList,
    },
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
            hasPermission: "config/hasPermission",
            state: "plansState",
            rawLocation: "plansLocationFilter",
        }),

        location() {
            if (!this.rawLocation.data) {
                return `« ${this.rawLocation.label} »`;
            }

            return this.rawLocation.label;
        },
    },
};
</script>
