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
        </template>
    </ViewHeader>
</template>

<script setup>
import { useUserStore } from "@/stores/user.store";
import { ref } from "vue";

import { Button } from "@resorptionbidonvilles/ui";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import { getAll } from "@/api/comments.api";

const userStore = useUserStore();
const exportLoading = ref(false);

async function exportShantytownComments() {
    if (exportLoading.value === true) {
        return;
    }

    exportLoading.value = true;
    try {
        const { csv } = await getAll();

        const hiddenElement = document.createElement("a");
        hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        hiddenElement.target = "_blank";
        hiddenElement.download = "messages.csv";
        hiddenElement.click();
    } catch (error) {
        let message = "Une erreur inconnue est survenue";
        if (error && error.user_message) {
            message = error.user_message;
        }

        alert(message);
    }

    exportLoading.value = false;
}
</script>
