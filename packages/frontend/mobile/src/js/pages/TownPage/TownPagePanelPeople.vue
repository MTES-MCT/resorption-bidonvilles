<template>
    <div>
        <div class="text-center items-center flex justify-between">
            <TownPagePanelTitle :title="'Habitants'" />
            <Button
                v-if="canUpdateTown"
                class="mt-4 mb-2"
                icon="pencil"
                variant="primaryText"
                iconPosition="left"
                :href="`/site/${town.id}/mise-a-jour/habitants`"
            >
                Modifier</Button
            >
        </div>

        <div class="flex flex-col">
            <TownPageInfo
                v-for="section in data"
                :key="section.title"
                :title="section.title"
            >
                {{ town[section.content] || "Non communiqué" }}
            </TownPageInfo>

            <TownPageInfo title="Origines">
                <section v-if="town.socialOrigins.length === 0">
                    Non communiqué
                </section>
                <section v-else>
                    <p v-for="origin in town.socialOrigins" :key="origin.id">
                        {{ origin.label }}
                    </p>
                </section>
            </TownPageInfo>
        </div>
    </div>
</template>
<script setup>
import { computed, defineProps, toRefs } from "vue";
import store from "#src/store/index.js";

import TownPageInfo from "./TownPageInfo.vue";
import TownPagePanelTitle from "./TownPagePanelTitle.vue";
import { Button } from "@resorptionbidonvilles/ui";

const data = [
    { title: "Nombre de personnes", content: "populationTotal" },
    { title: "Nombre de ménages", content: "populationCouples" },
    { title: "Nombre de mineurs", content: "populationMinors" },
    { title: "0 - 3 ans", content: "populationMinors0To3" },
    { title: "3 - 6 ans", content: "populationMinors3To6" },
    { title: "6 - 12 ans", content: "populationMinors6To12" },
    { title: "12 - 16 ans", content: "populationMinors12To16" },
    { title: "16 - 18 ans", content: "populationMinors16To18" },
    {
        title: "Inscrits en établissement scolaire",
        content: "minorsInSchool",
    },
    { title: "Nombre de caravanes", content: "caravans" },
    { title: "Nombre de cabanes", content: "huts" },
    { title: "Nombre de tentes", content: "tents" },
    { title: "Nombre de voitures dortoir", content: "cars" },
    { title: "Nombre de matelas", content: "mattresses" },
];
const props = defineProps({
    town: {
        type: Object,
        required: true,
    },
});
const { town } = toRefs(props);
const canUpdateTown = computed(() => {
    return (
        store.getters["config/hasLocalizedPermission"](
            "shantytown.update",
            town.value
        ) === true && town.value.status === "open"
    );
});
</script>
