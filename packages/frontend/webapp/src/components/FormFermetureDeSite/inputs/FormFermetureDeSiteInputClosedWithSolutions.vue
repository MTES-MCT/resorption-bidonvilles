<template>
    <div class="flex flex-col gap-2 -mb-2">
        <p class="font-bold -mb-0">{{ labels.closed_with_solutions }}</p>
        <span v-if="peopleWithSolutions != null">
            D'après les informations renseignées, environ
            <DsfrBadge
                small
                :type="calculatedValue.color"
                :label="`${peopleWithSolutions}%`"
                noIcon
            />
            des habitants du site ont été orienté·es vers une solution longue
            durée d’hébergement ou de logement adapté avec accompagnement, dont
            espace temporaire d'accompagnement
        </span>
        <span class="mb-4"
            >Un site est considéré comme résorbé si une solution pérenne en
            logement ou hébergement est mise en place pour 66 % des habitants du
            site.
        </span>
    </div>
    <DsfrRadioButtonSet
        v-model="calculatedValue.value"
        name="closed_with_solutions"
        id="closed_with_solutions"
        small
        class="!-mb-6"
        :options="[
            { label: 'Oui', value: true },
            { label: 'Non', value: false },
        ]"
    />
</template>

<script setup>
import { computed, toRefs } from "vue";
import labels from "../FormFermetureDeSite.labels";

const props = defineProps({
    peopleWithSolutions: {
        type: Number,
        required: false,
    },
});
const { peopleWithSolutions } = toRefs(props);

const calculatedValue = computed(() => {
    if (peopleWithSolutions.value === undefined) {
        return { color: "default", value: false };
    }
    if (peopleWithSolutions.value >= 66) {
        return { color: "success", value: true };
    }
    if (peopleWithSolutions.value >= 33) {
        return { color: "warning", value: false };
    }
    return { color: "error", value: false };
});
</script>
