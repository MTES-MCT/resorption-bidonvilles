<template>
    <section>
        <div class="py-3 border-t border-b text-sm px-1">
            <p class="flex flex-col md:flex-row md:space-x-4">
                <Checkbox
                    class="mt-0 md:mt-2"
                    v-for="parametre in parametres"
                    name="parametresDeVue"
                    :key="parametre.id"
                    :label="parametre.label"
                    :value="parametre.id"
                    @click="trackMatomoEvent(parametre.id)"
                    variant="toggle"
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
import { watch } from "vue";
import { useMetricsStore } from "@/stores/metrics.store";
import parametres from "./DonneesStatistiques.parametres";
import { trackEvent } from "@/helpers/matomo";
import { useForm } from "vee-validate";

import { Checkbox } from "@resorptionbidonvilles/ui";

const metricsStore = useMetricsStore();
const { values } = useForm({
    initialValues: {
        parametresDeVue: metricsStore.parametresDeVue,
    },
});
watch(values, () => {
    metricsStore.parametresDeVue = values.parametresDeVue;
});

function trackMatomoEvent(value) {
    trackEvent(
        "Visualisation des données nationales",
        "Paramètre de vue",
        value
    );
}
</script>
