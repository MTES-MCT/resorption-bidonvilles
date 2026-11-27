<template>
    <ViewHeader icon="handshake-angle">
        <template v-slot:title>Liste des actions</template>
        <template v-slot:description
            >Consultez et gérez la liste des actions</template
        >

        <template v-slot:actions>
            <DsfrButtonGroup
                v-if="headerButtons.length > 0"
                :buttons="headerButtons"
                size="sm"
                inlineLayoutWhen="md"
                class="fr-btns-group--icon-left"
            />
        </template>
    </ViewHeader>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { useActionsStore } from "@/stores/actions.store";
import { useModaleStore } from "@/stores/modale.store";
import { exportComments, exportActions } from "@/api/actions.api";

import buildActionsExportParams from "@/utils/buildActionsExportParams";
import computeExportableYears from "@/utils/computeExportableYears";
import readExportErrorMessage from "@/utils/readExportErrorMessage";
import ViewHeader from "@/components/ViewHeader/ViewHeader.vue";
import ModalExport from "@/components/ListeDesActions/ListeDesActionsExport/ListeDesActionsExportModal.vue";

const router = useRouter();
const userStore = useUserStore();
const actionsStore = useActionsStore();

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

function openNewAction() {
    return router.push("/action/nouveau");
}

const headerButtons = computed(function computeHeaderButtons() {
    const buttons = [];

    if (exportList.value.length > 0) {
        buttons.push({
            label: "Exporter",
            icon: "ri:file-excel-fill",
            secondary: true,
            onClick: openModalExport,
        });
    }

    if (userStore.hasPermission("action.create")) {
        buttons.push({
            label: "Déclarer une nouvelle action",
            icon: "fr-icon-add-line",
            onClick: openNewAction,
        });
    }

    return buttons;
});

// Paramètres de l'export des actions d'après l'état courant de la liste.
// `null` quand l'export est impossible (onglet « Ma structure » sans structure) :
// cas normalement inatteignable, `downloadActions` le refuse par sécurité.
function getActionsExportParams() {
    return buildActionsExportParams({
        status: actionsStore.filters.status,
        search: actionsStore.filters.search,
        location: actionsStore.filters.location,
        properties: actionsStore.filters.properties,
        userOrganizationId: userStore.user?.organization?.id,
    });
}

// Années proposées à l'export des actions : celles de la vue qui ont au moins
// une action exportable (actions affichées dans l'onglet actif, actives cette année-là).
const exportableYears = computed(function computeExportableYearsList() {
    return computeExportableYears(
        actionsStore.filteredActions[actionsStore.filters.status],
        years.value
    );
});

const exportList = computed(function computeExportList() {
    const list = [];

    if (
        (userStore.hasPermission("action.export") || userStore.user.is_admin) &&
        exportableYears.value.length > 0
    ) {
        list.push({
            shape: "button",
            displayedOn: "footer",
            label: "Export des actions",
            filename: "actions",
            downloadFn: async function downloadActions(year) {
                // Filtres lus au moment du téléchargement pour refléter l'état courant de la liste.
                const params = getActionsExportParams();
                if (params === null) {
                    const error = new Error("Export impossible sans structure");
                    error.user_message =
                        "Aucune action à exporter : votre compte n'est rattaché à aucune structure.";
                    throw error;
                }

                try {
                    return await exportActions(year, params);
                } catch (error) {
                    // Requête en blob : le message de l'API (ex. 404 « rien à exporter »)
                    // arrive sous forme de Blob, on le lit pour l'afficher.
                    const userMessage = await readExportErrorMessage(error);
                    // Object.assign conserve message et stack de l'Error d'origine.
                    throw userMessage
                        ? Object.assign(error, { user_message: userMessage })
                        : error;
                }
            },
            format: "xlsx",
            years: exportableYears.value,
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
