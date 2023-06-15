<template>
    <section>
        <header class="flex justify-between items-start">
            <h1 class="mb-3 text-primary font-bold">Paramètres de la vue</h1>
            <Button icon="times" variant="text" :padding="false" />
        </header>
        <div class="py-3 border-t border-b text-sm">
            <p class="font-bold">
                <Icon icon="fa-regular fa-eye" size="sm" />
                Paramètres de la vue
            </p>
            <p class="mt-2 flex flex-col md:flex-row md:space-x-4">
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
        <footer class="text-right mt-3">
            <Button size="sm">Valider</Button>
        </footer>
    </section>
</template>

<script setup>
import { useMetricsStore } from "@/stores/metrics.store";
import parametres from "./DonneesStatistiques.parametres";

import { Button, Checkbox, Icon } from "@resorptionbidonvilles/ui";

const metricsStore = useMetricsStore();
</script>
