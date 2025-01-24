<template>
    <Autocomplete
        v-bind="$attrs"
        :fn="autocompleteFn"
        v-model="location"
        showCategory
        ref="input"
        class="bg-white"
    />
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits, ref } from "vue";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { autocomplete } from "@/api/locations.api.js";
import formatLocationLabel from "@/utils/formatLocationLabel.js";
import { trackEvent } from "@/helpers/matomo";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined,
    },
});
const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const input = ref(null);
const location = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        if (value) {
            trackEvent(
                "Recherche autocomplete",
                "Utilisation du module de recherche",
                `${window.location.href.split("/").pop()}: ${value.search}`
            );
        }
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

defineExpose({
    focus: () => {
        input.value.focus();
    },
});
</script>
