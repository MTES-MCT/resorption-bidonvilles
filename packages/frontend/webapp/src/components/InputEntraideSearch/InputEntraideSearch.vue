<template>
    <Autocomplete
        v-bind="$attrs"
        :fn="autocompleteFn"
        v-model="search"
        showCategory
    />
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";
import { Autocomplete } from "@resorptionbidonvilles/ui";

import { autocomplete as autocompleteQuestions } from "@/api/questions.api.js";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined,
    },
});

const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const search = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

async function autocompleteFn(value) {
    const questionResult = await autocompleteQuestions(value);
    return questionResult.map((item) => {
        return {
            ...item,
            category: item.type.label,
            data: {
                id: item.id,
                label: item.label,
                type: item.type.id,
            },
        };
    });
}
</script>
