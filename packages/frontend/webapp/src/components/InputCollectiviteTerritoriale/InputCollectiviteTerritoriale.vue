<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <BasicAutocomplete
            name="territorial_collectivity"
            id="territorial_collectivity"
            v-bind="$attrs"
            :fn="autocompleteFn"
            v-model="organization"
            ref="autocomplete"
            @update:modelValue="updateOrganization"
        />
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { toRefs, computed, ref } from "vue";
import {
    BasicAutocomplete,
    InputWrapper,
    InputError,
} from "@resorptionbidonvilles/ui";
import { autocompleteTerritorialCollectivity } from "@/api/organizations.api.js";
import { useField } from "vee-validate";

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
const { handleChange, errors } = useField("territorial_collectivity");
const autocomplete = ref(null);

const organization = computed({
    get() {
        handleChange(modelValue.value, modelValue.value.search !== "");
        return modelValue.value;
    },
    set(value) {
        handleChange(value, true);
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

const updateOrganization = (value) => {
    organization.value = value;
};

defineExpose({
    focus: () => {
        autocomplete.value.focus();
    },
});
</script>
