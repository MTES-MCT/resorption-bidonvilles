<template>
    <Dropdown>
        <template v-slot:button="{ isOpen }">
            <Button variant="custom" size="sm" :icon="isOpen ? 'chevron-up' : 'chevron-down'" iconPosition="right" :class="[
                'px-4 rounded border-1 border-primary whitespace-nowrap',
                isOpen || checkedIds.length > 0
                    ? 'bg-primary text-white hover:text-white focus:text-white'
                    : 'hover:bg-blue200 hover:text-primary text-primary',
                focusClasses.ring,
            ]">
                <p class="flex items-center justify-between space-x-2">
                    <span class="block w-4 h-4 bg-white text-primary text-center leading-4 rounded-full"
                        v-if="checkedIds.length">{{
                            checkedIds.length
                        }}</span>
                    <span>{{
                        title
                    }}</span>
                </p>
            </Button>
        </template>
        <template v-slot:menu>
            <Menu containerClasses="py-0">
                <div v-for="option in options" :key="option.id"
                    class="flex items-center whitespace-nowrap text-sm menuWidth">
                    <Checkbox :disabled="disabled" v-model="checked[option.value]" variant="invisible" :label="option.label"
                        direction="col">
                    </Checkbox>
                </div>

                <div class="border-t-1">
                    <Button 
                        size="sm"
                        variant="custom" 
                        class="flex items-center whitespace-nowrap text-sm menuWidth hover:bg-blue200 hover:text-primary text-primary focusClasses.ring"
                        @click="clear">
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
import focusClasses from "../../../common/utils/focus_classes";
import Button from "./Button.vue";
import Checkbox from "./Input/CheckboxUi.vue";
import Dropdown from "./Dropdown.vue";
import Menu from "./Menu/Menu.vue";
import isDeepEqual from "../utils/isDeepEqual";

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
const emit = defineEmits(['update:modelValue', 'checkedItem']);

const { title, options, modelValue, disabled } = toRefs(props);
const checked = ref(computeChecked());
const checkedIds = computed(() => {
    return Object.keys(checked.value).filter(key => checked.value[key] === true);
});
watch(checkedIds, () => {
    emit('update:modelValue', checkedIds.value);
    emit('checkedItem', checkedIds.value);
});

watch(modelValue, () => {
    const checkedTest = computeChecked();
    if (!isDeepEqual(checkedTest, checked.value)) {
        checked.value = checkedTest;
    }
});

function clear() {
    Object.keys(checked.value).forEach(key => checked.value[key] = false);
}

function computeChecked() {
    return options.value.reduce((acc, option) => {
        acc[option.value] = modelValue.value.includes(option.value);
        return acc;
    }, {});
}
</script>
