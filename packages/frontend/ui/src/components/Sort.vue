<template>
    <div class="flex items-center">
        <Dropdown>
            <template v-slot:button="{ isOpen }">
                <Button variant="custom" size="sm" :icon="isOpen ? 'chevron-up' : 'chevron-down'" iconPosition="right"
                    :class="[
                        'px-4 rounded focus:outline-none border-1 border-primary whitespace-no-wrap ',
                        isOpen
                            ? 'bg-primary text-white hover:text-white focus:text-white'
                            : 'hover:bg-blue200 hover:text-primary text-primary'
                    ]">{{ title }}
                </Button>
            </template>
            <template v-slot:menu>
                <Menu containerClasses="py-0">
                    <div v-for="option in options" :key="option.id"
                        class="flex items-center whitespace-no-wrap text-sm menuWidth">
                        <Radio :checkValue="option.value" v-model="modelValue"
                            @input="$emit('update:modelValue', $event)" variant="invisible" containerClasses="w-full"
                            labelClasses="w-full block" v-slot="{ isChecked }">
                            <div
                                class="flex items-center justify-between w-full hover:bg-blue200 py-2 px-3 text-primary">
                                <div class="flex-1">{{ option.label }}</div>
                                <div class="ml-4" v-if="isChecked">
                                    <Icon icon="check" />
                                </div>
                            </div>
                        </Radio>
                    </div>
                </Menu>
            </template>
        </Dropdown>
    </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

import Button from './Button.vue';
import Dropdown from './Dropdown.vue';
import Icon from './Icon.vue';
import Menu from './Menu/Menu.vue';
import Radio from './Input/Radio.vue';

const props = defineProps({
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

const title = computed(() => {
    const option = props.options.find(
        option => option.value === props.modelValue
    );

    return option.label;
});
</script>

<style scoped="true">
.menuWidth {
    min-width: 190px;
}
</style>
