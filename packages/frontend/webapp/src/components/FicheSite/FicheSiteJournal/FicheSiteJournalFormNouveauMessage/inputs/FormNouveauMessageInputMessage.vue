<template>
    <TextArea
        ref="textarea"
        :rows="rows"
        id="comment"
        :label="labels.comment"
        placeholder="Partagez votre passage sur le site, le contexte sanitaire, la situation des habitants, difficultés rencontrées lors de votre intervention…"
        @paste="onPaste"
    />
</template>

<script setup>
import { defineProps, defineExpose, ref, computed, toRefs } from "vue";
import labels from "../FicheSiteJournalFormNouveauMessage.labels";
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
