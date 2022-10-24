<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <Input prefixIcon="magnifying-glass" :suffixIcon="isLoading ? 'spinner' : ''" :withoutMargin="true"
            :spinSuffixIcon="true" :clear="!isLoading" :id="name" v-bind="$attrs" autocomplete="off" @input="onInput"
            @blur="onBlur" @keydown="onKeydown" @clear="clear" ref="input">
        <div class="absolute top-10 w-full z-10 border-1 border-G300 bg-white" v-if="results.length > 0">
            <div class="flex" v-for="section in results" :key="section.title">
                <div class="w-40 px-3 py-2 text-right text-sm text-G600 border-r border-G200 border-b">
                    {{ section.title }}
                </div>
                <div class="border-b border-G200 flex-1">
                    <div v-for="item in section.items" class="hover:bg-blue100 cursor-pointer px-3 py-2"
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
import { defineProps, toRefs, ref, computed, onMounted, onBeforeUnmount, defineEmits, watch } from "vue";
import { useField } from "vee-validate";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import Input from "./Input.vue";
import Icon from "../Icon.vue";

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
    }
});
const emit = defineEmits(['update:modelValue']);
const { fn, name, withoutMargin, allowFreeSearch, modelValue } = toRefs(props);

const rawResults = ref([]);
const isLoading = ref(false);
const lastPromise = ref(null);
const { handleChange, errors, validate } = useField(name, undefined, {
    initialValue: modelValue,
    valueProp: modelValue
});
const input = ref(null);
const selectedItem = ref(modelValue.value ? {
    label: modelValue.value.search,
    data: modelValue.value.data
} : null);
const focusedItemIndex = ref(null);
const error = ref(false);
let lastEvent = undefined;

watch(modelValue, () => {
    input.value.setValue(modelValue?.value?.search || "");
});

let timeout = null;
async function onInput({ target }) {
    const { value } = target;
    rawResults.value = [];
    focusedItemIndex.value = null;

    error.value = false;
    if (value.length < 2) {
        isLoading.value = false;
        return;
    }

    let promise;
    try {
        isLoading.value = true;
        promise = fn.value(value);
        lastPromise.value = promise;
        const resultsTmp = await promise;
        if (lastPromise.value === promise) {
            rawResults.value = resultsTmp;
        }
    } catch (e) {
        if (lastPromise.value === promise) {
            error.value = true;
        }
    }

    if (lastPromise.value === promise) {
        isLoading.value = false;
    }
}

function onBlur(event) {
    clearTimeout(timeout);
    focusedItemIndex.value = null;

    // un timeout est nécessaire pour éviter que le blur ne fasse disparaître les résultats
    // de recherche juste avant qu'on ait le temps de cliquer dessus
    // (en effet, réinitialiser rawResults provoque la disparaître des résultats)
    timeout = setTimeout(() => {
        rawResults.value = [];
        isLoading.value = false;
        error.value = false;
        lastPromise.value = null;
        if (selectedItem.value === null) {
            if (allowFreeSearch.value === true) {
                sendEvent({
                    search: event.target.value,
                    data: undefined
                });
                return;
            }

            input.value.setValue("");
            return;
        }

        if (selectedItem.value.label === event.target.value) {
            return;
        }

        if (allowFreeSearch.value === true) {
            selectedItem.value = null;
            handleChange({
                search: event.target.value,
                data: undefined
            });
            sendEvent({
                search: event.target.value,
                data: undefined
            });
            return;
        }

        input.value.setValue(selectedItem.value.label);
    }, 250);
    validate();
}

function selectItem(item) {
    rawResults.value = [];
    isLoading.value = false;
    lastPromise.value = null;
    selectedItem.value = item;
    handleChange({
        search: item.label,
        data: item.data
    });
    sendEvent({
        search: item.label,
        data: item.data
    });
    input.value.setValue(item.label);
}

function clear() {
    rawResults.value = [];
    isLoading.value = false;
    lastPromise.value = null;
    selectedItem.value = null;
    handleChange(undefined);
    sendEvent(undefined);
    input.value.setValue("");
}

function sendEvent(data) {
    if (data !== undefined && lastEvent?.search === data.search && lastEvent?.data === data.data) {
        return;
    }

    emit("update:modelValue", data);
    lastEvent = { ...data };
}

onMounted(() => {
    input.value.setValue(modelValue?.value?.search || "");
});

onBeforeUnmount(() => {
    clearTimeout(timeout);
});

function onKeydown(event) {
    const keys = {
        [38]: () => focusPreviousItem(event),
        [40]: () => focusNextItem(event),
        [13]: () => {
            if (focusedItemIndex.value !== null) {
                selectItem(rawResults.value[focusedItemIndex.value]);
                input.value.blur();
            } else if (allowFreeSearch.value === true) {
                input.value.blur();
            }
        },
    };

    const handler = keys[event.keyCode];
    if (handler) {
        handler();
    }
}

function focusPreviousItem(event) {
    if (rawResults.value.length === 0 || focusedItemIndex.value === null) {
        return;
    }

    event.preventDefault();
    if (focusedItemIndex.value === 0) {
        focusedItemIndex.value = null;
    } else {
        focusedItemIndex.value -= 1;
    }
}

function focusNextItem(event) {
    if (rawResults.value.length === 0) {
        return;
    }

    event.preventDefault();
    if (focusedItemIndex.value === null) {
        focusedItemIndex.value = 0;
        return;
    }

    focusedItemIndex.value = Math.min(rawResults.value.length - 1, focusedItemIndex.value + 1);
}

const focusedItemId = computed(() => {
    if (focusedItemIndex.value === null) {
        return;
    }

    return results.value.map(({ items }) => items).flat()[focusedItemIndex.value].id;
});

const results = computed(() => {
    const categories = {};
    return rawResults.value.reduce((acc, item) => {
        const { category } = item;

        if (!categories[category]) {
            categories[category] = {
                title: category,
                items: [],
            };
            acc.push(categories[category]);
        }

        categories[category].items.push(item);
        return acc;
    }, []);
});
</script>
