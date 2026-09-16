<template>
    <TextArea
        ref="textarea"
        :rows="rows"
        id="comment"
        :label="label"
        :placeholder="placeholder"
        :aria-label="label || placeholder || 'Message'"
        @paste="onPaste"
    />
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { TextArea } from "@resorptionbidonvilles/ui";

const props = defineProps({
    rows: Number,
    label: String,
    placeholder: String,
});
const { rows, label, placeholder } = toRefs(props);
const textarea = ref(null);

const emit = defineEmits(["paste"]);

const isFocused = computed(() => {
    return textarea.value?.isFocused;
});

function onPaste(...args) {
    emit("paste", ...args);
}

defineExpose({
    isFocused,
    focus: (...args) => textarea.value.focus(...args),
});
</script>
