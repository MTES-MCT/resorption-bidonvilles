<template>
    <FicheSousRubrique>
        <p class="font-bold">Coordonnées GPS</p>

        <p>Lat {{ town.latitude }}, Long {{ town.longitude }}</p>
        <ButtonCopy
            :value="`${this.town.latitude},${this.town.longitude}`"
            @copied="notifyCopy"
            >Copier</ButtonCopy
        >
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { useNotificationStore } from "@/stores/notification.store";

import ButtonCopy from "@/components/ButtonCopy/ButtonCopy.vue";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    town: Object,
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
