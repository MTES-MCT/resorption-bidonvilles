<template>
    <CheckableGroup
        id="closed_with_solutions"
        :label="labels.closed_with_solutions"
        :info="info"
        validationName="Est-ce que ce site a été résorbé définitivement ?"
    >
        <span class="mb-4"
            >Un site est considéré comme résorbé si une solution pérenne en
            logement ou hébergement est mise en place pour 66 % des habitants du
            site.
        </span>

        <Radio
            :value="true"
            label="Oui"
            variant="card"
            class="mr-1"
            name="closed_with_solutions"
        />
        <Radio
            :value="false"
            label="Non"
            variant="card"
            name="closed_with_solutions"
        />
    </CheckableGroup>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import { CheckableGroup, Radio } from "@resorptionbidonvilles/ui";
import labels from "../FormFermetureDeSite.labels";

const props = defineProps({
    peopleWithSolutions: {
        type: Number,
        required: false,
    },
});
const { peopleWithSolutions } = toRefs(props);

const info = computed(() => {
    if (
        peopleWithSolutions.value === undefined ||
        peopleWithSolutions.value === null
    ) {
        return "";
    }

    return `D'après les informations renseignées, environ 
        ${peopleWithSolutions.value} %
        des habitants du site ont été
        orientées vers une solution longue durée d’hébergement ou de
        logement adapté avec accompagnement,
        dont espace temporaire d'accompagnement`;
});
</script>
