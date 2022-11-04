<template>
    <ViewHeader icon="handshake-angle">
        <template v-slot:title>Liste des actions</template>
        <template v-slot:description
            >Consultez et gérez la liste des actions au national ou sur votre
            territoire</template
        >
        <template v-slot:actions>
            <p class="flex space-x-2">
                <Button
                    v-if="userStore.hasPermission('plan.export')"
                    icon="file-excel"
                    iconPosition="left"
                    variant="primary"
                    @click="openModalExport"
                    size="sm"
                    >Exporter</Button
                >
                <Button
                    v-if="userStore.hasPermission('plan.create')"
                    href="/nouvelle_action"
                    icon="plus"
                    iconPosition="left"
                    variant="secondary"
                    size="sm"
                >
                    Déclarer une nouvelle action
                </Button>
            </p>
        </template>
    </ViewHeader>

    <ModalExport ref="modalExport" :exports="exportList" />
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import exportList from "./ListeDesActions.exports";

import { Button } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ModalExport from "@/components/ModalExport/ModalExport.vue";

const userStore = useUserStore();
const modalExport = ref(null);

function openModalExport() {
    modalExport.value.open();
}
</script>
