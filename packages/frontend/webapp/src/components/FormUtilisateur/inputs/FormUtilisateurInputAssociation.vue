<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <BasicAutocomplete
            name="association"
            id="association"
            :label="label"
            placeholder="Nom ou acronyme de votre association"
            :fn="autocompleteFn"
            v-model="association"
            showCategory
            ref="autocompleteInput"
            showMandatoryStar
            @update:modelValue="updateAssociation"
        />
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import {
    BasicAutocomplete,
    InputError,
    InputWrapper,
} from "@resorptionbidonvilles/ui";
import { autocompleteAssociation } from "@/api/organizations.api.js";
import { useField } from "vee-validate";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => {},
    },
});
const { modelValue } = toRefs(props);

const { handleChange, errors } = useField("association");

const autocompleteInput = ref(null);
const emit = defineEmits(["update:modelValue", "change"]);
const association = computed({
    get() {
        handleChange(modelValue.value, false);
        return modelValue.value;
    },
    set(value) {
        handleChange(value, true);
    },
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

const updateAssociation = (value) => {
    association.value = value;
    emit("change", value);
};

defineExpose({
    clear() {
        autocompleteInput.value.clear();
    },
});
</script>
