<template>
    <div class="flex justify-between">
        <HistoryFilters />
        <Button
            v-if="hasPermission('shantytown_comment.export')"
            icon="file-excel"
            iconPosition="left"
            :loading="exportLoading"
            variant="primary"
            @click="exportComments"
            >Exporter tous les commentaires</Button
        >
    </div>
</template>

<script>
import HistoryFilters from "./HistoryFilters.vue";
import { getAll } from "#helpers/api/comment";
import { hasPermission } from "#helpers/api/config";

export default {
    components: {
        HistoryFilters
    },

    data() {
        return {
            exportLoading: false
        };
    },

    methods: {
        hasPermission,
        async exportComments() {
            if (this.exportLoading === true) {
                return;
            }

            this.exportLoading = true;
            try {
                const { csv } = await getAll();

                const hiddenElement = document.createElement("a");
                hiddenElement.href =
                    "data:text/csv;charset=utf-8," + encodeURI(csv);
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

            this.exportLoading = false;
        }
    }
};
</script>
