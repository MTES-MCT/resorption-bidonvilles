<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <BasicAutocomplete
            name="address"
            id="address"
            v-bind="$attrs"
            :fn="searchAddress"
            ref="address"
        />
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { toRefs, computed } from "vue";
import {
    BasicAutocomplete,
    InputWrapper,
    InputError,
} from "@resorptionbidonvilles/ui";
import { searchAddress } from "@/api/datagouv.api.js";
import { useField } from "vee-validate";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined,
    },
    withoutMargin: {
        type: Boolean,
        default: false,
    },
});
const { modelValue, withoutMargin } = toRefs(props);

const { handleChange, errors } = useField("address");
const address = computed({
    get() {
        if (modelValue.value) {
            handleChange(modelValue.value, false);
        }
        return modelValue.value;
    },
    set(value) {
        if (value?.data) {
            handleChange(value, true);
        }
    },
});
</script>
