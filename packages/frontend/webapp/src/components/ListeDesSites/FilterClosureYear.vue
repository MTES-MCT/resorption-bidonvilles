<template>
    <Dropdown>
        <template v-slot:button="{ isOpen }">
            <Button
                variant="custom"
                size="sm"
                :icon="isOpen ? 'chevron-up' : 'chevron-down'"
                iconPosition="right"
                :class="[
                    'px-4 rounded !border-1 !border-primary whitespace-nowrap',
                    isOpen || selectedYear
                        ? 'bg-primary text-white hover:text-white focus:text-white'
                        : 'hover:bg-blue200 hover:text-primary text-primary',
                    focusClasses.ring,
                ]"
            >
                <p class="flex items-center justify-between space-x-2 text-sm">
                    <span
                        class="block w-4 h-4 bg-white text-primary text-center leading-4 rounded-full"
                        v-if="selectedYear"
                    >
                        1
                    </span>
                    <span>{{ title }}</span>
                </p>
            </Button>
        </template>
        <template v-slot:menu>
            <Menu containerClasses="py-0">
                <div
                    v-for="option in paginatedOptions"
                    :key="option.value"
                    class="flex items-center whitespace-nowrap text-sm menuWidth"
                >
                    <span
                        v-if="option.type === 'label'"
                        class="text-sm font-bold w-full pt-2 pb-0 pl-3 bg-white text-G600 cursor-pointer disabled"
                    >
                        {{ option.label }}
                    </span>
                    <Checkbox
                        v-else
                        :disabled="disabled"
                        :model-value="internalSelection === option.value"
                        @update:modelValue="
                            (value) => toggleYear(option.value, value)
                        "
                        variant="invisible"
                        :lineOffset="option.lineOffset"
                        :label="option.label"
                        direction="col"
                    >
                    </Checkbox>
                </div>

                <div class="border-t-1 py-1 hover:!bg-blue200">
                    <Button
                        size="sm"
                        variant="custom"
                        class="flex items-center whitespace-nowrap text-sm menuWidth pl-3 text-primary focusClasses.ring"
                        @click="clear"
                    >
                        Effacer
                    </Button>
                </div>
                <div class="px-3 py-2 mt-2">
                    <DsfrPagination
                        v-if="totalPages > 1"
                        v-model:current-page="currentPage"
                        :pages="pages"
                        nextPageTitle="Suivante"
                        prevPageTitle="Précédente"
                        :truncLimit="1"
                        small
                    />
                </div>
            </Menu>
        </template>
    </Dropdown>
</template>

<style scoped>
.menuWidth {
    min-width: 480px;
}
</style>

<script setup>
import { defineProps, toRefs, computed, defineEmits, ref, watch } from "vue";
import focusClasses from "@common/utils/focus_classes";
import { Button, Dropdown, Menu } from "@resorptionbidonvilles/ui";
import Checkbox from "@resorptionbidonvilles/ui/src/components/Input/CheckboxUi.vue";

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        default() {
            return [];
        },
    },
    modelValue: {
        type: Array,
        default() {
            return [];
        },
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue", "checkedItem"]);

const { title, options, modelValue, disabled } = toRefs(props);
const currentPage = ref(0);
const itemsPerPage = 5;

const internalSelection = ref(modelValue.value[0] ?? null);
const selectedYear = computed(() => internalSelection.value);

const totalPages = computed(() => {
    return Math.ceil(options.value.length / itemsPerPage);
});

const pages = computed(() => {
    const results = [];
    for (let i = 1; i <= totalPages.value; i++) {
        results.push({
            title: `${i}`,
            href: `#page-${i}`,
            label: i,
        });
    }
    return results;
});

const paginatedOptions = computed(() => {
    const start = currentPage.value * itemsPerPage;
    const end = start + itemsPerPage;
    return options.value.slice(start, end);
});

watch(
    modelValue,
    () => {
        const nextValue = modelValue.value[0] ?? null;
        if (nextValue !== internalSelection.value) {
            setSelection(nextValue, false);
        }
    },
    { immediate: true }
);

watch(
    options,
    () => {
        if (
            internalSelection.value &&
            !options.value.some(
                (option) => option.value === internalSelection.value
            )
        ) {
            setSelection(null);
        }
    },
    { deep: true }
);

function clear() {
    setSelection(null);
}

function toggleYear(optionValue, isChecked) {
    const nextValue = isChecked ? optionValue : null;
    setSelection(nextValue);
}

function setSelection(nextValue, shouldEmit = true) {
    if (internalSelection.value === nextValue) {
        return;
    }

    internalSelection.value = nextValue;
    if (!shouldEmit) {
        return;
    }

    const payload = nextValue ? [nextValue] : [];
    emit("update:modelValue", payload);
    emit("checkedItem", payload);
}
</script>
