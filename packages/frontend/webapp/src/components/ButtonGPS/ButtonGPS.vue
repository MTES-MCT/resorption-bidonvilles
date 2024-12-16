<template>
    <div class="flex flex-col">
        <p>Latitude : {{ town.latitude }}</p>
        <p>Longitude : {{ town.longitude }}</p>
    </div>
    <div>
        <ButtonCopy
            :value="`${town.latitude},${town.longitude}`"
            @copied="notifyCopy"
            >Copier</ButtonCopy
        >
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useNotificationStore } from "@/stores/notification.store";
import ButtonCopy from "@/components/ButtonCopy/ButtonCopy.vue";

const props = defineProps({
    town: {
        type: Object,
        required: true,
    },
});
const { town } = toRefs(props);

function notifyCopy() {
    const notificationStore = useNotificationStore();

    notificationStore.success(
        "Succès",
        "Les coordonnées ont été copiées dans le presse-papier"
    );
}
</script>
