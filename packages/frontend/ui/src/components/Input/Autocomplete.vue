<template>
    <InputWrapper :hasErrors="!!errors.length" :withoutMargin="withoutMargin">
        <Input prefixIcon="magnifying-glass" :suffixIcon="isLoading ? 'spinner' : ''" :withoutMargin="true"
            :spinSuffixIcon="true" :clear="!isLoading" :id="name" v-bind="$attrs" autocomplete="off" @input="onInput"
            :disabled="isDisabled" @blur="onBlur" @keydown.stop="onKeydown" @clear="clear" ref="input">
        <div class="absolute top-10 w-full z-[2000] border-1 border-G300 bg-white" v-if="results.length > 0">
            <div v-if="showCategory" class="flex" v-for="section in results" :key="section.title">
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
import { toRefs, ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useIsSubmitting, useField } from "vee-validate";
import InputWrapper from "./utils/InputWrapper.vue";
import InputError from "./utils/InputError.vue";
import Input from "./Input.vue";
import Icon from "../Icon.vue";
import debounce from "../../utils/debounce";

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

const rawResults = ref([]);
const isLoading = ref(false);
const lastPromise = ref(null);
const isSubmitting = useIsSubmitting();
const { handleChange, errors, validate, value } = useField(name, undefined, {
    ...(modelValue.value ? { initialValue: modelValue } : {}),
});
const input = ref(null);
const selectedItem = ref(value.value ? {
    label: value.value.search,
    data: value.value.data
} : null);
const focusedItemIndex = ref(null);
const error = ref(false);
let lastEvent = undefined;
let callId = 0;
const isDisabled = computed(() => {
    return disabled.value === true || isSubmitting.value === true;
});

watch(modelValue, () => {
    input.value.setValue(modelValue.value?.search || "");
});
watch(value, () => {
    if (value.value === undefined) {
        clear();
    }

    input.value.setValue(value.value?.search || "");
});

let timeout = null;
async function onInput({ target }) {
    const { value } = target;
    rawResults.value = [];
    focusedItemIndex.value = null;

    error.value = false;
    if (value.length < 2) {
        abort();
        return;
    }

    if(lastPromise.value !== null){
        lastPromise.value.catch(() => {
        // ignore
        });
    }
   
    lastPromise.value = debouncedGetResults(value, callId);
}

async function getResults(value, originalCallId) {
    try {
        isLoading.value = true;
        const results = await fn.value(value);

        if (callId === originalCallId) {
            rawResults.value = results;
        }
    } catch (e) {
        error.value = true;
    }

    isLoading.value = false;
    lastPromise.value = null;
}

const debouncedGetResults = debounce(getResults, 300);

function abort() {
    if (lastPromise.value !== null) {
        lastPromise.value.abort();
    }

    callId++;
    isLoading.value = false;
    error.value = false;
    lastPromise.value = null;
}

function onBlur(event) {
    clearTimeout(timeout);
    focusedItemIndex.value = null;

    // un timeout est nécessaire pour éviter que le blur ne fasse disparaître les résultats
    // de recherche juste avant qu'on ait le temps de cliquer dessus
    // (en effet, réinitialiser rawResults provoque la disparaître des résultats)
    timeout = setTimeout(() => {
        rawResults.value = [];
        abort();
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

        input.value.setValue(selectedItem.value.selectedLabel || selectedItem.value.label);
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

    if (autoClear.value === true) {
        clear({ sendEvent: false });
    } else {
        input.value.setValue(item.selectedLabel || item.label);
    }
}

function clear(options = {}) {
    rawResults.value = [];
    selectedItem.value = null;
    abort();

    if (options.sendEvent !== false) {
        handleChange(undefined);
        sendEvent(undefined);
    }

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
    input.value.setValue(value?.value?.search || "");
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
                event.stopPropagation();
                event.preventDefault();
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

defineExpose({
    clear,
    focus() {
        return input.value.focus();
    }
});
</script>
