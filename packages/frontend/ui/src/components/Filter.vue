<template>
    <Dropdown>
        <template v-slot:button="{ isOpen }">
            <Button variant="custom" size="sm" :icon="isOpen ? 'chevron-up' : 'chevron-down'" iconPosition="right"
                :class="[
                    'px-4 rounded focus:outline-none border-1 border-primary whitespace-nowrap',
                    isOpen
                        ? 'bg-primary text-white hover:text-white focus:text-white'
                        : 'hover:bg-blue200 hover:text-primary text-primary',
                ]">{{ titleWithActiveFilters }}</Button>
        </template>
        <template v-slot:menu>
            <Menu containerClasses="py-0">
                <div v-for="option in options" :key="option.id"
                    class="flex items-center whitespace-nowrap text-sm menuWidth">
                    <Checkbox :disabled="disabled" v-model="checked[option.value]" variant="invisible"
                        v-slot="{ checked }" direction="col">
                        <div class="flex items-center justify-between w-full hover:bg-blue200 py-2 px-3 text-primary">
                            <slot :label="option.label">
                                <div class="flex-1">{{ option.label }}</div>
                            </slot>

                            <div class="ml-4" v-if="checked">
                                <Icon icon="check" />
                            </div>
                        </div>
                    </Checkbox>
                </div>

                <div class="px-1 py-1 border-t-1">
                    <Button size="sm" variant="primaryText" @click="clear" class="hover:underline">
                        Effacer
                    </Button>
                </div>
            </Menu>
        </template>
    </Dropdown>
</template>

<style scoped>
.menuWidth {
    min-width: 220px;
}
</style>

<script setup>
import { defineProps, toRefs, computed, defineEmits, ref, watch } from "vue";
import Button from "./Button.vue";
import Checkbox from "./Input/CheckboxUi.vue";
import Dropdown from "./Dropdown.vue";
import Icon from "./Icon.vue";
import Menu from "./Menu/Menu.vue";

const props = defineProps({
    title: {
        type: String,
    },
    options: {
        type: Array,
    },
    modelValue: {
        type: Array,
        default() {
            return [];
        }
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const emit = defineEmits(['update:modelValue', 'checkedFilter']);

const { title, options, modelValue, disabled } = toRefs(props);
const checked = ref(
    options.value.reduce((acc, option) => {
        acc[option.value] = modelValue.value.includes(option.value);
        return acc;
    }, {}),
);
const checkedIds = computed(() => {
    return Object.keys(checked.value).filter(key => checked.value[key] === true);
});
watch(checkedIds, () => {
    emit('update:modelValue', checkedIds.value);
    emit('checkedItem', checkedIds.value);
});

const titleWithActiveFilters = computed(() => {
    if (!checkedIds.length) {
        return title.value;
    }

    return `${title.value} (${checkedIds.length})`;
});

function clear() {
    Object.keys(checked.value).forEach(key => checked.value[key] = false);
}
</script>
