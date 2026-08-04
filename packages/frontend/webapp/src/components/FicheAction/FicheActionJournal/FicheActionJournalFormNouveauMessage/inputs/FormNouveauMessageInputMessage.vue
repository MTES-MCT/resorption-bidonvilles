<template>
    <TextArea
        ref="textarea"
        :rows="rows"
        id="comment"
        :label="labels.comment"
        placeholder="Partagez vos informations concernant l'action"
        @paste="onPaste"
    />
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import labels from "../FicheActionJournalFormNouveauMessage.labels";
import { TextArea } from "@resorptionbidonvilles/ui";

const props = defineProps({
    rows: Number,
});
const { rows } = toRefs(props);
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
