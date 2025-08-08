<template>
    <ViewHeader icon="bell">
        <template v-slot:title>Dernières activités</template>
        <template v-slot:description
            >Consultez les dernières activités au national ou sur votre
            territoire</template
        >
        <template v-slot:actions>
            <p class="flex space-x-2">
                <Button
                    v-if="userStore.hasPermission('data.moderate')"
                    icon="info-circle"
                    iconPosition="left"
                    variant="secondaryOutline"
                    @click="showModeration"
                    size="sm"
                    class="!border-2 !border-secondary hover:!bg-secondary"
                >
                    Voir les règles de modération
                </Button>
                <DsfrButton
                    v-if="userStore.hasPermission('shantytown_comment.export')"
                    icon="ri:file-excel-fill"
                    :loading="exportLoading"
                    @click="exportShantytownComments"
                    size="sm"
                    >Exporter tous les commentaires</DsfrButton
                >
            </p>
        </template>
    </ViewHeader>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import { exportList } from "@/api/shantytown_comments.api";
import downloadCsv from "@/utils/downloadCsv";
import formatDate from "@common/utils/formatDate";

import { Button } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import HistoriqueActivitesReglesModeration from "./HistoriqueActivitesReglesModeration.vue";
import { useModaleStore } from "@/stores/modale.store";

const userStore = useUserStore();
const exportLoading = ref(false);

async function exportShantytownComments() {
    if (exportLoading.value === true) {
        return;
    }

    exportLoading.value = true;
    try {
        const { csv } = await exportList();
        downloadCsv(
            csv,
            `${formatDate(Date.now() / 1000, "y_m_d")}_messages.csv`
        );
    } catch (error) {
        alert(error?.user_message || "Une erreur inconnue est survenue");
    }

    exportLoading.value = false;
}

function showModeration() {
    const modaleStore = useModaleStore();
    modaleStore.open(HistoriqueActivitesReglesModeration);
}
</script>

<style scoped>
button {
    border: inherit;
}
</style>
