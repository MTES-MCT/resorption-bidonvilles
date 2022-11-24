<template>
    <FicheSiteRubrique title="Fermeture du site">
        <FicheSiteSousRubrique :border="false">
            <p class="grid grid-cols-2">
                <span class="font-bold">Date de la fermeture</span>
                {{ formatDate(town.closedAt) }}
            </p>
        </FicheSiteSousRubrique>
        <FicheSiteSousRubrique>
            <p class="grid grid-cols-2">
                <span class="font-bold">Site résorbé</span>
                {{ town.closedWithSolutions === "yes" ? "oui" : "non" }}
            </p>
        </FicheSiteSousRubrique>
        <FicheSiteSousRubrique>
            <p class="grid grid-cols-2">
                <span class="font-bold">Cause de la fermeture</span>
                {{ town.statusDetails }}
            </p>
        </FicheSiteSousRubrique>
        <FicheSiteSousRubrique>
            <p class="grid grid-cols-2 whitespace-pre-line break-words">
                <span class="font-bold">Contexte de la fermeture</span>
                {{
                    town.closingContext ? town.closingContext : "non communiqué"
                }}
            </p>
        </FicheSiteSousRubrique>
        <FicheSiteSousRubrique>
            <p class="font-bold" v-if="town.closingSolutions.length === 0">
                Orientation des ménages
            </p>
            <table
                class="table-fixed text-center"
                v-if="town.closingSolutions.length > 0"
            >
                <thead>
                    <tr>
                        <td class="border-b-1 font-bold">
                            Orientations des ménages
                        </td>
                        <td class="w-32 py-2 border-b-1 font-bold">Ménages</td>
                        <td class="w-32 py-2 border-b-1 font-bold">
                            Personnes
                        </td>
                        <td class="w-48 py-2 border-b-1 font-bold">Message</td>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in town.closingSolutions" :key="item.id">
                        <td class="text-left pr-4 border-b-1 border-r-1">
                            {{ closingSolutions[item.id] }}
                        </td>
                        <td class="py-1 border-b-1 border-r-1">
                            {{ `${item.householdsAffected || "-"}` }}
                        </td>
                        <td class="py-1 border-b-1 border-r-1">
                            {{ `${item.peopleAffected || "-"}` }}
                        </td>
                        <td class="py-1 border-b-1">
                            {{ `${item.message || "-"}` }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else>
                Aucune information disponible sur les orientations des ménages
            </p>
        </FicheSiteSousRubrique>
    </FicheSiteRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import formatDate from "@/utils/formatDate";

import FicheSiteRubrique from "../FicheSiteRubrique.vue";
import FicheSiteSousRubrique from "../FicheSiteSousRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const closingSolutions = computed(() => {
    const configStore = useConfigStore();
    return configStore.config.closing_solutions.reduce((acc, item) => {
        acc[item.id] = item.label;
        return acc;
    }, {});
});
</script>
