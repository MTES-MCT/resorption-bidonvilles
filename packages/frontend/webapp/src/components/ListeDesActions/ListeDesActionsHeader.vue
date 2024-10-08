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
                    v-if="exportList.length > 0"
                    icon="file-excel"
                    iconPosition="left"
                    variant="primaryOutline"
                    @click="openModalExport"
                    >Exporter</Button
                >
                <Button
                    v-if="userStore.hasPermission('action.create')"
                    type="button"
                    href="/action/nouveau"
                    icon="plus"
                    iconPosition="left"
                    variant="primary"
                >
                    Déclarer une nouvelle action
                </Button>
            </p>
        </template>
    </ViewHeader>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useModaleStore } from "@/stores/modale.store";
import { exportComments, exportActions } from "@/api/actions.api";

import { Button } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ModalExport from "@/components/ListeDesActions/ListeDesActionsExport/ListeDesActionsExportModal.vue";
// import ListeDesActionsHeaderExporterCommentaires from "./ListeDesActionsHeaderExporterCommentaires.vue";

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

    if (userStore.hasPermission("action.export")) {
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

    if (userStore.hasPermission("action_comment.export")) {
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
