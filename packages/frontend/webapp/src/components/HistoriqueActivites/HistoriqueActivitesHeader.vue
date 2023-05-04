<template>
    <ViewHeader icon="bell">
        <template v-slot:title>Historique des activités</template>
        <template v-slot:description
            >Consultez les dernières activités au national ou sur votre
            territoire</template
        >
        <template v-slot:actions>
            <p class="flex space-x-2">
                <Button
                    v-if="
                        userStore.hasPermission('shantytown_comment.moderate')
                    "
                    icon="info-circle"
                    iconPosition="left"
                    variant="secondaryOutline"
                    @click="showModeration"
                    size="sm"
                >
                    Voir les règles de modération
                </Button>
                <Button
                    v-if="userStore.hasPermission('shantytown_comment.export')"
                    icon="file-excel"
                    iconPosition="left"
                    variant="primary"
                    :loading="exportLoading"
                    @click="exportShantytownComments"
                    size="sm"
                    >Exporter tous les commentaires</Button
                >
            </p>

            <HistoriqueActivitesReglesModeration ref="modaleModeration" />
        </template>
    </ViewHeader>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import { getAll } from "@/api/comments.api";
import downloadCsv from "@/utils/downloadCsv";
import formatDate from "@common/utils/formatDate";

import { Button } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import HistoriqueActivitesReglesModeration from "./HistoriqueActivitesReglesModeration.vue";

const userStore = useUserStore();
const exportLoading = ref(false);
const modaleModeration = ref(null);

async function exportShantytownComments() {
    if (exportLoading.value === true) {
        return;
    }

    exportLoading.value = true;
    try {
        const { csv } = await getAll();
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
    modaleModeration.value.open();
}
</script>
