<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <BasicAutocomplete
            name="private_organization"
            id="private_organization"
            :label="label"
            placeholder="Nom ou acronyme de l'organisme privé"
            :fn="autocompleteFn"
            v-model="privateOrganization"
            showCategory
            ref="autocompleteInput"
            @update:modelValue="updateOrganization"
            showMandatoryStar
        />
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { useField } from "vee-validate";
import {
    BasicAutocomplete,
    InputError,
    InputWrapper,
} from "@resorptionbidonvilles/ui";
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
const { handleChange, errors } = useField("private_organization");
const privateOrganization = computed({
    get() {
        handleChange(modelValue.value, false);
        return modelValue.value;
    },
    set(value) {
        handleChange(value, true);
        emit("update:modelValue", value);
    },
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

    return mappedResults;
}

const updateOrganization = (value) => {
    privateOrganization.value = value;
    emit("change", value);
};

defineExpose({
    clear() {
        autocompleteInput.value.clear();
    },
});
</script>
