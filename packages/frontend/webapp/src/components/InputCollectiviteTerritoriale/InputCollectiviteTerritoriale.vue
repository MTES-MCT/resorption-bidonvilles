<template>
    <Autocomplete
        v-bind="$attrs"
        :fn="autocompleteFn"
        v-model="organization"
        ref="autocomplete"
    />
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits, ref } from "vue";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { autocompleteTerritorialCollectivity } from "@/api/organizations.api.js";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => ({
            search: "",
            data: null,
        }),
    },
});
const { modelValue } = toRefs(props);
const autocomplete = ref(null);
const emit = defineEmits(["update:modelValue"]);
const organization = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

async function autocompleteFn(value) {
    const results = await autocompleteTerritorialCollectivity(value);
    return results.map((org) => ({
        id: org.id,
        label: org.label,
        category: org.type,
        data: {
            type: org.type,
            id: org.id,
            name: org.label,
        },
    }));
}

defineExpose({
    focus: () => {
        autocomplete.value.focus();
    },
});
</script>
