<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <BasicAutocompletePage
            name="organisation"
            id="organisation"
            :label="label"
            placeholder="Nom ou acronyme de votre organisation"
            :fn="autocompleteFn"
            :v-model="organisation"
            showCategory
            ref="autocompleteInput"
            showMandatoryStar
            @update:modelValue="updateOrganization"
        />
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import {
    BasicAutocompletePage,
    InputError,
    InputWrapper,
} from "@resorptionbidonvilles/ui";
import { autocompleOrganization } from "@/api/organizations.api.js";
import { useField } from "vee-validate";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => {},
    },
});
const { modelValue } = toRefs(props);

const { handleChange, errors } = useField("organisation");

const autocompleteInput = ref(null);
const emit = defineEmits(["update:modelValue", "change"]);
const organisation = computed({
    get() {
        handleChange(modelValue.value, false);
        return modelValue.value;
    },
    set(value) {
        handleChange(value, true);
    },
});

async function autocompleteFn(value) {
    const results = await autocompleOrganization(value);
    const mappedResults = results.map((org) => ({
        id: org.id,
        label: `${org.abbreviation ? `${org.abbreviation} — ` : ""}${org.label}`,
        selectedLabel: `${org.abbreviation ? `${org.abbreviation} — ` : ""}${org.label}`,
        category: org.type_abbreviation || org.type,
        data: {
            id: org.id,
            category: org.category,
        },
    }));
    mappedResults.unshift({
        id: "autre",
        selectedLabel: "",
        label: "Je ne trouve pas mon organisation ou mon territoire",
        category: "",
        data: null,
    });

    return mappedResults;
}

const updateOrganization = (value) => {
    organisation.value = value;
    emit("change", value);
};

defineExpose({
    clear() {
        autocompleteInput.value.clear();
    },
});
</script>
