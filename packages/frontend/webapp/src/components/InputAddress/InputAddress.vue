<template>
    <Autocomplete v-bind="$attrs" :fn="searchAddress" v-model="address" />
</template>

<script setup>
import { toRefs, computed } from "vue";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { searchAddress } from "@/api/datagouv.api.js";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined,
    },
});
const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const address = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});
</script>
