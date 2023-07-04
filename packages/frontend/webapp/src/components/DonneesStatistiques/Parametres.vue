<template>
    <section>
        <div class="py-3 border-t border-b text-sm px-1">
            <p class="flex flex-col md:flex-row md:space-x-4">
                <Checkbox
                    class="mt-0 md:mt-2"
                    v-for="parametre in parametres"
                    :key="parametre.id"
                    :label="parametre.label"
                    :value="parametre.id"
                    variant="toggle"
                    v-model="metricsStore.parametresDeVue"
                />
            </p>
        </div>
    </section>
</template>

<script>
export default {
    name: "RbParametres",
};
</script>

<script setup>
import { useMetricsStore } from "@/stores/metrics.store";
import parametres from "./DonneesStatistiques.parametres";

import { Checkbox } from "@resorptionbidonvilles/ui";

const metricsStore = useMetricsStore();
</script>
