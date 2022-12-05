<template>
    <SubQuestionWrapper label="Nombre de toilettes" :space-between="false">
        <div class="flex items-center space-x-3">
            <p>Nombre de bacs</p>
            <TextInput
                name="old_sanitary_number"
                class="w-16"
                disabled
                withoutMargin
            />
            <p
                class="italic"
                v-if="
                    Number(sanitaryNumber) > 0 &&
                    ratio &&
                    population.populationTotal
                "
            >
                Soit 1 bac pour {{ ratio }} personnes
            </p>
        </div>
    </SubQuestionWrapper>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useFieldValue } from "vee-validate";
import { SubQuestionWrapper, TextInput } from "@resorptionbidonvilles/ui";

const props = defineProps({
    population: Object,
});
const { population } = toRefs(props);
const sanitaryNumber = useFieldValue("old_sanitary_number");
const ratio = computed(() => {
    return Math.floor(
        Number(population.value.populationTotal) / Number(sanitaryNumber.value)
    );
});
</script>
