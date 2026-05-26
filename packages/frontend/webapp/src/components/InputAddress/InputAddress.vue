<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <DsfrAutocomplete
            :id="name"
            :fn="searchAddress"
            v-bind="$attrs"
            v-model="selectedItem"
            ref="address"
        />
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { ref, toRefs, computed, watch } from "vue";
import {
    DsfrAutocomplete,
    InputWrapper,
    InputError,
} from "@resorptionbidonvilles/ui";
import { searchAddress } from "@/api/datagouv.api.js";
import { useFormErrors } from "vee-validate";

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
    name: {
        type: String,
        required: true,
    },
});
const emit = defineEmits(["update:modelValue"]);
const { modelValue, withoutMargin, name } = toRefs(props);
const formErrors = useFormErrors();
const errors = computed(() => {
    const fieldError = formErrors.value[name.value];
    return fieldError ? [fieldError] : [];
});
const address = ref(null);

const selectedItem = computed({
    set(value) {
        emit("update:modelValue", value);
    },
    get() {
        return modelValue.value;
    },
});

watch(modelValue, (newValue) => {
    if (newValue) {
        address.value = newValue;
    }
});
</script>
