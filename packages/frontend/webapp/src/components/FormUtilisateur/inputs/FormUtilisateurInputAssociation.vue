<template>
    <Autocomplete
        name="association"
        :label="label"
        placeholder="Nom ou acronyme de votre association"
        :fn="autocompleteFn"
        v-model="association"
        showCategory
        ref="autocompleteInput"
        showMandatoryStar
    />
</template>

<script setup>
import { defineProps, ref, toRefs, computed, defineEmits, watch } from "vue";
import { useFieldValue } from "vee-validate";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { autocompleteAssociation } from "@/api/organizations.api.js";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => {},
    },
});
const { modelValue } = toRefs(props);

const autocompleteInput = ref(null);
const emit = defineEmits(["update:modelValue", "change"]);
const association = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});
const value = useFieldValue("association");

// obligés d'émettre un événement différent de update:modelValue car ce dernier est émis
// deux fois pour chaque changement de valeur
// ici, "change" ne sera émis qu'une seule fois
watch(value, (newValue) => {
    emit("change", newValue);
});

async function autocompleteFn(value) {
    const results = await autocompleteAssociation(value);
    const mappedResults = results.map((org) => ({
        id: org.id,
        label: org.label,
        selectedLabel: `${org.name} — ${org.label}`,
        category: org.name,
        data: {
            id: org.id,
        },
    }));
    mappedResults.unshift({
        id: "autre",
        selectedLabel: "",
        label: "Je ne trouve pas mon association ou mon territoire",
        category: "",
        data: null,
    });

    return mappedResults;
}

defineExpose({
    clear() {
        autocompleteInput.value.clear();
    },
});
</script>
