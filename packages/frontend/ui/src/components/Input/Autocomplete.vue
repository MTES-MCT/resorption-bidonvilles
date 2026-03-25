<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <Input prefixIcon="magnifying-glass" :suffixIcon="isLoading ? 'spinner' : ''" :withoutMargin="true"
            :spinSuffixIcon="true" :clear="!isLoading" :id="name" v-bind="$attrs" autocomplete="off" @input="onInput"
            :disabled="isDisabled" @blur="onBlur" @keydown.stop="onKeydown" @clear="clear" ref="input" class="-top-1">
        <div class="absolute top-10 w-full z-[2000] border-1 border-G300 bg-white" v-if="results.length > 0">
            <div v-if="showCategory" class="flex" v-for="section in results" :key="section.title">
                <div class="w-40 px-3 py-2 text-right text-sm text-G700 border-r border-G200 border-b">
                    {{ section.title }}
                </div>
                <div class="border-b border-G200 flex-1">
                    <div v-for="item in section.items" class="hover:bg-blue100 cursor-pointer px-3 py-2"
                        :class="focusedItemId === item.id ? 'bg-blue100' : ''" :key="item.id" @click="selectItem(item)">
                        {{ item.label }}
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="border-b border-G200 flex-1">
                    <div v-for="item in rawResults" class="hover:bg-blue100 cursor-pointer px-3 py-2"
                        :class="focusedItemId === item.id ? 'bg-blue100' : ''" :key="item.id" @click="selectItem(item)">
                        {{ item.label }}
                    </div>
                </div>
            </div>
        </div>
        </Input>
        <InputError v-if="errors.length">{{ errors[0] }}</InputError>

        <p v-if="error" class="text-secondary mb-5 text-right">
            <Icon icon="triangle-exclamation" /> Le chargement des données a échoué
        </p>
    </InputWrapper>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { useForm, useIsSubmitting, useField } from "vee-validate";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import Input from "./Input.vue";
import Icon from "../Icon.vue";
import useAutocomplete from "../../composables/useAutocomplete";

const props = defineProps({
    name: String,
    fn: Function,
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined
    },
    withoutMargin: {
        type: Boolean,
        required: false,
        default: false
    },
    allowFreeSearch: {
        type: Boolean,
        required: false,
        default: false
    },
    autoClear: {
        type: Boolean,
        required: false,
        default: false,
    },
    showCategory: {
        type: Boolean,
        required: false,
        default: false
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
});
const emit = defineEmits(['update:modelValue']);
const { fn, name, withoutMargin, allowFreeSearch, showCategory, modelValue, disabled, autoClear } = toRefs(props);

const form = useForm();
const isSubmitting = form ? useIsSubmitting() : false;

const { handleChange, errors, validate, value } = useField(name, undefined, {
    ...(modelValue.value ? { initialValue: modelValue } : {}),
});

const input = ref(null);

const {
    rawResults,
    results,
    isLoading,
    focusedItemId,
    error,
    onInput,
    onBlur,
    onKeydown,
    selectItem,
    clear,
} = useAutocomplete({
    fn,
    modelValue,
    allowFreeSearch,
    autoClear,
    showCategory,
    emit,
    fieldContext: { handleChange, errors, validate, value },
    inputAdapter: {
        setValue: (val = "") => input.value?.setValue?.(val ?? ""),
        blur: () => input.value?.blur?.(),
        focus: () => input.value?.focus?.(),
        getValue: () => input.value?.$refs?.input?.value ?? "",
    },
});

const isDisabled = computed(() => disabled.value === true || isSubmitting.value === true);

defineExpose({
    clear,
    focus() {
        return input.value?.focus?.();
    }
});
</script>