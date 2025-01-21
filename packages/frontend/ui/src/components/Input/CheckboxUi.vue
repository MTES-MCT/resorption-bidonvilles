<template>
    <template v-if="variant === 'checkbox'">
        <label :class="labelClass" class="flex cursor-pointer">
            <input v-if="active" :id="`variant-checkbox-${randomId()}`" ref="checkbox" @click="onChange(value)"
                class="inline-block rounded mr-2 text-center" type="checkbox" :checked="checked" :disabled="disabled" />
            <div v-else>
                <Icon v-if="checked" class="text-tertiaryA11Y font-bold text-md" icon="fa-solid fa-check" />
                <Icon v-else class="text-redA11Y font-bold text-md" icon="fa-solid fa-xmark" />
            </div>
            {{ label }}
        </label>
    </template>
    <template v-else-if="variant === 'invisible'">
        <div class="flex items-center justify-between w-full hover:bg-blue200 px-3 text-primary">
            <label class="flex items-center justify-between w-full hover:bg-blue200 py-2 pr-4 text-primary cursor-pointer">
                <input :id="`variant-invisible-${randomId()}`" ref="checkbox" @click="onChange(value)" class="appearance-none"
                    type="checkbox" :checked="checked" :disabled="disabled" />
                <div :class="['flex-1 ', lineOffset && 'pl-2']">
                    {{ label }}
                </div>
                <div class="ml-4">
                    <Icon v-if="checked" class="text-primary font-bold text-md" icon="fa-solid fa-check" />
                </div>
            </label>
        </div>
    </template>

    <template v-else-if="variant === 'toggle'">
        <div role="button" class="mb-1">
            <label v-if="checked" class="flex space-x-2 items-center shrink-0">
                <p
                    class="rounded-2xl w-11 h-6 flex shrink-0 items-center px-px border border-primary justify-end bg-primary cursor-pointer">
                    <input :id="`variant-toggle-${randomId()}`" @click="onChange(value)" class="appearance-none" type="checkbox"
                        :checked="checked" :disabled="disabled" />
                    <span class="absolute rounded-full bg-white inline-block text-center text-sm text-primary h-5 w-5">
                        <span class="inline-block">
                            <i class="fa-solid fa-check" aria-hidden="false"></i>
                        </span>
                    </span>
                </p>
                <p>
                    {{ label }}
                </p>
            </label>
            <label v-else class="flex space-x-2 items-center shrink-0">
                <p class="rounded-2xl w-11 h-6 flex shrink-0 items-center px-px border border-primary justify-start cursor-pointer">
                    <input :id="`variant-toggle-${randomId()}`" @click="onChange(value)" class="appearance-none" type="checkbox"
                        :checked="checked" :disabled="disabled" />
                    <span
                        class="absolute rounded-full bg-white inline-block text-center text-sm text-primary -ml-1 h-6 w-6 border border-primary">
                        <span class="inline-block">
                            <i class="fa-solid fa-check" aria-hidden="false"></i>
                        </span>
                    </span>
                </p>
                <p>
                    {{ label }}
                </p>
            </label>

        </div>
    </template>

    <template v-else>
        <label class="cursor-pointer inline-block px-2 py-1 border-2 border-blue200" :class="[
            checked
                ? 'bg-blue500 text-white border-blue500'
                : 'bg-blue200 text-primary',
                checkboxStyle,
        ]">
            <input @click="onChange(value)" class="appearance-none inline-block rounded mr-2 text-center cursor-pointer"
                type="checkbox" :checked="checked" :disabled="disabled" />
            <Icon class="mr-2 text-white" :icon="checked ? 'fa-solid fa-square-check' : 'fa-solid fa-square'" />
            {{ label }}
        </label>
    </template>
</template> 

<script setup>
import { toRefs, computed, defineEmits } from 'vue';
import Icon from "../Icon.vue";

const props = defineProps({
    label: String,
    active: {
        type: Boolean,
        required: false,
        default: true
    },
    variant: {
        type: String,
        default: 'card' // soit "card", "checkbox", ou "invisible"
    },
    modelValue: {
        type: Boolean,
        required: false,
        default: false,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    isSubmitting: {
        type: Boolean,
        required: false,
        default: false
    },
    labelClass: {
        type: String,
        required: false,
        default: ''
    },
    lineOffset: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const { label, variant, modelValue: checked, disabled, isSubmitting, active } = toRefs(props);
const emit = defineEmits(['change', 'update:modelValue']);

function onChange() {
    emit('change', !checked.value);
    emit('update:modelValue', !checked.value);
}

const checkboxStyle = computed(() => {
    if (checked.value) {
        if (isSubmitting.value || disabled.value) {
            return 'bg-blue300 border-blue300 opacity-85';
        }

        return 'bg-primary border-primary';
    }

    if (isSubmitting.value || disabled.value) {
        return 'bg-G200 hover:border-G400 opacity-85';
    }

    return 'hover:border-G400 hover:border-blue500'
});

const randomId = () => {
    return Math.floor(Math.random() * 50) + 1;
}
</script>
