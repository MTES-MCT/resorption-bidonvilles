<template>

     <template v-if="variant === 'checkbox'">
            <label class="flex">
                <input id="variant-checkbox" ref="checkbox" @click="onChange(value)" class="inline-block rounded mr-2 text-center" type="checkbox" :checked="checked"/>
                {{ label }}
            </label>
        </template>
        <template v-else-if="variant === 'invisible'">
            <label class="flex items-center justify-between w-full hover:bg-blue200 py-2 px-3 text-primary cursor-pointer">
                <div class="flex-2">
                    {{ label }}
                </div>

                <input id="variant-invisible" ref="checkbox" @click="onChange(value)" class="inline-block rounded mr-2 text-center" type="checkbox" :checked="checked"/>

            </label>

        </template>
        <template v-else-if="variant === 'toggle'">
            <label class="flex">
                <input id="variant-toggle" @click="onChange(value)" class="inline-block rounded mr-2 text-center" type="checkbox" :checked="checked"/>
                {{ label }}
            </label>
        </template>
        <template v-else>
            <label class="inline-block px-4 py-1 border border-blue200 " :class="[
            checked
                ? 'bg-blue500 text-white border-blue500'
                : 'bg-blue200 text-primary',
            isSubmitting ? 'opacity-50' : 'hover:border-blue500',
        ]">
                <input @click="onChange(value)" class="inline-block rounded mr-2 text-center cursor-pointer" type="checkbox" :checked="checked"/>
                {{ label }}
            </label>
        </template>

</template> 

<script setup>
import { toRefs, computed, defineEmits } from 'vue';
import Icon from "../Icon.vue";

const props = defineProps({
    label: String,
    variant: {
        type: String,
        default: 'card' // soit "card", "checkbox", ou "invisible"
    },
    direction: { // soit 'row', soit 'col'
        type: String,
        default: 'row'
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
    }
});

const { label, variant, direction, modelValue: checked, disabled, isSubmitting } = toRefs(props);
const emit = defineEmits(['change', 'update:modelValue']);

function onChange() {
    emit('change', !checked.value);
    emit('update:modelValue', !checked.value);
}

const checkboxStyle = computed(() => {
    if (checked.value) {
        if (isSubmitting.value || disabled.value) {
            return 'bg-blue300 border-blue300';
        }

        return 'bg-primary border-primary';
    }

    if (isSubmitting.value || disabled.value) {
        return 'bg-G200 hover:border-G400';
    }

    return 'bg-white hover:border-G400';
});
</script>

<style scoped>

input[type=checkbox] {
        -moz-appearance:none;
        -webkit-appearance:none;
        -o-appearance:none;

    }

#variant-checkbox, #variant-invisible[type=checkbox] {
    outline: none;
    content: none;	
    width: 24px;
    height: 24px;
    font-size:15px;
    display: block;
}

#variant-checkbox[type=checkbox] {
    border: 2px  solid;
}

#variant-checkbox, #variant-invisible[type=checkbox]:before {
    font-family: "Font Awesome 5 Pro";
    content: "\f00c";
    color: transparent !important;
}

#variant-checkbox[type=checkbox]:checked:before {
color: white !important;
}

#variant-invisible[type=checkbox]:checked:before {
color: #000091 !important;
}

#variant-checkbox[type=checkbox]:checked {
    @apply bg-primary border-primary hover:border-primary;
}

#variant-checkbox[type=checkbox]{
    @apply border-G200 bg-white hover:border-G400 cursor-pointer
}



#variant-toggle[type=checkbox] {
    @apply rounded-2xl w-11 h-6 flex shrink-0 items-center px-px border border-primary justify-start ;
}

#variant-toggle[type=checkbox]:before {
	font-family: "Font Awesome 5 Pro";
    content: "\f00c";
    @apply absolute h-6 w-6 rounded-full border border-primary inline-block text-center text-sm text-primary bg-white;
}

#variant-toggle[type=checkbox]:checked:before {
@apply h-5 w-5;
}

#variant-toggle[type=checkbox]:checked {
    @apply bg-primary border-primary hover:border-primary justify-end;
}

#variant-toggle[type=checkbox]{
    @apply bg-white cursor-pointer
}




</style>