<template>
    <div>
        <form @submit.prevent>
            <DsfrSearchBar
                placeholder="Recherchez un lieu en saisissant une adresse"
                id="address"
                name="address"
                v-model="searchString"
                @update:modelValue="onInput"
            />
        </form>
        <div class="absolute top-10 w-full z-[2000] border-1 border-G300 bg-white" v-if="rawResults.length > 0">
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
    </div>
</template>

<script setup>
import { toRefs, ref, computed, onMounted } from "vue";
import debounce from "../../utils/debounce";

const props = defineProps({
    name: String,
    fn: Function,
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
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
});
const emit = defineEmits(['update:modelValue']);
const { fn, name, allowFreeSearch, showCategory, modelValue, disabled, autoClear } = toRefs(props);

const rawResults = ref([]);
const searchString = ref(null)
const lastPromise = ref(null);
const isLoading = ref(false);
const selectedItem = ref(null);
const focusedItemIndex = ref(null);
const error = ref(false);
let callId = 0;
let lastEvent = undefined;

const address = computed(() => {
    return modelValue.value?.search || "";
})

onMounted(() => {
    searchString.value = modelValue.value?.search || "";
});

const abort = () => {
    if (lastPromise.value !== null) {
        lastPromise.value.abort();
    }

    callId++;
    isLoading.value = false;
    error.value = false;
    lastPromise.value = null;
}

const onInput = async(value) => {
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

const getResults = async (value, originalCallId) => {
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

const selectItem = (item) => {
    rawResults.value = [];
    isLoading.value = false;
    lastPromise.value = null;
    selectedItem.value = item;
    
    sendEvent({
        search: item.selectedLabel || item.label,
        data: item.data
    });

    if (autoClear.value === true) {
        clear({ sendEvent: false });
    } else {
        address.value = item.selectedLabel || item.label;
        searchString.value = item.selectedLabel || item.label;
    }
}

const sendEvent = (data) => {
    if (data !== undefined && lastEvent?.search === data.search && lastEvent?.data === data.data) {
        return;
    }

    emit("update:modelValue", data);
    lastEvent = { ...data };
};

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
