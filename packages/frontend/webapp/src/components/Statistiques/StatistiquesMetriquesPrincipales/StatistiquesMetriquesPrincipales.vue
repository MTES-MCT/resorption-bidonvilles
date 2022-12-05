<template>
    <section>
        <div class="grid grid-cols-6 gap-4">
            <StatistiquesMetriquePrincipale
                :value="stats.numberOfPeople || 0"
                label="habitants"
            />
            <StatistiquesMetriquePrincipale
                :value="stats.numberOfShantytown || 0"
                label="sites"
            />
            <StatistiquesMetriquePrincipale
                :value="stats.numberOfResorbedShantytown || 0"
                label="résorptions"
                info="depuis janvier 2019"
            />
            <StatistiquesMetriquePrincipale
                :value="stats.numberOfPlans || 0"
                label="actions"
            />
            <StatistiquesMetriquePrincipale
                :value="stats.numberOfUsers || 0"
                label="utilisateurs"
            />
            <StatistiquesMetriquePrincipale
                :value="
                    stats.averageCompletionPercentage
                        ? (stats.averageCompletionPercentage * 100).toFixed(2) +
                          '%'
                        : 0
                "
                label="de complétion"
            />
        </div>
        <p class="mt-2 text-sm">
            <span class="font-bold">Site résorbé :</span> une solution pérenne
            en logement ou hébergement a été mise en place pour 66 % des
            habitants du site
        </p>
        <p class="text-sm">
            <span class="font-bold">Complétion :</span> pourcentage
            d'informations renseignées sur la fiche d'un site
        </p>
    </section>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import StatistiquesMetriquePrincipale from "./StatistiquesMetriquePrincipale.vue";

const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
});

const { stats } = toRefs(props);
</script>
