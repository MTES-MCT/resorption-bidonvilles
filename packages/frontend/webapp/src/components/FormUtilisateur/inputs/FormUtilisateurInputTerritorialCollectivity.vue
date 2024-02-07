<template>
    <Autocomplete
        name="territorial_collectivity"
        :label="label"
        placeholder="Nom de la commune, epci, département, ou région"
        :fn="autocompleteFn"
        v-model="organization"
        showCategory
        showMandatoryStar
    />
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";
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
            id: org.id,
        },
    }));
}
</script>
