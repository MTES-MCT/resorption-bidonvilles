<template>
    <Autocomplete
        name="private_organization"
        :label="label"
        placeholder="Nom ou acronyme de l'organisme privé"
        :fn="autocompleteFn"
        v-model="privateOrganization"
        showCategory
        ref="autocompleteInput"
        showMandatoryStar
    />
</template>

<script setup>
import { defineProps, ref, toRefs, computed, defineEmits, watch } from "vue";
import { useFieldValue } from "vee-validate";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { autocompletePrivateOrganization } from "@/api/organizations.api.js";

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
const privateOrganization = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});
const value = useFieldValue("private_organization");

// obligés d'émettre un événement différent de update:modelValue car ce dernier est émis
// deux fois pour chaque changement de valeur
// ici, "change" ne sera émis qu'une seule fois
watch(value, (newValue) => {
    emit("change", newValue);
});

async function autocompleteFn(value) {
    const results = await autocompletePrivateOrganization(value);
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
        label: "Je ne trouve pas mon organisme privé",
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
