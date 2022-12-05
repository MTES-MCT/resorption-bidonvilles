<template>
    <Autocomplete v-bind="$attrs" :fn="autocompleteFn" v-model="location" showCategory />
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits } from "vue";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { autocomplete } from "@/api/locations.api.js";
import formatLocationLabel from "@/utils/formatLocationLabel.js";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined,
    },
});
const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const location = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

async function autocompleteFn(value) {
    const results = await autocomplete(value);
    return results.map((location) => ({
        id: location.code,
        label: formatLocationLabel(location),
        category: location.label,
        data: {
            code: location.code,
            departement: location.departement,
            typeName: location.label,
            typeUid: location.type,
            latitude: location.latitude,
            longitude: location.longitude,
        },
    }));
}
</script>
