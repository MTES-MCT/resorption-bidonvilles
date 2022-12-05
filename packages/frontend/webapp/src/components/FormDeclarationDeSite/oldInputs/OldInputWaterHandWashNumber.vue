<template>
    <div class="flex items-center space-x-3">
        <p>Nombre de bacs</p>
        <TextInput
            name="old_water_handWashAccessNumber"
            class="w-16"
            disabled
            withoutMargin
        />
        <p
            class="italic"
            v-if="
                Number(handWashAccessNumber) > 0 &&
                ratio &&
                population.populationTotal
            "
        >
            Soit 1 bac pour {{ ratio }} personnes
        </p>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useFieldValue } from "vee-validate";
import { TextInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    population: Object,
});
const { population } = toRefs(props);
const handWashAccessNumber = useFieldValue("old_water_handWashAccessNumber");
const ratio = computed(() => {
    return Math.floor(
        Number(population.value.populationTotal) /
            Number(handWashAccessNumber.value)
    );
});
</script>
