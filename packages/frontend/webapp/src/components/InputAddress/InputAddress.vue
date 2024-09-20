<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <BasicAutocomplete
            name="address"
            id="address"
            v-bind="$attrs"
            :fn="searchAddress"
            v-model="address"
            ref="address"
        />
        <!-- @update:modelValue="handleAddress" -->
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>
    </InputWrapper>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
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
// const emit = defineEmits(["update:modelValue"]);
// const address = useFieldValue("address");
// const { value: address, errors } = useField("address");

const { handleChange, errors } = useField("address");
const address = computed({
    get() {
        console.log("Getting value: ", modelValue.value);

        // handleChange(modelValue.value, modelValue.value?.search !== "");
        if (modelValue.value) {
            handleChange(modelValue.value, false);
        }
        return modelValue.value;
    },
    set(value) {
        console.log("Setting value: ", value);
        if (value?.data) {
            // emit("update:modelValue", value);
            console.log("Emitting value: ", value.data);

            handleChange(value, true);
        }
        // emit("update:modelValue", value);
    },
});

// const handleAddress = (value) => {
//     console.log(value);
//     // modelValue.value = value;
//     address.value = value;
// };

// defineExpose({
//     focus: () => {
//         address.value.focus();
//     },
// });
</script>
