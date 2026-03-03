<template>
    <DsfrTag
        :label="label"
        :icon="copied ? 'fr-icon-success-line' : 'mdi:content-copy'"
        :class="{ clicked: copied }"
        small
        selectable
        @click.prevent="copy"
    />
</template>
<script setup>
import { ref, toRefs } from "vue";
import copyToClipboard from "@/utils/copyToClipboard";
import { useNotificationStore } from "@/stores/notification.store";
const props = defineProps({
    label: String,
    dataType: String,
});
const { label, dataType } = toRefs(props);
const copied = ref(false);
const notificationStore = useNotificationStore();

const copy = async () => {
    const success = await copyToClipboard(label.value);
    if (success) {
        copied.value = true;
        notificationStore.success(
            "Élément copié dans le presse-papier",
            `${dataType.value} copié dans le presse-papier`
        );
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } else {
        notificationStore.error(
            "Erreur lors de la copie",
            `Impossible de copier ${dataType.value} dans le presse-papier`
        );
    }
};
</script>
<style scoped>
.clicked {
    background-color: #d4edda;
    color: #155724;
    transition: all 0.3s ease;
}
</style>
