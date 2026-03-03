<template>
    <DsfrButton
        tertiary
        :disabled="copied"
        size="sm"
        :icon="copied ? 'fr-icon-success-line' : 'mdi:content-copy'"
        iconPosition="left"
        @click.prevent="copy"
        href="#"
        :padding="false"
        :label="copyText"
    />
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import copyToClipboard from "@/utils/copyToClipboard";

const props = defineProps({
    value: String,
});
const { value } = toRefs(props);
const copied = ref(false);
const copyText = computed(() => {
    return copied.value ? "Copié" : "Copier";
});
const emit = defineEmits(["copied"]);
async function copy() {
    copied.value = true;
    const result = await copyToClipboard(value.value);
    if (result) {
        emit("copied");
    }
    setTimeout(() => {
        copied.value = false;
    }, 2000);
}
</script>
