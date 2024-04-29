<template>
    <div class="flex items-center">
        <Dropdown right>
            <template v-slot:button="{ isOpen }">
                <Button variant="custom" size="sm" :icon="isOpen ? 'chevron-up' : 'chevron-down'" iconPosition="right"
                    :class="[
                        'px-4 rounded border-1 border-primary whitespace-no-wrap ',
                        isOpen
                            ? 'bg-primary text-white hover:text-white focus:text-white'
                            : 'hover:bg-blue200 hover:text-primary text-primary'
                    ]">{{ title }}
                </Button>
            </template>
            <template v-slot:menu>
                <Menu variant="withoutPadding">
                    <div class="flex flex-col text-sm menuWidth whitespace-nowrap">
                        <Radio v-for="option in options" :key="option.id" :value="option.value" v-model="value" @update:modelValue="testValue"
                            :label="option.label" :name="name" variant="check" />
                    </div>
                </Menu>
            </template>
        </Dropdown>
    </div>
</template>

<script setup>
import { defineProps, toRefs, defineEmits, computed, watch } from "vue";

import Button from './Button.vue';
import Dropdown from './Dropdown.vue';
import Menu from './Menu/Menu.vue';
import Radio from './Input/Radio.vue';

const props = defineProps({
    name: String,
    modelValue: {
        type: String
    },
    options: {
        type: Array,
        default() {
            return [];
        }
    }
});
const { modelValue } = toRefs(props);
const emit = defineEmits(['update:modelValue']);

const title = computed(() => {
    const option = props.options.find(
        option => option.value === modelValue.value
    );

    return option.label;
});
const value = computed({
    get() {
        return modelValue.value;
    },
    set(newValue) {
        emit('update:modelValue', newValue);
    }
});

const testValue = (activeFilter) => {
    console.log("VALUE: ", activeFilter);
    value.value = activeFilter;
    // emit('update:modelValue', value);
};
</script>

<style scoped="true">
.menuWidth {
    min-width: 190px;
}
</style>
