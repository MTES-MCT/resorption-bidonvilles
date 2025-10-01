<template>
    <div class="flex flex-col gap-2 -mb-2">
        <p class="font-bold -mb-0">{{ labels.closed_with_solutions }}</p>
        <DsfrNotice
            v-if="peopleWithSolutions != null"
            :type="calculatedValue.color"
        >
            <template #default
                ><span class="font-normal">
                    D'après les informations renseignées, environ
                    <span class="font-bold">{{ peopleWithSolutions }}%</span>
                    des habitants du site ont été orientés vers une solution
                    longue durée d’hébergement ou de logement adapté avec
                    accompagnement, dont espace temporaire d'accompagnement
                </span>
            </template>
        </DsfrNotice>
        <span class="mb-4"
            >Un site est considéré comme résorbé si une solution pérenne en
            logement ou hébergement est mise en place pour 66 % des habitants du
            site.
        </span>
    </div>
    <DsfrRadioButtonSet
        v-model="closedWithSolutions"
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
import { useField } from "vee-validate";
import labels from "../FormFermetureDeSite.labels";

const props = defineProps({
    peopleWithSolutions: {
        type: Number,
        required: false,
    },
});
const { peopleWithSolutions } = toRefs(props);

const { value: closedWithSolutions, setValue } = useField(
    "closed_with_solutions"
);

if (peopleWithSolutions.value === null) {
    setValue(false);
}

const calculatedValue = computed(() => {
    if (peopleWithSolutions.value >= 66 && peopleWithSolutions.value <= 100) {
        setValue(true);
        return { color: "info", value: true };
    }
    setValue(false);
    return { color: "alert", value: false };
});
</script>
