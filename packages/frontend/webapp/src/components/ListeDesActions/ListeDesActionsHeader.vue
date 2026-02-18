<template>
    <ViewHeader icon="handshake-angle">
        <template v-slot:title>Liste des actions</template>
        <template v-slot:description
            >Consultez et gérez la liste des actions</template
        >

        <template v-slot:actions>
            <p class="flex space-x-2">
                <DsfrButton
                    v-if="exportList.length > 0"
                    icon="ri:file-excel-fill"
                    secondary
                    @click="openModalExport"
                    size="sm"
                    >Exporter</DsfrButton
                >
                <DsfrButton
                    v-if="userStore.hasPermission('action.create')"
                    @click.prevent.stop="router.push('/action/nouveau')"
                    icon="fr-icon-add-line"
                    size="sm"
                >
                    Déclarer une nouvelle action
                </DsfrButton>
            </p>
        </template>
    </ViewHeader>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useModaleStore } from "@/stores/modale.store";
import { exportComments, exportActions } from "@/api/actions.api";

import router from "@/helpers/router";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ModalExport from "@/components/ListeDesActions/ListeDesActionsExport/ListeDesActionsExportModal.vue";

const userStore = useUserStore();

const props = defineProps({
    years: {
        type: Array,
        required: true,
    },
});

const { years } = toRefs(props);

function openModalExport() {
    const modaleStore = useModaleStore();
    modaleStore.open(ModalExport, {
        exports: exportList,
    });
}

const exportList = computed(() => {
    const list = [];

    if (userStore.hasPermission("action.export") || userStore.user.is_admin) {
        list.push({
            shape: "button",
            displayedOn: "footer",
            label: "Export des actions",
            filename: "actions",
            downloadFn: exportActions,
            format: "xlsx",
            years: years,
        });
    }

    if (
        userStore.hasPermission("action_comment.export") ||
        userStore.user.is_admin
    ) {
        list.push({
            displayedOn: "body",
            label: "Export des commentaires",
            filename: "messages",
            downloadFn: exportComments,
        });
    }

    return list;
});
</script>

<style scoped>
button {
    border: inherit;
}
</style>
