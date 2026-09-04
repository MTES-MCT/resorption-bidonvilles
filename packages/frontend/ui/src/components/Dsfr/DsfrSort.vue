<template>
    <DsfrSelect
        :selectId="name"
        :name="name"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :options="selectOptions"
        label="Trier par"
    />
</template>

<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({
    name: String,
    modelValue: String,
    options: {
        type: Array,
        default() {
            return [];
        },
    },
});
const { options } = toRefs(props);
defineEmits(["update:modelValue"]);

const selectOptions = computed(() =>
    options.value.map(({ value, label }) => ({ value, text: label }))
);
</script>

<style scoped>
:deep(.fr-select) {
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 0.25rem 0.25rem 0 0;
    box-shadow: inset 0 -2px 0 0 var(--blue-france-sun-113-625);
}

:deep(.fr-select:focus),
:deep(.fr-select:focus-visible) {
    outline: 2px solid #0a76f6;
    outline-offset: 2px;
}
</style>
