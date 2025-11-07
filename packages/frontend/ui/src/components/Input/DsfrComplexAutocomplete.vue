<template>
    <div class="relative">
    <DsfrInputGroup
        :descriptionId=name
        :errorMessage="errors.length > 0 ? errors : ''"
        :disabled="isDisabled"
        type="text"
        required
    >
        <template #before-input>
            <span class="font-bold not-italic" aria-hidden="true">{{ label }}</span>
            <span v-if="hint" class="fr-hint-text block mb-1">{{ hint }}</span>
        </template>
        <template #default>
            <div class="relative flex flex-row gap-0">
                <DsfrButton
                    icon-only
                    tertiary
                    no-outline
                    disabled
                    size="md"
                    icon="fr-icon-search-line"
                    class="absolute left-0 top-2 !cursor-default"
                />
                <DsfrInput 
                    :placeholder="placeholder"
                    ref="input"
                    v-model="organizationSearchLabel"
                    @input="onInput"
                    @focus="onFocus"
                    @blur="onBlur"
                    :disabled="isDisabled"
                    @keydown.stop="onKeydown"
                    @clear="clear"
                    class="pl-10"
                />
                <DsfrButton
                    v-if="isLoading || organizationSearchLabel?.length > 2"
                    :label="!isLoading ? 'Vider' : ''"
                    tertiary
                    no-outline
                    size="sm"
                    :icon="isLoading ? { name: 'fa-solid:spinner', animation: 'spin' } : 'fr-icon-delete-line'"
                    class="absolute right-0 top-2 pt-2"
                    @click.prevent="clear"
                />
                
            </div>
        </template>
    </DsfrInputGroup>
        <div class="absolute top-16 mt-2 w-full z-[2000] border-1 border-G300 bg-white" v-if="results.length > 0">
            <div v-if="showCategory" class="flex flex-col">
                <div v-for="section in paginatedResults" :key="section.title" class="flex">
                    <div class="w-40 px-3 py-2 text-right text-sm text-G700 border-r border-G200 border-b">
                    {{ section.title }}
                    </div>
                    <div class="border-b border-G200 flex-1">
                        <div v-for="item in section.items" class="hover:bg-blue100 cursor-pointer px-3 py-2"
                            :class="focusedItemId === item.id ? 'bg-blue100' : ''"
                            :key="item.id" @click="selectItem(item)"
                            :title="item.name">
                            {{ item.label }}
                        </div>
                    </div>
                </div>
                <div class="flex justify-center items-center gap-2 pt-4 h-9 border-t border-G200"
                    @mousedown.prevent.stop="isClickInsideDropdown = true"
                    @mouseup="isClickInsideDropdown = false"
                    @mouseleave="isClickInsideDropdown = false"
                    v-if="totalPages > 1"
                >
                <DsfrPagination
                    
                    v-model:current-page="currentPage"
                    :pages="pages"
                    :truncLimit="2"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRefs, ref, computed, onBeforeUnmount, watch } from "vue";
import debounce from "../../utils/debounce";
import { useIsSubmitting } from "vee-validate";

const props = defineProps({
    name: String,
    fn: Function,
    errors: {
        type: [Array, String],
        required: false,
        default: () => []
    },
    hint: {
        type: String,
        required: false,
        default: ""
    },
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined
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
    placeholder: {
        type: String,
        required: false,
        default: ""
    },
    label: {
        type: String,
        required: false,
        default: ""
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
});
const emit = defineEmits(['update:modelValue']);
const { fn, name, allowFreeSearch, showCategory, modelValue, errors, placeholder, label, disabled, autoClear } = toRefs(props);

const rawResults = ref([]);
const isLoading = ref(false);
const lastPromise = ref(null);
const input = ref(null);
const selectedItem = ref(null);
const focusedItemIndex = ref(null);
const error = ref(false);
const currentPage = ref(0);
const isClickInsideDropdown = ref(false);
const itemsPerPage = 10;
let lastEvent;
let callId = 0;

const isSubmitting = useIsSubmitting();

// const organizationSearchLabel = computed(() => modelValue.value?.search || "");
const organizationSearchLabel = ref(modelValue.value?.search || "");

const totalPages = computed(() => {
    return Math.ceil(flatResults.value.length / itemsPerPage);
});

const pages = computed(() => {
    let results = [];

    for(let i = 1; i < totalPages.value + 1; i++) {
        results.push({
            title: `${i}`,
            href: `${i}`,
            label: i,
        });
    }
    return results;
});

const flatResults = computed(() => {
    if (showCategory.value) {
        return results.value.flatMap(r => r.items);
    }
    return rawResults.value;
});

const paginatedResults = computed(() => {
    const start = (currentPage.value) * itemsPerPage;
    const end = start + itemsPerPage;

    if (showCategory.value) {
        const categorizedItems = results.value.flatMap(section =>
            section.items.map(item => ({ ...item, categoryTitle: section.title }))
        );

        const pageItems = categorizedItems.slice(start, end);

        const grouped = {};
        for (const item of pageItems) {
            if (!grouped[item.categoryTitle]) {
                grouped[item.categoryTitle] = {
                    title: item.categoryTitle,
                    items: [],
                };
            }
            grouped[item.categoryTitle].items.push(item);
        }
        grouped[""] = {
            title: "",
            items: [
                {
                    id: "autre",
                    selectedLabel: "",
                    label: "Je ne trouve pas ma structure",
                    category: "",
                    data: null,
                }
            ]
        };

        return Object.values(grouped);
    } else {
        return flatResults.value.slice(start, end);
    }
});

const isDisabled = computed(() => {
    return disabled.value === true || isSubmitting.value === true;
});

let timeout = null;
async function onInput({ target }) {
    const { value } = target;

    if (selectedItem.value !== null) {
        selectedItem.value = null;
        target.value = "";
        emit("update:modelValue", undefined);
        return;
    }

    currentPage.value = 0;
    rawResults.value = [];
    focusedItemIndex.value = null;
    error.value = false;

    if (value.length < 2) {
        abort();
        return;
    }

    if (lastPromise.value !== null) {
        lastPromise.value.catch(() => {
        // ignore
        });
    }

    lastPromise.value = debouncedGetResults(value, callId);
}


function onFocus(event) {
    const value = event.target.value;
    if (
        value &&
        value.length >= 2 &&
        rawResults.value.length === 0 
    ) {
        currentPage.value = 0;
        debouncedGetResults(value, callId);
    }
}

async function getResults(value, originalCallId) {
    try {
        isLoading.value = true;
        const results = await fn.value(value);

        if (callId === originalCallId) {
            rawResults.value = results;
        }
    } catch (e) {
        //eslint-disable-next-line no-console
        console.error(e);
        errors.value.push("Le chargement des données a échoué");
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
    if (isClickInsideDropdown.value) {
        isClickInsideDropdown.value = false;
        return;
    }

    focusedItemIndex.value = null;
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

            if (event.target.value.length > 0) {
                return;
            }

            emit("update:modelValue", undefined);
            return;
        }

        if (selectedItem.value.label === event.target.value) {
            return;
        }

        if (allowFreeSearch.value === true) {
            selectedItem.value = null;

            sendEvent({
                search: event.target.value,
                data: undefined
            });
        }
    }, 200); // délai pour permettre les clics
}


function selectItem(item) {
    rawResults.value = [];
    isLoading.value = false;
    lastPromise.value = null;
    selectedItem.value = item;

    if (autoClear.value === true) {
        clear({ sendEvent: false });
    }
    sendEvent({
        search: item.selectedLabel || item.label,
        data: item.data
    });
}

function clear(options = {}) {    
    rawResults.value = [];
    selectedItem.value = null;
    organizationSearchLabel.value = null;
    abort();
    sendEvent(undefined);
}

function sendEvent(data) {
    if (data !== undefined && lastEvent?.search === data?.search && lastEvent?.data === data?.data) {
        return;
    }

    emit("update:modelValue", data);
    lastEvent = { ...data };
}

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

    return results.value.flatMap(({ items }) => items)[focusedItemIndex.value].id;
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

watch(() => modelValue.value,
    (value) => {
        organizationSearchLabel.value = value?.search ?? "";
    },
    { immediate: true },
);

defineExpose({
    clear,
    focus() {
        return input.value.focus();
    }
});
</script>
